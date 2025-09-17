import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CustomCursor from "./components/CustomCursor.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <div className="bg-black h-auto w-full">
        <CustomCursor />
        <App />
      </div>
    </BrowserRouter>
  </StrictMode>
);
