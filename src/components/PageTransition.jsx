import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Global state (transition management)
if (!window.transitionState) {
  window.transitionState = {
    isTransitioning: false,
    pendingRoute: null,
    startTransition: null,
  };
}

const PageTransition = (OgComponent) => {
  const TransitionWrapper = (props) => {
    const navigate = useNavigate();
    const [shouldTransition, setShouldTransition] = useState(false);
    const [transitionStage, setTransitionStage] = useState("initial");
    // stages: initial → red → red-pause → red-down

    useEffect(() => {
      window.transitionState.startTransition = (newRoute) => {
        if (!window.transitionState.isTransitioning) {
          window.transitionState.isTransitioning = true;
          window.transitionState.pendingRoute = newRoute;
          setShouldTransition(true);
          setTransitionStage("red");
        }
      };

      return () => {
        window.transitionState.startTransition = null;
      };
    }, []);

    const handleTransitionComplete = () => {
      window.transitionState.isTransitioning = false;
      window.transitionState.pendingRoute = null;
      setShouldTransition(false);
      setTransitionStage("initial");
    };

    return (
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Page Content */}
        <AnimatePresence mode="wait">
          {!shouldTransition && (
            <motion.div
              key="page-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative z-10"
            >
              <OgComponent {...props} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Curtain */}
        <AnimatePresence>
          {shouldTransition && (
            <motion.div
              key="curtain"
              className="fixed inset-0 w-full h-full z-[9999] pointer-events-none"
              initial={{ y: "-100%", backgroundColor: "gray" }}
              animate={
                transitionStage === "red"
                  ? { y: "100%", backgroundColor: "gray" } // Slide down to cover
                  : transitionStage === "red-pause"
                  ? { y: "0%", backgroundColor: "gray" } // Stay full cover
                  : transitionStage === "red-down"
                  ? { y: "100%", backgroundColor: "gray" } // Slide down to bottom
                  : { y: "-100%" }
              }
              transition={{ duration: 2, ease: "easeInOut" }}
              onAnimationComplete={() => {
                if (transitionStage === "red") {
                  // Navigate exactly waise hi jaise tera original code me tha
                  const targetRoute = window.transitionState.pendingRoute;
                  if (targetRoute) navigate(targetRoute);

                  // Reset isTransitioning after small delay
                  setTimeout(
                    () => (window.transitionState.isTransitioning = false),
                    50
                  );

                  // Pause 5s on full cover
                  setTimeout(() => setTransitionStage("red-down"), 10000);
                } else if (transitionStage === "red-down") {
                  handleTransitionComplete();
                }
              }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  TransitionWrapper.displayName = `PageTransition(${
    OgComponent.displayName || OgComponent.name || "Component"
  })`;

  return TransitionWrapper;
};

export default PageTransition;
