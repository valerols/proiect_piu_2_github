// Import React to use JSX and React components
import React from "react";

// Define a functional component named 'About'
function About() {
  // Return JSX that will be rendered to the page
  // React takes the JSX code and ultimately displays the corresponding HTML elements on the web page
  // While JSX looks similar to HTML, it needs to be transformed into JavaScript before it can be understood by the browser
  return (
    <div>
      {/* Header for the About Us section */}
      <h2>About Us</h2>

      {/* Paragraph describing the company's commitment to patients */}
      <p>
        Our dentist cabinet is committed to providing exceptional care to all
        our patients.
      </p>

      {/* Paragraph for the address */}
      <p>Address: Bd. Eroilor Floresti Cluj Romania 407280</p>

      {/* Paragraph for the telephone number */}
      <p>Telephone: +40 123 456 789</p>

      {/* Paragraph for the contact email */}
      <p>Email: contact@dentistcabinet.com</p>
    </div>
  );
}

// Export the About component so it can be imported and used in other files
export default About;
