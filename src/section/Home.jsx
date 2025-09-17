import { Routes, Route, useLocation } from "react-router-dom";
import Hero from "./Hero";
import About from "./About";
import Navbar from "../components/Navbar";
import Contact from "./Contact";
import Work from "./Work";
import LenisScroll from "../components/LenisScroll";
import ErrorBoundary from "../components/ErrorBoundary";
import ScrollToTop from "../components/ScrollToTop";
// import { useEffect, useRef } from "react";

function Home() {
  const handleRouteError = (error, errorInfo, sectionName) => {
    const currentPath = window.location.pathname;
    console.group(`🚨 Route Error - ${sectionName} (${currentPath})`);
    console.error("Route:", currentPath);
    console.error("Section:", sectionName);
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("Component Stack:", errorInfo.componentStack);
    console.error("Timestamp:", new Date().toISOString());
    console.groupEnd();
  };

  return (
    <ErrorBoundary
      name="LenisScroll Wrapper"
      section="scroll-container"
      onError={handleRouteError}
    >
      <LenisScroll>
        {/* 👇 Yeh har route change pe top pe scroll karega */}
        <ScrollToTop />
        <ErrorBoundary
          name="Navigation Bar"
          section="navbar"
          onError={handleRouteError}
        >
          <Navbar />
        </ErrorBoundary>

        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary
                name="Hero Section"
                section="hero-page"
                onError={handleRouteError}
              >
                <Hero />
              </ErrorBoundary>
            }
          />
          <Route
            path="/about"
            element={
              <ErrorBoundary
                name="About Page"
                section="about-page"
                onError={handleRouteError}
              >
                <About />
              </ErrorBoundary>
            }
          />
          <Route
            path="/contact"
            element={
              <ErrorBoundary
                name="Contact Page"
                section="contact-page"
                onError={handleRouteError}
              >
                <Contact />
              </ErrorBoundary>
            }
          />
          <Route
            path="/work"
            element={
              <ErrorBoundary
                name="Work Page"
                section="work-page"
                onError={handleRouteError}
              >
                <Work />
              </ErrorBoundary>
            }
          />
          <Route
            path="*"
            element={
              <ErrorBoundary
                name="404 Not Found"
                section="not-found"
                onError={handleRouteError}
              >
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                  <div className="text-center p-8">
                    <h1 className="text-6xl font-bold text-gray-700 mb-4">
                      404
                    </h1>
                    <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                      Page Not Found
                    </h2>
                    <p className="text-gray-500 mb-6">
                      The page you're looking for doesn't exist.
                    </p>
                    <a
                      href="/"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Go Home
                    </a>
                  </div>
                </div>
              </ErrorBoundary>
            }
          />
        </Routes>
      </LenisScroll>
    </ErrorBoundary>
  );
}

export default Home;
