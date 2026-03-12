import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="588707585905-142u3mghopu7ro95728qref93qnfj54k.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
