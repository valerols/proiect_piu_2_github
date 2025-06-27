import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap"; // Importing Bootstrap components for form, button, and alerts
import { db, storage } from "../firebase"; // Firebase Firestore and Storage references
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"; // Firebase storage functions for reference, uploading, getting URL and deleting files
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firebase Firestore functions for document reference, setting and getting documents

function ImageForm({ setImageUrl }) {
  // State to store the selected image file
  const [image, setImage] = useState(null);

  // State to store error messages
  const [error, setError] = useState("");

  // State to store success messages
  const [success, setSuccess] = useState("");

  // State to manage loading state during image upload
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle the image upload process
  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Check if an image is selected
    if (!image) {
      setError("Please select an image.");
      setIsLoading(false);
      return;
    }

    // Validate the image type
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(image.type)) {
      setError(
        "Unsupported file type. Please upload a JPEG, PNG, or GIF image."
      );
      setIsLoading(false);
      return;
    }

    // Validate the image size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB max size
    if (image.size > maxSize) {
      setError("File size exceeds limit of 5MB.");
      setIsLoading(false);
      return;
    }

    try {
      // Fetch the current image path from Firestore
      const docRef = doc(db, "settings", "homeImage");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const oldImagePath = docSnap.data().path;
        // Delete the old image from Firebase Storage to save space
        const oldImageRef = ref(storage, oldImagePath);
        await deleteObject(oldImageRef);
      }

      // Upload the new image to Firebase Storage
      const newImageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(newImageRef, image);

      // Update Firestore with the new image path
      const newImagePath = `images/${image.name}`;
      await setDoc(doc(db, "settings", "homeImage"), { path: newImagePath });

      // Retrieve the download URL for the new image and update the parent component
      const url = await getDownloadURL(newImageRef);
      setImageUrl(url);
      setSuccess("Image uploaded successfully.");
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("There was a problem uploading your image.");
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <Form onSubmit={handleUpload}>
      <Form.Group controlId="formFile">
        <Form.Label>Choose Image</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          disabled={isLoading} // Disable file input while uploading
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? "Uploading..." : "Update Image"}
      </Button>
    </Form>
  );
}

export default ImageForm; // Export the component for use in other parts of the application
