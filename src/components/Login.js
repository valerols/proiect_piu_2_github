import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap"; // Importing Bootstrap components for form, button, and alerts
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase authentication function for signing in with email and password
import { auth } from "../firebase"; // Firebase authentication reference
import { useNavigate } from "react-router-dom"; // React Router hook for navigation
import "../styles.css"; // Import the custom CSS

function Login() {
  // State to store the email input
  const [email, setEmail] = useState("");

  // State to store the password input
  const [password, setPassword] = useState("");

  // State to store error messages
  const [error, setError] = useState("");

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Function to handle the login process
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Reset error state

    try {
      // Attempt to sign in the user with email and password
      await signInWithEmailAndPassword(auth, email, password);
      // Navigate to the home page on successful login
      navigate("/");
    } catch (error) {
      // Set an error message to display if sign-in fails
      setError(error.message);
    }
  };

  return (
    // Form component to handle user login
    <Form onSubmit={handleLogin}>
      {/* Form group for email input */}
      <Form.Group controlId="formEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state on input change
        />
      </Form.Group>

      {/* Form group for password input */}
      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state on input change
        />
      </Form.Group>

      {/* Display error alert if there's an error */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Login button */}
      <Button variant="primary" type="submit" className="mt-3-custom">
        Login
      </Button>
    </Form>
  );
}

export default Login; // Export the component for use in other parts of the application
