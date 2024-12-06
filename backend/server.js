// Step 1: Import the Express library to set up the server
const express = require('express');
const cors = require('cors');

// Step 2: Create an instance of the Express application
const app = express();
app.use(cors());

// Step 3: Define the port where the server will listen for requests
const port = 5000;

// Step 4: Middleware to parse incoming JSON requests
app.use(express.json());

// Step 5: In-memory store for exams (we'll use an array to store exams temporarily)
let exams = []; // This will hold the exams. It is a simple array to simulate storage.

// Step 6: Define route to add a new exam
app.post('/exams', (req, res) => {
  // Get the exam data from the request body
  const { examName, examDate } = req.body;

  const CurrentDate = new Date();
  const examDateObj = new Date(examDate);
  const timeDifference = examDateObj - CurrentDate;
  const daysUntilExam = Math.ceil(timeDifference / (1000 * 3600 * 24));

  // Create a new exam object
  const newExam = {
    id: exams.length + 1, // Assign a unique ID to each exam
    examName,
    examDate,
    daysUntilExam
  };

  // Add the new exam to the exams array
  exams.push(newExam);

  // Send a response to confirm the exam was added
  res.status(201).json(newExam); // 201 indicates that the resource was created successfully
});

// Step 7: Define route to get all exams
app.get('/exams', (req, res) => {
  // Send the list of exams as a response
  res.status(200).json(exams); // 200 indicates a successful request
});

// Step 8: Define route to delete an exam by its ID
app.delete('/exams/:id', (req, res) => {
  // Get the exam ID from the URL parameters
  const { id } = req.params;

  // Find the exam by ID
  const examIndex = exams.findIndex(exam => exam.id === parseInt(id));

  if (examIndex === -1) {
    // If the exam with the given ID was not found, send an error
    return res.status(404).json({ message: 'Exam not found' });
  }

  // Remove the exam from the exams array
  exams.splice(examIndex, 1);

  // Send a response to confirm the exam was deleted
  res.status(200).json({ message: 'Exam deleted successfully' });
});

// Step 9: Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
