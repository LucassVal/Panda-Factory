
import os

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

firebase_js = """
<script type="module">
    // 🐼 Panda Fabrics - Firebase Bridge (Frontend)
    // Connects Browser -> Firebase -> Rust Agent
    
    // Config Placeholder (User needs to fill this securely)
    const FIREBASE_CONFIG = {
        databaseURL: "https://YOUR-PROJECT.firebasedatabase.app",
        projectId: "YOUR-PROJECT",
    };

    class PandaBridgeFirebase {
        constructor() {
            this.uid = null;
            this.db = null; // Initialize Firebase ref
            this.status = 'disconnected';
            this.monitors = {
                fb: document.querySelector('.status-pill[title*="Firebase"] .status-dot'),
                ru: document.querySelector('.status-pill[title*="Rust"] .status-dot')
            };
            
            console.log("🐼 Bridge: Initializing...");
            this.updateStatus('fb', 'warning'); // Connecting
        }

        async connect(uid) {
            this.uid = uid;
            // Mock connection success
            setTimeout(() => {
                this.status = 'connected';
                this.updateStatus('fb', 'online');
                console.log(`🐼 Bridge: Connected to Channel [${uid}]`);
                
                // Simulate heartbeat from Rust
                this.simulateRustHeartbeat();
            }, 1000);
        }
           
        updateStatus(agent, state) {
            // state: online, warning, offline
            if(this.monitors[agent]) {
                const dot = this.monitors[agent];
                dot.className = `status-dot ${state}`;
            }
        }

        async sendCommand(action, payload) {
            if (this.status !== 'connected') {
                console.warn("🐼 Bridge: Offline. Check Firebase.");
                return;
            }
            
            const cmdId = Date.now().toString(36);
            const securePayload = this.encrypt(payload); // Client-side encryption
            
            console.log(`🚀 Sending Command [${action}] -> Firebase...`);
            // Real code would use: set(ref(db, `channels/${this.uid}/command_queue/${cmdId}`), ...)
            
            return cmdId;
        }

        encrypt(data) {
            // TODO: Implement AES-GCM 256 here.
            // For now, identity.
            return data;
        }
        
        simulateRustHeartbeat() {
            // Mocking Rust agent coming online after a few seconds
            setTimeout(() => {
                this.updateStatus('ru', 'online');
                console.log("🦀 Rust Agent: ONLINE via Firebase");
            }, 3000);
        }
    }

    // Expose Global
    window.PandaBridge = new PandaBridgeFirebase();
    
    // Auto-connect on load (Mock ID)
    window.addEventListener('load', () => {
        window.PandaBridge.connect('user_123_mock');
    });

</script>
"""

def inject_bridge():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inject at the end, before </body>
    if "class PandaBridgeFirebase" not in content:
        content = content.replace("</body>", firebase_js + "\n</body>")
        print("Injected PandaBridgeFirebase JS.")
    else:
        print("Bridge already present.")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    inject_bridge()
