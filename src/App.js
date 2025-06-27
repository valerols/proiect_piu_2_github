import React, { useState, useEffect } from "react"; // React hooks for managing state and side effects
import { Container } from "react-bootstrap"; // Bootstrap Container component for responsive layout
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"; // React Router components for navigation and routing in the app
import { db, storage, auth } from "./firebase"; // Firebase services for database (Firestore), file storage, and authentication
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  doc,
} from "firebase/firestore"; // Firestore methods for collections and documents CRUD operations
import { ref, getDownloadURL } from "firebase/storage"; // Firestore Storage methods for file references and downloading
import { signOut, onAuthStateChanged } from "firebase/auth"; // Firebase Auth methods for signing out and tracking auth state changes
import AppointmentForm from "./components/AppointmentForm"; // Component for appointment form input and submission
import Menu from "./components/Menu"; // Component for the navigation menu
import About from "./components/About"; // Component for about section/page
import ImageForm from "./components/ImageForm"; // Component for image upload form
import Login from "./components/Login"; // Component for user login form
import Register from "./components/Register"; // Component for user registration form
import Home from "./components/Home"; // Home component showing appointments and main content
import Welcome from "./components/Welcome"; // Welcome component for non-authenticated users
import "./App.css"; // Custom CSS styles for the App component
import { ToastContainer, toast } from "react-toastify"; // Import for displaying toast notifications
import "react-toastify/dist/ReactToastify.css"; // CSS for the toast notifications

function App() {
  const [appointments, setAppointments] = useState([]); // State to store array of appointments from Firestore
  const [imageUrl, setImageUrl] = useState(""); // State to store URL of the home image
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const [user, setUser] = useState(null); // State to hold current authenticated user

  // Hook used to run side effects in the React component
  useEffect(() => {
    // Effect to handle authentication state change and data fetching when component mounts
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Listener from Firebase Auth for authentication state changes
      if (user) {
        // If a user is authenticated
        setUser(user); // Update state with the authenticated user
        fetchAppointments(); // Fetch user-specific appointments
      } else {
        // If no user is authenticated
        setUser(null); // Clear user state if not authenticated
      }
      fetchImage(); // Fetch image for the welcome screen
      setLoading(false); // Set loading to false after initial data fetching
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe the auth listener on unmount
  }, []);

  const fetchAppointments = async () => {
    // Function to fetch appointments from Firestore
    try {
      const snapshot = await getDocs(collection(db, "appointments")); // Get all docs from "appointments" collection
      const appointmentsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })); // Map each doc to an object with doc's id and data
      setAppointments(appointmentsList); // Update state with fetched appointments
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments."); // Show error toast if fetching appointments fails
    }
  };

  const fetchImage = async () => {
    // Function to fetch image URL from Firestore and Storage
    try {
      const docRef = doc(db, "settings", "homeImage"); // Reference to "homeImage" document in "settings" collection
      const docSnap = await getDoc(docRef); // Fetch the document snapshot
      if (docSnap.exists()) {
        const imagePath = docSnap.data().path; // Get image path from document data
        const imageRef = ref(storage, imagePath); // Create a reference to the file in Storage
        const url = await getDownloadURL(imageRef); // Get the download URL for the file
        setImageUrl(url); // Update state with the image URL
      } else {
        setImageUrl("assets/default-dental.jpg"); // Default image if no document data found
      }
    } catch (error) {
      setImageUrl("assets/default-dental.jpg"); // Default image in case of error fetching image
    }
  };

  const addAppointment = async (appointment) => {
    // Function to add a new appointment to Firestore
    try {
      const docRef = await addDoc(collection(db, "appointments"), appointment); // Add a new doc to "appointments" collection
      setAppointments([...appointments, { id: docRef.id, ...appointment }]); // Update state with the new appointment
      toast.success("Appointment added successfully!"); // Show success toast
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast.error("Failed to add appointment."); // Show error toast if adding fails
    }
  };

  const editAppointment = async (id, updatedAppointment) => {
    // Function to update an existing appointment
    try {
      const appointmentRef = doc(db, "appointments", id); // Reference to the specific appointment document
      await updateDoc(appointmentRef, updatedAppointment); // Update the doc with new data
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === id ? { id, ...updatedAppointment } : appt
        )
      ); // Update state with edited appointment
      toast.success("Appointment updated successfully!"); // Show success toast
    } catch (error) {
      console.error("Error editing appointment:", error);
      toast.error("Failed to update appointment."); // Show error toast if update fails
    }
  };

  const deleteAppointment = async (id) => {
    // Function to delete an appointment from Firestore
    try {
      const appointmentRef = doc(db, "appointments", id); // Reference to the specific appointment document
      await deleteDoc(appointmentRef); // Delete the document
      setAppointments(appointments.filter((appt) => appt.id !== id)); // Remove the deleted appointment from state
      toast.success("Appointment deleted successfully!"); // Show success toast
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Failed to delete appointment."); // Show error toast if delete fails
    }
  };

  if (loading) {
    // Render loading message if app is still fetching initial data
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {/* The Router component from react-router-dom wraps the entire app to enable routing */}
      <Menu user={user} onSignOut={() => signOut(auth)} />
      {/* Menu component with user prop and signOut function */}
      <Container>
        <Routes>
          {/* Routes defines the structure of the different pages/components */}
          <Route path="/welcome" element={<Welcome imageUrl={imageUrl} />} />
          {/* Public route for welcome page */}
          <Route path="/login" element={<Login user={user} />} />
          {/* Public route for login page */}
          <Route path="/register" element={<Register user={user} />} />
          {/* Public route for registration page */}
          <Route
            path="/"
            element={
              user ? (
                <Home
                  imageUrl={imageUrl}
                  appointments={appointments}
                  onEdit={editAppointment}
                  onDelete={deleteAppointment}
                />
              ) : (
                <Navigate to="/welcome" />
              )
            }
          />
          {/* Protected route for home page; redirects to welcome if user not authenticated */}
          <Route
            path="/new"
            element={
              user ? (
                <AppointmentForm addAppointment={addAppointment} />
              ) : (
                <Navigate to="/welcome" />
              )
            }
          />
          {/* Protected route for adding a new appointment */}
          <Route path="/about" element={<About />} />
          {/* Public route for about page */}
          <Route
            path="/update-image"
            element={
              user ? (
                <ImageForm setImageUrl={setImageUrl} />
              ) : (
                <Navigate to="/welcome" />
              )
            }
          />
          {/* Protected route for updating the image */}
        </Routes>
      </Container>
      <ToastContainer />
      {/* Container for displaying toast notifications */}
    </Router>
  );
}

export default App;
