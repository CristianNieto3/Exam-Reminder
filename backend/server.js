// Import necessary libraries
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique IDs

// Create an instance of the Express application
const app = express();
app.use(cors());

// Define the port where the server will listen for requests
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// In-memory store for exams (using array for now)
let exams = []; 

// Route to add a new exam
app.post('/exams', (req, res) => {
  try {
    // Get the exam data from the request body
    const { examName, examDate } = req.body;

    // Input Validation
    if (!examName || !examDate) {
      return res.status(400).json({ message: 'Both exam name and date are required.' });
    }

    // Date Validation
    const examDateObj = new Date(examDate);
    if (isNaN(examDateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid exam date format.' });
    }

    const CurrentDate = new Date();
    const timeDifference = examDateObj - CurrentDate;
    const daysUntilExam = Math.ceil(timeDifference / (1000 * 3600 * 24));

    // If the exam date is in the past, set daysUntilExam to 0 and add a "past" status
    if (daysUntilExam < 0) {
      return res.status(400).json({ message: 'Exam date cannot be in the past.' });
    }

    // Create a new exam object with a unique ID
    const newExam = {
      id: uuidv4(), // Use uuid to generate a unique ID
      examName,
      examDate,
      daysUntilExam
    };

    // Add the new exam to the exams array
    exams.push(newExam);

    // Send a response to confirm the exam was added
    res.status(201).json(newExam); // 201 indicates successful creation
  } catch (error) {
    // Error handling for unexpected issues
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Route to get all exams
app.get('/exams', (req, res) => {
  try {
    // Send the list of exams as a response
    res.status(200).json(exams); // 200 indicates successful request
  } catch (error) {
    // Error handling for unexpected issues
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Route to delete an exam by its ID
app.delete('/exams/:id', (req, res) => {
  try {
    // Get the exam ID from the URL parameters
    const { id } = req.params;

    // Find the exam by ID
    const examIndex = exams.findIndex(exam => exam.id === id);

    if (examIndex === -1) {
      // If the exam with the given ID was not found, send an error
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Remove the exam from the exams array
    exams.splice(examIndex, 1);

    // Send a response to confirm the exam was deleted
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    // Error handling for unexpected issues
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
