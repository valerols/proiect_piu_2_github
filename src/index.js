import React from "react"; // Import the core React library
import ReactDOM from "react-dom/client"; // Import ReactDOM to render React components to the DOM
import { ToastContainer } from "react-toastify"; // Import the ToastContainer to display toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications to style them appropriately
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS for styling components using Bootstrap classes
import "./App.css"; // Import custom global CSS for the app
import App from "./App"; // Import the root App component that contains the main application logic and structure

const root = ReactDOM.createRoot(document.getElementById("root")); // Create the root element to render the React component tree into

// Render the App component into the root element
root.render(
  <>
    <App />
    <ToastContainer />
    {/* ToastContainer should be rendered in the root to enable toast notifications across the app */}
  </>
);
