import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { firebaseAuth, firebaseDB } from "./useFirebase";

/**
 * User types for Panda Factory
 */
export const UserType = {
  FOUNDER: "founder", // Lucas - full access, Ed25519 signed
  DEV: "dev", // Developers - SDK access
  USER: "user", // Regular users - basic access
  GUEST: "guest", // Not logged in
};

/**
 * Auth methods
 */
export const AuthMethod = {
  GOOGLE: "google",
  EMAIL: "email",
  LOGINGATE: "logingate", // Legacy email-based (mock/demo)
};

/**
 * Founder emails — the ONE source of truth for founder detection.
 * Matches the emails used in Firebase Console + PFLoginGate credentials.
 */
const FOUNDER_EMAILS = ["lucassvalerio@gmail.com"];

/**
 * Mock user data for development (when Firebase is not configured)
 * 2-tier model: Founder + User (User can toggle Dev Mode in-app)
 */
const MOCK_USERS = {
  // Founder auth is ONLY via Firebase (Google Sign-In) — never mock.
  "user@panda.com": {
    uid: "user-demo",
    email: "user@panda.com",
    displayName: "Demo User",
    userType: UserType.USER,
    pcBalance: 100,
  },
};

/**
 * Map a Firebase User object to Panda user domain model.
 * DDD: This is the anti-corruption layer between Firebase (infra) and our domain.
 */
function mapFirebaseUser(firebaseUser) {
  const email = firebaseUser.email || "";
  const isFounder = FOUNDER_EMAILS.some(
    (fe) => fe.toLowerCase() === email.toLowerCase(),
  );

  return {
    uid: firebaseUser.uid,
    email: email,
    displayName: firebaseUser.displayName || email.split("@")[0],
    photoURL: firebaseUser.photoURL || null,
    userType: isFounder ? UserType.FOUNDER : UserType.USER,
    authMethod:
      firebaseUser.providerData?.[0]?.providerId === "google.com"
        ? AuthMethod.GOOGLE
        : AuthMethod.EMAIL,
    founderPercent: isFounder ? 5 : undefined,
  };
}

/**
 * Auth Context
 */
const AuthContext = createContext(null);

/**
 * Auth Provider Component — Dual Mode: Firebase (real) + Mock (fallback)
 *
 * When Firebase is properly configured (.env has VITE_FIREBASE_* vars),
 * uses real Firebase Auth (Google Sign-In, onAuthStateChanged).
 * When Firebase is not available, falls back to mock mode for development.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);

  // ── Expose getToken globally for Panda.Auth SDK ──
  useEffect(() => {
    window.__pandaFirebaseAuth = firebaseAuth;
    // Bind Panda.Wallet to RTDB
    if (typeof Panda !== "undefined" && Panda.Wallet?.bindDB) {
      Panda.Wallet.bindDB(firebaseDB);
    }
  }, []);

  // ── Bootstrap: detect Firebase availability ──
  useEffect(() => {
    let unsubscribe = null;
    let authResolved = false;

    // Safety timeout — if Firebase never responds (invalid config, network),
    // fall back to mock mode after 5 seconds instead of stuck "loading" forever.
    const safetyTimeout = setTimeout(() => {
      if (!authResolved) {
        console.warn(
          "[useAuth] Firebase auth timeout — falling back to mock mode",
        );
        authResolved = true;
        setFirebaseReady(false);

        // Restore logingate session if present
        const storedUser = localStorage.getItem("panda_user");
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed.authMethod === AuthMethod.LOGINGATE) {
              setUser(parsed);
            }
          } catch (e) {
            localStorage.removeItem("panda_user");
          }
        }
        setIsLoading(false);
      }
    }, 5000);

    // Try Firebase onAuthStateChanged first
    try {
      unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser) => {
        authResolved = true;
        clearTimeout(safetyTimeout);
        setFirebaseReady(true);
        if (firebaseUser) {
          const pandaUser = mapFirebaseUser(firebaseUser);
          setUser(pandaUser);
          localStorage.setItem("panda_user", JSON.stringify(pandaUser));
          // Sync to Panda SDK Auth layer
          if (typeof Panda !== "undefined" && Panda.Auth?.syncUser) {
            Panda.Auth.syncUser(pandaUser);
          }
          // Initialize wallet for this user
          if (typeof Panda !== "undefined" && Panda.Wallet?.init) {
            Panda.Wallet.init(pandaUser.uid).catch((e) =>
              console.warn("Wallet init:", e.message),
            );
          }
        } else {
          // Firebase says no user — check if there's a mock/logingate session
          const storedUser = localStorage.getItem("panda_user");
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              if (parsed.authMethod === AuthMethod.LOGINGATE) {
                // Keep logingate sessions alive (demo mode)
                setUser(parsed);
              } else {
                // Firebase user was signed out — clear stale data
                setUser(null);
                localStorage.removeItem("panda_user");
              }
            } catch (e) {
              localStorage.removeItem("panda_user");
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setIsLoading(false);
      });
    } catch (err) {
      // Firebase not initialized — pure mock mode
      console.warn(
        "[useAuth] Firebase not available, using mock mode:",
        err.message,
      );
      authResolved = true;
      clearTimeout(safetyTimeout);
      setFirebaseReady(false);

      const storedUser = localStorage.getItem("panda_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem("panda_user");
        }
      }
      setIsLoading(false);
    }

    return () => {
      clearTimeout(safetyTimeout);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  /**
   * Login with Google (Firebase Auth)
   */
  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Timeout: if popup hangs (blocked, invalid config), abort after 15s
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("POPUP_TIMEOUT")), 15000),
      );

      const firebaseUser = await Promise.race([
        firebaseAuth.signInWithGoogle(),
        timeoutPromise,
      ]);
      // onAuthStateChanged will handle the user mapping
      console.log("🔥 Google login success:", firebaseUser.email);
    } catch (err) {
      // If Firebase is not configured, show helpful error
      if (!firebaseReady || err.message?.includes("not initialized")) {
        setError("Firebase não configurado. Use as credenciais demo abaixo.");
      } else if (err.message === "POPUP_TIMEOUT") {
        setError(
          "Popup de login bloqueado ou sem resposta. Verifique o bloqueador de popup.",
        );
      } else if (err.code === "auth/popup-closed-by-user") {
        // User closed the popup — not an error
        setError(null);
      } else if (err.code === "auth/unauthorized-domain") {
        setError(
          "Domínio não autorizado no Firebase. Adicione localhost em Firebase Console > Authentication > Settings.",
        );
      } else if (
        err.code === "auth/api-key-not-valid.-please-pass-a-valid-api-key."
      ) {
        setError(
          "API Key do Firebase inválida. Configure o arquivo .env com as credenciais corretas.",
        );
      } else if (err.code === "auth/popup-blocked") {
        setError(
          "Popup bloqueado pelo navegador. Permita popups para este site.",
        );
      } else {
        setError(err.message || "Google login falhou");
      }
    } finally {
      setIsLoading(false);
    }
  }, [firebaseReady]);

  /**
   * Login with Email/Password (Firebase Auth or Mock fallback)
   */
  const loginWithEmail = useCallback(
    async (email, password) => {
      setIsLoading(true);
      setError(null);

      try {
        if (firebaseReady) {
          // Try real Firebase email/password auth
          const firebaseUser = await firebaseAuth.signInWithEmail(
            email,
            password,
          );
          console.log("🔥 Email login success:", firebaseUser.email);
          // onAuthStateChanged will handle the user mapping
        } else {
          // Fallback: Mock mode (for development / demo)
          await new Promise((r) => setTimeout(r, 500));
          const mockUser = MOCK_USERS[email.toLowerCase()];
          if (!mockUser) {
            throw new Error("User not found");
          }
          if (password.length < 4) {
            throw new Error("Invalid password");
          }
          const userWithMethod = { ...mockUser, authMethod: AuthMethod.EMAIL };
          setUser(userWithMethod);
          localStorage.setItem("panda_user", JSON.stringify(userWithMethod));
        }
      } catch (err) {
        const msg =
          err.code === "auth/invalid-credential"
            ? "Invalid email or password"
            : err.code === "auth/user-not-found"
              ? "No account found with this email"
              : err.message || "Login failed";
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [firebaseReady],
  );

  /**
   * Login via LoginGate (legacy email-based credentials with hash)
   * Used by PFLoginGate.jsx for demo/development
   */
  const loginWithGate = useCallback(async (profile) => {
    const gateUser = { ...profile, authMethod: AuthMethod.LOGINGATE };
    setUser(gateUser);
    localStorage.setItem("panda_user", JSON.stringify(gateUser));
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      // Sign out from Firebase (if active)
      try {
        await firebaseAuth.signOut();
      } catch (e) {
        // Firebase not initialized — that's fine
      }

      setUser(null);
      localStorage.removeItem("panda_user");
      sessionStorage.removeItem("panda_auth");
      sessionStorage.removeItem("panda_auth_token");
      // Cleanup Panda SDK
      if (typeof Panda !== "undefined") {
        Panda.Auth?.syncUser(null);
        Panda.Wallet?.destroy();
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  /**
   * Check if user is Founder
   */
  const isFounder = user?.userType === UserType.FOUNDER;

  /**
   * Check if user is Dev
   */
  const isDev = user?.userType === UserType.DEV || isFounder;

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = !!user;

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated,
    isFounder,
    isDev,
    firebaseReady,
    loginWithGoogle,
    loginWithEmail,
    loginWithGate,
    logout,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export default useAuth;
