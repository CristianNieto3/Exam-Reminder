// Base URL for the backend API
const baseUrl = 'http://localhost:5000/exams';
const messages = [
    "You can do this!",
    "Keep going!",
    "You MIGHT be cooked",
    "LOCK IN",
    "Get some sleep please",
    "no seriously, please",
    "When in doubt, guess C!",
    "I believe in you!",
    "Day by Day, Brick by Brick!",
    "Coffee."
];

let currentMessageIndex = 0;
const textBubble = document.querySelector('.text-bubble');

function updateMessage(){
    textBubble.textContent = messages[currentMessageIndex];
    currentMessageIndex = (currentMessageIndex + 1) % messages.length;
}

setInterval(updateMessage, 3000);

// Function to fetch and display exams
async function fetchExams() {
    try {
        // Send a GET request to fetch all exams
        const response = await fetch(baseUrl);
        const exams = await response.json();

        // Clear the existing list in the frontend
        const examList = document.getElementById('examList');
        examList.innerHTML = '';

        // Populate the list with data from the backend
        exams.forEach((exam) => {
            const listItem = document.createElement('li'); // Create a new list item
            listItem.innerHTML = `
                      <div>
                    <strong>${exam.examName}</strong><br>
                    <small class="text-muted">Exam Date: ${exam.examDate}</small><br>
                    <small class="text-muted">Days until exam: ${exam.daysUntilExam}</small>
                </div>
                <button class="btn btn-danger btn-sm" onclick="deleteExam(${exam.id})">Delete</button>
            `;
            examList.appendChild(listItem); // Add the item to the list
        });
    } catch (error) {
        console.error('Error fetching exams:', error); // Handle errors gracefully
    }
}

// Function to add a new exam
async function addExam(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Get values from the form inputs
    const examName = document.getElementById('examName').value;
    const examDate = document.getElementById('examDate').value;
    

    console.log({examName, examDate,});

    try {
        // Send a POST request with the new exam data
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Inform server that data is in JSON format
            body: JSON.stringify({ examName, examDate, }), // Convert data to JSON
        });

        if (response.ok) {
            // Clear the form after successful submission
            document.getElementById('examForm').reset();
            // Refresh the list of exams
            fetchExams();
        } else {
            console.error('Error adding exam:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding exam:', error); // Log any errors
    }
}

// Function to delete an exam by ID
async function deleteExam(id) {
    try {
        // Send a DELETE request to remove the specified exam
        const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });

        if (response.ok) {
            // Refresh the list of exams after deletion
            fetchExams();
        } else {
            console.error('Error deleting exam:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting exam:', error); // Handle any errors
    }
}

// Add event listener to the form for adding exams
document.getElementById('examForm').addEventListener('submit', addExam);

// Fetch and display exams when the page loads
fetchExams();
