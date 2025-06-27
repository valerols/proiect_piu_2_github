import React from "react";

// Functional component to display contact details
function ContactDetails({ contactDetails }) {
  return (
    <div>
      <h2>Contact Us</h2>
      <p>Address: {contactDetails.address}</p>
      <p>Telephone: {contactDetails.telephone}</p>
      <p>Email: {contactDetails.email}</p>
    </div>
  );
}

export default ContactDetails;
