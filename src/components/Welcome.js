import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link component for navigation
import Typed from "typed.js"; // Import Typed.js for typing animations
import "./Welcome.css"; // Import custom CSS for styling

function Welcome({ imageUrl }) {
  // useRef hook to manage the reference to the container element
  const containerRef = useRef(null);

  // useEffect hook to run side effects, similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    // Configuration options for Typed.js
    const options = {
      strings: ["Welcome to the Dental Practice Appointment Tracker"], // Text to type
      typeSpeed: 50, // Speed of typing
      startDelay: 500, // Delay before typing starts
      showCursor: false, // Hide the typing cursor
      onComplete: () => {
        // Callback function to run when typing is complete
        const text = containerRef.current.textContent; // Get the typed text
        containerRef.current.innerHTML = text
          .split("") // Split text into individual characters
          .map((char, i) => `<span class="glow">${char}</span>`) // Wrap each character in a span with class "glow"
          .join(""); // Join the characters back into a string

        // Apply animations to each span
        const spans = containerRef.current.querySelectorAll(".glow");
        spans.forEach((span, index) => {
          span.style.animationDelay = `${index * 0.1}s`; // Stagger the animation start times
        });
      },
    };

    // Create a new Typed instance with the container reference and options
    const typed = new Typed(containerRef.current, options);

    // Cleanup function to destroy the Typed instance when the component unmounts
    return () => {
      typed.destroy();
    };
  }, []); // Empty dependency array, so the effect runs only once on mount

  // Fallback image in case the provided image URL fails to load
  const placeholderImage = "assets/default-dental.jpg";

  return (
    <div className="text-center welcome-page">
      {/* Container for the typing text */}
      <div className="banner-container">
        <div className="typing-container">
          <h1 ref={containerRef} className="glowing-text"></h1>{" "}
          {/* Typing text element */}
        </div>
      </div>

      {/* Main image of the welcome page */}
      <img
        src={imageUrl || placeholderImage} // Use provided image or fallback
        alt="Dental Practice"
        className="img-fluid main-image"
        onError={(e) => {
          e.target.src = placeholderImage; // Fallback to placeholder image on error
        }}
      />

      {/* Links to login and register pages */}
      <p>
        <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Welcome; // Export the component for use in other parts of the application
