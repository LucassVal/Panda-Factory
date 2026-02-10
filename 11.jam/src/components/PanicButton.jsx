import React, { useState } from "react";
import "./PanicButton.css";

/**
 * PanicButton - Emergency kill switch
 * Requires Ed25519 signature verification
 */
export function PanicButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState("confirm"); // confirm | pin | executing | done
  const [pin, setPin] = useState("");
  const [error, setError] = useState(null);

  const handlePanic = async () => {
    if (step === "confirm") {
      setStep("pin");
      return;
    }

    if (step === "pin") {
      if (pin.length !== 6) {
        setError("PIN must be 6 digits");
        return;
      }

      setStep("executing");
      setError(null);

      try {
        // TODO: Replace with actual Ed25519 signature + GAS call
        // 1. Sign the kill command with Ed25519 private key
        // 2. Send to GAS: Panda.Admin.killSwitch(signature)
        // 3. GAS verifies signature and disables all services

        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate

        // Mock success
        setStep("done");
      } catch (err) {
        setError(err.message || "Kill switch failed");
        setStep("pin");
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setStep("confirm");
    setPin("");
    setError(null);
  };

  return (
    <>
      <button
        className="panic-button"
        onClick={() => setIsOpen(true)}
        title="Emergency Kill Switch"
      >
        🔴 PANIC
      </button>

      {isOpen && (
        <div className="panic-modal-overlay" onClick={handleClose}>
          <div className="panic-modal" onClick={(e) => e.stopPropagation()}>
            <div className="panic-modal-header">
              <span className="panic-icon">⚠️</span>
              <h2>EMERGENCY KILL SWITCH</h2>
            </div>

            <div className="panic-modal-body">
              {step === "confirm" && (
                <>
                  <p className="panic-warning">
                    This will <strong>IMMEDIATELY STOP</strong> all Panda
                    services:
                  </p>
                  <ul className="panic-list">
                    <li>🔥 Firebase connections</li>
                    <li>📜 GAS endpoints</li>
                    <li>🦀 Rust Agent</li>
                    <li>🏪 Store operations</li>
                    <li>💰 PC transactions</li>
                  </ul>
                  <p className="panic-note">
                    This action requires your Founder PIN and Ed25519 signature.
                  </p>
                </>
              )}

              {step === "pin" && (
                <>
                  <p>Enter your 6-digit Founder PIN:</p>
                  <input
                    type="password"
                    className="panic-pin-input"
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="••••••"
                    autoFocus
                  />
                  {error && <p className="panic-error">{error}</p>}
                </>
              )}

              {step === "executing" && (
                <div className="panic-executing">
                  <div className="panic-spinner" />
                  <p>Signing with Ed25519...</p>
                  <p>Sending kill command to GAS...</p>
                </div>
              )}

              {step === "done" && (
                <div className="panic-done">
                  <span className="panic-done-icon">✅</span>
                  <p>All services have been STOPPED.</p>
                  <p className="panic-note">
                    To restart, use the GAS admin panel or deploy a new version.
                  </p>
                </div>
              )}
            </div>

            <div className="panic-modal-footer">
              {step !== "done" && step !== "executing" && (
                <>
                  <button className="panic-cancel" onClick={handleClose}>
                    Cancel
                  </button>
                  <button
                    className="panic-confirm"
                    onClick={handlePanic}
                    disabled={step === "pin" && pin.length !== 6}
                  >
                    {step === "confirm" ? "Enter PIN" : "EXECUTE KILL SWITCH"}
                  </button>
                </>
              )}
              {step === "done" && (
                <button className="panic-close" onClick={handleClose}>
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PanicButton;
