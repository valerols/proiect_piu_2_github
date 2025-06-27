import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap"; // Importing Bootstrap components for navigation bar, links, and dropdowns
import { LinkContainer } from "react-router-bootstrap"; // Wrapper for React Router Links to work with React-Bootstrap
import { useNavigate } from "react-router-dom"; // React Router hook for navigation

function Menu({ user, onSignOut }) {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Function to handle sign-out process
  const handleSignOut = async () => {
    // Call the passed-in sign out function
    await onSignOut();
    // Navigate to the welcome page after signing out
    navigate("/welcome");
  };

  return (
    <Navbar bg="light" expand="lg">
      {/* Conditional navigation based on user authentication state */}
      <LinkContainer to={user ? "/" : "/welcome"}>
        <Navbar.Brand>Dental Practice Appointment Tracker</Navbar.Brand>
      </LinkContainer>
      {/* Navbar toggle for responsiveness */}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      {/* Collapse component for toggling the Nav links on smaller screens */}
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {/* Conditionally render navigation items based on user authentication */}
          {user ? (
            <>
              {/* Link to Home page */}
              <LinkContainer to="/">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              {/* Link to Update Image page */}
              <LinkContainer to="/update-image">
                <Nav.Link>Update Image</Nav.Link>
              </LinkContainer>
              {/* Link to About page */}
              <LinkContainer to="/about">
                <Nav.Link>About</Nav.Link>
              </LinkContainer>
              {/* Dropdown for signed-in user's options */}
              <NavDropdown
                title={`Welcome, ${user.email}`}
                id="basic-nav-dropdown"
              >
                {/* Option to sign out */}
                <NavDropdown.Item onClick={handleSignOut}>
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            </>
          ) : (
            <>
              {/* Link to Login page */}
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
              {/* Link to Register page */}
              <LinkContainer to="/register">
                <Nav.Link>Register</Nav.Link>
              </LinkContainer>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Menu; // Export the component for use in other parts of the application
