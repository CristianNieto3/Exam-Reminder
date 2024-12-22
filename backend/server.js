// Import necessary libraries
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Import uuid for unique IDs
const { Pool } = require('pg'); // Import pg for database connection

// Database connection setup
const pool = new Pool({
  user: "postgres", // Adjust with your username
  host: 'localhost',
  database: 'exams_db',
  password: '3120Blossom', // Use your database password
  port: 5432,
});

// Create an instance of the Express application
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse incoming JSON requests

// Define the port where the server will listen for requests
const port = 5000;

// POST route to add a new exam
app.post('/exams', async (req, res) => {
  try {
    const { examName, examDate } = req.body;

    // Validate input
    if (!examName || !examDate) {
      return res.status(400).json({ message: 'Both exam name and date are required.' });
    }

    // Parse and validate examDate
    const examDateObj = new Date(examDate);
    if (isNaN(examDateObj.getTime())) {
      return res.status(400).json({ message: 'Invalid exam date format.' });
    }

    // Calculate days until the exam
    const currentDate = new Date();
    const daysUntilExam = Math.ceil((examDateObj - currentDate) / (1000 * 3600 * 24));

    // Insert into the database
    const query = `
      INSERT INTO exams (id, exam_name, exam_date, days_until_exam)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(query, [
      uuidv4(), // Generate a unique ID
      examName,
      examDate,
      daysUntilExam,
    ]);

    // Return the inserted exam
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// GET route to retrieve all exams
app.get('/exams', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exams ORDER BY exam_date ASC;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// DELETE route to remove an exam by ID
app.delete('/exams/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'DELETE FROM exams WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Exam not found.' });
    }

    res.status(200).json({ message: 'Exam deleted successfully.', deletedExam: result.rows[0] });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
