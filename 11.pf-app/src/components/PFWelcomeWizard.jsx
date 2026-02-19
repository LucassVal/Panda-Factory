import React, { useState, useCallback } from "react";
import "./PFWelcomeWizard.css";

/**
 * 🧙 PFWelcomeWizard — First-Time Onboarding (Wave 2)
 *
 * 4-step persistent wizard shown only once per user.
 * Uses localStorage.panda_onboarding_complete for persistence.
 * Design: glassmorphism overlay, step dots, scale-in animation.
 *
 * Steps:
 *   1. Welcome — brand + value prop
 *   2. Your Powers — Dock, Canvas, Chat overview
 *   3. The Medusa Store — marketplace + publishing
 *   4. Get Started — CTA: create or explore
 */

const STEPS = [
  {
    id: "welcome",
    icon: "🐼",
    title: "WELCOME TO PANDA FABRICS",
    subtitle: "Your modular creation platform",
    content:
      "Panda Fabrics is your infinite workspace to create, publish, and monetize. Fully modular, fully connected.",
    visual: "./panda-icon.png",
  },
  {
    id: "powers",
    icon: "⚡",
    title: "YOUR POWERS",
    subtitle: "Tools that grow with you",
    content: null, // Rendered as feature cards
    features: [
      {
        icon: "🎨",
        name: "INFINITE CANVAS",
        desc: "Draw, design, and organize without limits",
      },
      {
        icon: "🧠",
        name: "PANDA AI",
        desc: "5 AI models ready to help",
      },
      {
        icon: "🛠️",
        name: "TOOL DOCK",
        desc: "Everything accessible in one click",
      },
    ],
  },
  {
    id: "store",
    icon: "🏪",
    title: "THE MEDUSA STORE",
    subtitle: "Extension marketplace",
    content:
      "Install apps, tools, and plugins created by the community. Publish yours and earn automatic royalties via PAT tokens.",
    features: [
      {
        icon: "📦",
        name: "INSTALL",
        desc: "Ready-to-use apps",
      },
      {
        icon: "🚀",
        name: "PUBLISH",
        desc: "Launch your creations",
      },
      {
        icon: "💰",
        name: "MONETIZE",
        desc: "Automatic royalties",
      },
    ],
  },
  {
    id: "start",
    icon: "🚀",
    title: "GET STARTED",
    subtitle: "Choose where to begin",
    content: null, // Rendered as CTA buttons
  },
];

function PFWelcomeWizard({ onComplete, onOpenStore }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [direction, setDirection] = useState("forward");

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = useCallback(() => {
    if (isLastStep) return;
    setDirection("forward");
    setCurrentStep((s) => s + 1);
  }, [isLastStep]);

  const handleBack = useCallback(() => {
    if (isFirstStep) return;
    setDirection("back");
    setCurrentStep((s) => s - 1);
  }, [isFirstStep]);

  const handleComplete = useCallback(
    (action) => {
      setExiting(true);
      localStorage.setItem("panda_onboarding_complete", "true");
      setTimeout(() => {
        if (onComplete) onComplete(action);
      }, 400);
    },
    [onComplete],
  );

  const handleSkip = useCallback(() => {
    handleComplete("skip");
  }, [handleComplete]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        if (!isLastStep) handleNext();
      } else if (e.key === "ArrowLeft") {
        if (!isFirstStep) handleBack();
      } else if (e.key === "Escape") {
        handleSkip();
      }
    },
    [handleNext, handleBack, handleSkip, isLastStep, isFirstStep],
  );

  return (
    <div
      className={`pf-wizard-overlay ${exiting ? "pf-wizard-exit" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome wizard"
      onKeyDown={handleKeyDown}
    >
      <div className="pf-wizard-backdrop" />

      <div className="pf-wizard-container">
        {/* Close button — always visible */}
        <button
          className="pf-wizard-close-btn"
          onClick={handleSkip}
          aria-label="Close wizard"
          title="Close"
        >
          ✕
        </button>
        {/* Step content */}
        <div
          className={`pf-wizard-step ${direction}`}
          key={step.id}
        >
          {/* Step 1: Welcome */}
          {step.id === "welcome" && (
            <div className="pf-wizard-welcome">
              <img
                src={step.visual}
                alt="Panda Fabrics"
                className="pf-wizard-logo"
              />
              <h2 className="pf-wizard-title">{step.title}</h2>
              <p className="pf-wizard-subtitle">{step.subtitle}</p>
              <p className="pf-wizard-text">{step.content}</p>
            </div>
          )}

          {/* Step 2 & 3: Feature cards */}
          {step.features && step.id !== "start" && (
            <div className="pf-wizard-features-step">
              <div className="pf-wizard-step-icon">{step.icon}</div>
              <h2 className="pf-wizard-title">{step.title}</h2>
              <p className="pf-wizard-subtitle">{step.subtitle}</p>
              {step.content && (
                <p className="pf-wizard-text">{step.content}</p>
              )}
              <div className="pf-wizard-features">
                {step.features.map((f) => (
                  <div key={f.name} className="pf-wizard-feature-card">
                    <span className="pf-wizard-feature-icon">{f.icon}</span>
                    <strong className="pf-wizard-feature-name">{f.name}</strong>
                    <span className="pf-wizard-feature-desc">{f.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: CTA */}
          {step.id === "start" && (
            <div className="pf-wizard-cta-step">
              <div className="pf-wizard-step-icon">{step.icon}</div>
              <h2 className="pf-wizard-title">{step.title}</h2>
              <p className="pf-wizard-subtitle">{step.subtitle}</p>

              <div className="pf-wizard-cta-cards">
                <button
                  className="pf-wizard-cta-card"
                  onClick={() => handleComplete("draw")}
                  aria-label="Create first project"
                >
                  <span className="pf-wizard-cta-icon">✏️</span>
                  <strong>CREATE FIRST PROJECT</strong>
                  <span className="pf-wizard-cta-desc">
                    Open the canvas and start drawing
                  </span>
                </button>

                <button
                  className="pf-wizard-cta-card"
                  onClick={() => {
                    handleComplete("store");
                    if (onOpenStore) onOpenStore();
                  }}
                  aria-label="Explore the Store"
                >
                  <span className="pf-wizard-cta-icon">🏪</span>
                  <strong>EXPLORE THE STORE</strong>
                  <span className="pf-wizard-cta-desc">
                    Discover ready-made apps and tools
                  </span>
                </button>

                <button
                  className="pf-wizard-cta-card"
                  onClick={() => handleComplete("chat")}
                  aria-label="Chat with AI"
                >
                  <span className="pf-wizard-cta-icon">🧠</span>
                  <strong>CHAT WITH AI</strong>
                  <span className="pf-wizard-cta-desc">
                    Ask for help or get inspired
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step indicator dots */}
        <div className="pf-wizard-dots" role="tablist" aria-label="Wizard steps">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              className={`pf-wizard-dot ${i === currentStep ? "active" : ""} ${i < currentStep ? "completed" : ""}`}
              onClick={() => {
                setDirection(i > currentStep ? "forward" : "back");
                setCurrentStep(i);
              }}
              role="tab"
              aria-selected={i === currentStep}
              aria-label={`Step ${i + 1}: ${s.title}`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="pf-wizard-nav">
          <button
            className="pf-wizard-skip-btn"
            onClick={handleSkip}
            aria-label={isLastStep ? "Close wizard" : "Skip introduction"}
          >
            {isLastStep ? "CLOSE" : "SKIP"}
          </button>

          <div className="pf-wizard-nav-right">
            {!isFirstStep && (
              <button
                className="pf-wizard-back-btn"
                onClick={handleBack}
                aria-label="Back"
              >
                ← BACK
              </button>
            )}
            {!isLastStep ? (
              <button
                className="pf-wizard-next-btn"
                onClick={handleNext}
                aria-label="Next"
              >
                NEXT →
              </button>
            ) : (
              <button
                className="pf-wizard-finish-btn"
                onClick={() => handleComplete("finish")}
                aria-label="Finish and close wizard"
              >
                FINISH ✓
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PFWelcomeWizard;
