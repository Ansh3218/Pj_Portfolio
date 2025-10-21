import { Routes, Route, useLocation } from "react-router-dom";
import Hero from "./Hero";
import About from "./About";
import Navbar from "../components/Navbar";
import Contact from "./Contact";
import Work from "./Work";
import LenisScroll from "../components/LenisScroll";
import ErrorBoundary from "../components/ErrorBoundary";
import ScrollToTop from "../components/ScrollToTop";
import NotFoundPage from "../components/NotFoundPage";

function Home() {
  const location = useLocation(); // 👈 Current route check karne ke liye
  const is404Page = !["/", "/about", "/contact", "/work"].includes(
    location.pathname
  );

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
        <ScrollToTop />

        {/* 👇 404 page pe Navbar show nahi hoga */}
        {!is404Page && (
          <ErrorBoundary
            name="Navigation Bar"
            section="navbar"
            onError={handleRouteError}
          >
            <Navbar />
          </ErrorBoundary>
        )}

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
                <NotFoundPage />
              </ErrorBoundary>
            }
          />
        </Routes>
      </LenisScroll>
    </ErrorBoundary>
  );
}

export default Home;
