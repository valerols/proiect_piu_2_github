import React, { useState, useEffect } from "react"; // Import React and hooks for managing state and lifecycle events
import { Form, Button } from "react-bootstrap"; // Import Form and Button components from React Bootstrap for building the form UI
import { toast } from "react-toastify"; // Import toast for displaying notifications or alerts to the user
import DatePicker from "react-datepicker"; // Import DatePicker component for selecting dates in the form
import "react-datepicker/dist/react-datepicker.css"; // Import the default styles for the DatePicker component
import { format, parse } from "date-fns"; // Import functions from date-fns to format and parse dates
import "./AppointmentForm.css"; // Import the custom CSS file for styling the AppointmentForm component

function AppointmentForm({ addAppointment, currentAppointment }) {
  // Define state variables for the form fields
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  // Update the form fields if there's a currentAppointment passed as a prop
  useEffect(() => {
    if (currentAppointment) {
      setName(currentAppointment.name);
      setDate(parse(currentAppointment.date, "dd/MM/yyyy", new Date()));
      setTime(currentAppointment.time);
      setDescription(currentAppointment.description);
    }
  }, [currentAppointment]);

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validate that all fields are filled
    if (!name || !date || !time || !description) {
      toast.error("Please fill in all fields!"); // Show error toast
      return;
    }

    try {
      const formattedDate = format(date, "dd/MM/yyyy"); // Format the date
      console.log("Formatted appointment data:", {
        name,
        date: formattedDate,
        time,
        description,
      });

      await addAppointment({ name, date: formattedDate, time, description }); // Add the appointment
      toast.success("Appointment added successfully!"); // Show success toast
      setName(""); // Clear the name field
      setDate(new Date()); // Reset the date field
      setTime(""); // Clear the time field
      setDescription(""); // Clear the description field
    } catch (error) {
      toast.error("Failed to add appointment."); // Show error toast on failure
      console.error("Error adding appointment:", error); // Log the error to console
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="appointment-form">
      {/* Form group for Name field */}
      <Form.Group controlId="formName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update state when input changes
        />
      </Form.Group>

      {/* Form group for Date field */}
      <Form.Group controlId="formDate">
        <Form.Label>Date</Form.Label>
        <DatePicker
          selected={date}
          dateFormat="dd/MM/yyyy"
          onChange={(date) => setDate(date)} // Update state when date changes
          className="form-control"
          required
        />
      </Form.Group>

      {/* Form group for Time field */}
      <Form.Group controlId="formTime">
        <Form.Label>Time (24-hour format)</Form.Label>
        <Form.Control
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)} // Update state when time changes
        />
      </Form.Group>

      {/* Form group for Description field */}
      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Update state when input changes
        />
      </Form.Group>

      {/* Submit button */}
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default AppointmentForm;
