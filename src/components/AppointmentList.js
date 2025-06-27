import React, { useState } from "react"; // Import React and the useState hook for managing component state
import { Table, Button, Form } from "react-bootstrap"; // Import Table, Button, and Form components from React Bootstrap for UI elements
import DatePicker from "react-datepicker"; // Import DatePicker component for selecting dates
import "react-datepicker/dist/react-datepicker.css"; // Import default styles for the DatePicker component
import { format, parse, isValid } from "date-fns"; // Import functions from date-fns for date formatting, parsing, and validation
import { toast } from "react-toastify"; // Import toast for displaying notifications or alerts to the user

function AppointmentList({ appointments = [], onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null); // State to track the ID of the appointment being edited
  const [editFormData, setEditFormData] = useState({
    name: "", // Tracking the name field for editing
    date: new Date(), // Tracking the date field for editing
    time: "", // Tracking the time field for editing
    description: "", // Tracking the description field for editing
  });

  // Handle click event to enter edit mode
  const handleEditClick = (appointment) => {
    console.log("Editing appointment:", appointment);

    setEditingId(appointment.id);
    const parsedDate = parse(appointment.date, "dd/MM/yyyy", new Date());
    setEditFormData({
      name: appointment.name,
      date: isValid(parsedDate) ? parsedDate : new Date(),
      time: appointment.time,
      description: appointment.description,
    });

    console.log("Edit form data state initialized to:", editFormData);
  };

  // Handle click event to cancel editing
  const handleCancelClick = () => {
    setEditingId(null);
  };

  // Handle input change for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle change in the DatePicker
  const handleDateChange = (date) => {
    setEditFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  // Handle saving edited appointment
  const handleSaveClick = async (id) => {
    const updatedAppointment = {
      ...editFormData,
      date: format(editFormData.date, "dd/MM/yyyy"),
    };

    try {
      console.log("Saving edited appointment:", updatedAppointment);
      await onEdit(id, updatedAppointment);
      setEditingId(null);
      toast.success("Appointment saved successfully!");
    } catch (error) {
      toast.error("Failed to save the appointment.");
      console.error("Error while saving appointment:", error);
    }
  };

  // Handle deleting an appointment
  const handleDeleteClick = (id) => {
    onDelete(id);
    if (editingId === id) {
      setEditingId(null);
    }
  };

  // Generate a URL to add the appointment to Google Calendar
  const generateGoogleCalendarUrl = (appointment) => {
    const { name, date, time, description } = appointment;
    const formattedDate = format(
      parse(date, "dd/MM/yyyy", new Date()),
      "yyyyMMdd"
    );
    const formattedTime = time.replace(":", "");
    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    const text = `&text=${encodeURIComponent(name)}`;
    const formattedEnd = parseInt(formattedTime) + 100; // You might need to handle cases where adding 100 exceeds 24 hours
    const dates = `&dates=${formattedDate}T${formattedTime}00/${formattedDate}T${formattedEnd
      .toString()
      .padStart(2, "0")}00`;
    const details = `&details=${encodeURIComponent(description)}`;
    return `${baseUrl}${text}${dates}${details}`;
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Time</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map((appointment) => (
          <tr key={appointment.id}>
            <td>
              {editingId === appointment.id ? (
                <Form.Control
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                />
              ) : (
                appointment.name
              )}
            </td>
            <td>
              {editingId === appointment.id ? (
                <DatePicker
                  selected={editFormData.date}
                  dateFormat="dd/MM/yyyy"
                  onChange={handleDateChange}
                  className="form-control"
                  required
                />
              ) : (
                appointment.date
              )}
            </td>
            <td>
              {editingId === appointment.id ? (
                <Form.Control
                  type="time"
                  name="time"
                  value={editFormData.time}
                  onChange={handleInputChange}
                />
              ) : (
                appointment.time
              )}
            </td>
            <td>
              {editingId === appointment.id ? (
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={2}
                  value={editFormData.description}
                  onChange={handleInputChange}
                />
              ) : (
                appointment.description
              )}
            </td>
            <td>
              {editingId === appointment.id ? (
                <>
                  <Button
                    variant="success"
                    onClick={() => handleSaveClick(appointment.id)}
                    className="me-2"
                  >
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancelClick}
                    className="me-2"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="warning"
                    onClick={() => handleEditClick(appointment)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteClick(appointment.id)}
                    className="me-2"
                  >
                    Delete
                  </Button>
                  <a
                    href={generateGoogleCalendarUrl(appointment)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="info" className="me-2">
                      Add to Google Calendar
                    </Button>
                  </a>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default AppointmentList;
