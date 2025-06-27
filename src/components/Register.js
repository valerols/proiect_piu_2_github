import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap"; // Importing Bootstrap components for form, button, alert, and spinner
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase function for creating user with email and password
import { auth } from "../firebase"; // Firebase authentication reference
import { useNavigate } from "react-router-dom"; // React Router hook for navigation
import "../styles.css"; // Import the custom CSS

function Register() {
  // State to store the email input
  const [email, setEmail] = useState("");

  // State to store the password input
  const [password, setPassword] = useState("");

  // State to store the confirmed password input
  const [confirmPassword, setConfirmPassword] = useState("");

  // State to store error messages
  const [error, setError] = useState("");

  // State to manage loading state while registering
  const [loading, setLoading] = useState(false);

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Function to handle the registration process
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(""); // Reset error state
    setLoading(true); // Set loading state to true

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false); // Set loading state to false
      return; // Exit the function early
    }

    try {
      // Attempt to create a new user with email and password
      await createUserWithEmailAndPassword(auth, email, password);
      // Navigate to the home page on successful registration
      navigate("/");
    } catch (error) {
      // Define a generic error message
      let errorMessage = "An error occurred. Please try again.";

      // Map specific error codes to user-friendly messages
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email address is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Set the error message state
      setError(errorMessage);
    } finally {
      // Set loading state to false once processing is complete
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleRegister}>
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

      {/* Form group for confirm password input */}
      <Form.Group controlId="formConfirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} // Update confirm password state on input change
        />
      </Form.Group>

      {/* Display error alert if there's an error */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Display loading spinner if loading, otherwise show the register button */}
      {loading ? (
        <Button variant="primary" disabled className="mt-3-custom">
          <Spinner
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          {" Registering..."}
        </Button>
      ) : (
        <Button variant="primary" type="submit" className="mt-3-custom">
          Register
        </Button>
      )}
    </Form>
  );
}

export default Register; // Export the component for use in other parts of the application
