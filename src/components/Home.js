import React, { useState, useEffect } from "react"; // Import React and hooks for managing state and lifecycle events
import { Container, Form, Button, Col, Row } from "react-bootstrap"; // Import layout and form components from React Bootstrap
import DatePicker from "react-datepicker"; // Import DatePicker component for selecting dates
import "react-datepicker/dist/react-datepicker.css"; // Import default styles for the DatePicker component
import { format } from "date-fns"; // Import format function from date-fns for formatting dates
import { db } from "../firebase"; // Import the Firebase database instance for interacting with Firestore
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer for displaying notifications
import "react-toastify/dist/ReactToastify.css"; // Import default styles for React Toastify notifications
import AppointmentList from "./AppointmentList"; // Import the AppointmentList component for displaying a list of appointments
import {
  collection, // Import collection function to reference a Firestore collection
  getDocs, // Import getDocs function to retrieve documents from a collection
  addDoc, // Import addDoc function to add a document to a collection
  updateDoc, // Import updateDoc function to update an existing document in Firestore
  deleteDoc, // Import deleteDoc function to delete a document from Firestore
  doc, // Import doc function to reference a specific Firestore document
} from "firebase/firestore";
import "./Home.css"; // Import the custom CSS file for styling the Home component

const Home = ({ imageUrl }) => {
  // State to store list of appointments
  const [appointments, setAppointments] = useState([]);

  // State to manage input for new appointments
  const [appointmentInput, setAppointmentInput] = useState({
    name: "",
    date: new Date(),
    time: "",
    description: "",
  });

  // State to manage the currently selected appointment (if any)
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // State to handle image load error
  const [imageLoadError, setImageLoadError] = useState(false);

  // Fetch appointments from Firestore when component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetching appointments from Firestore
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const appointmentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Error fetching appointments!");
      }
    };

    fetchAppointments();
  }, []);

  // Handle input changes for new appointment form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointmentInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date changes using DatePicker component
  const handleDateChange = (date) => {
    setAppointmentInput((prev) => ({
      ...prev,
      date: date,
    }));
  };

  // Validate time format (HH:mm)
  const validateTime = (time) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(time);
  };

  // Handle form submission to add a new appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, date, time, description } = appointmentInput;

    // Ensure all fields are filled
    if (!name || !date || !time || !description) {
      toast.error("Please fill in all fields!");
      return;
    }

    // Ensure time format is valid
    if (!validateTime(time)) {
      toast.error("Invalid time format! Please use HH:mm format.");
      return;
    }

    try {
      // Format the date for display
      const formattedDate = format(date, "dd/MM/yyyy");
      const newAppointment = {
        name,
        date: formattedDate,
        time,
        description,
      };

      // Add the new appointment to Firestore
      const docRef = await addDoc(
        collection(db, "appointments"),
        newAppointment
      );
      const addedAppointment = { id: docRef.id, ...newAppointment };
      setAppointments([...appointments, addedAppointment]);
      toast.success("Appointment added successfully!");

      // Reset form inputs
      setAppointmentInput({
        name: "",
        date: new Date(),
        time: "",
        description: "",
      });
    } catch (error) {
      toast.error("Failed to add appointment.");
      console.error("Error adding appointment:", error);
    }
  };

  // Handle appointment edit
  const handleEdit = async (id, updatedAppointment) => {
    try {
      const appointmentRef = doc(collection(db, "appointments"), id);
      await updateDoc(appointmentRef, updatedAppointment);

      // Update the appointment in local state
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === id ? { id, ...updatedAppointment } : appointment
      );
      setAppointments(updatedAppointments);
      toast.success("Appointment updated successfully!");
    } catch (error) {
      toast.error("Failed to update appointment.");
      console.error("Error updating appointment:", error);
    }
  };

  // Handle appointment delete
  const handleDelete = async (id) => {
    try {
      const appointmentRef = doc(collection(db, "appointments"), id);
      await deleteDoc(appointmentRef);

      // Remove the appointment from local state
      const updatedAppointments = appointments.filter(
        (appointment) => appointment.id !== id
      );
      setAppointments(updatedAppointments);
      toast.success("Appointment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete appointment.");
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <Container>
      <ToastContainer />
      {/* Conditionally render the image or a fallback message */}
      {!imageLoadError ? (
        <img
          src={imageUrl}
          alt="Dental Practice"
          className="img-fluid my-img-class"
          onError={(e) => {
            // If image fails to load, set imageLoadError to true to show the fallback message
            setImageLoadError(true);
          }}
        />
      ) : (
        <p className="error-message">
          Image failed to load. Please try again later.
        </p>
      )}

      {/* Form to add a new appointment */}
      <Form onSubmit={handleSubmit} className="home-form">
        {/* Row for name input */}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="appointmentName">
              <Form.Label className="form-label">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={appointmentInput.name}
                onChange={handleInputChange}
                placeholder="Enter name"
                className="form-control"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Row for date input */}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="appointmentDate">
              <Form.Label className="form-label">Date</Form.Label>
              <DatePicker
                selected={appointmentInput.date}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Row for time input */}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="appointmentTime">
              <Form.Label className="form-label">Time</Form.Label>
              <Form.Control
                type="text"
                name="time"
                value={appointmentInput.time}
                onChange={handleInputChange}
                placeholder="Enter time (HH:mm)"
                className="form-control"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Row for description input */}
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="appointmentDescription">
              <Form.Label className="form-label">Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={appointmentInput.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                rows={3}
                className="form-control"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Submit button */}
        <Button variant="primary" type="submit" className="form-control btn">
          Add
        </Button>
      </Form>

      {/* Component to display the list of appointments */}
      <AppointmentList
        appointments={appointments}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Container>
  );
};

export default Home;
