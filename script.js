import { questionsBank } from './questions.js';

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// Function to generate a quiz
function generateQuiz() {
    const shuffledQuestions = shuffleArray(questionsBank);
    return shuffledQuestions.slice(0, 10);
}

let quizQuestions = generateQuiz();
let currentQuestionIndex = 0;
let correctAnswers = 0;

function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) { // Check if the element exists
        const progress = (currentQuestionIndex / quizQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }
}


function displayQuestion() {
    const questionElement = document.getElementById("question");
    const optionsContainer = document.getElementById("options-container");

    // Clear previous options and reset styles
    optionsContainer.innerHTML = "";
    questionElement.textContent = "";

    if (currentQuestionIndex < quizQuestions.length) {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        
        // Display the question
        questionElement.textContent = currentQuestion.question;

        // Randomize the order of options
        const options = currentQuestion.options;
        const shuffledOptions = shuffleArray(options);

        // Create buttons for each option
        shuffledOptions.forEach(option => {
            const optionButton = document.createElement("button");
            optionButton.textContent = option;

            // Add a click event listener to each button
            optionButton.addEventListener("click", () => {
                checkAnswer(option, optionButton);
            });

            // Append the button to the options container
            optionsContainer.appendChild(optionButton);
        });
        updateProgressBar(); // Update the progress bar
    } else {
        // Quiz is over, calculate score and display pie chart
        displayScore();
    }
}

// Function to check the user's answer
function checkAnswer(selectedOption, selectedButton) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const optionsContainer = document.getElementById("options-container");
    const optionButtons = optionsContainer.getElementsByTagName("button");

    // Check if the selected option is correct
    if (selectedOption === currentQuestion.answer) {
        correctAnswers++;
        // Highlight the correct answer in green
        selectedButton.style.backgroundColor = "green";
    } else {
        // Highlight the incorrect answer in red
        selectedButton.style.backgroundColor = "red";
        // Highlight the correct answer in green
        for (let button of optionButtons) {
            if (button.textContent === currentQuestion.answer) {
                button.style.backgroundColor = "green";
                break;
            }
        }
    }

    // Disable all buttons after the user makes a selection
    for (let button of optionButtons) {
        button.disabled = true;
    }

    // Move to the next question after a delay
    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1000);
}

// Function to display the final score and pie chart
function displayScore() {
    const totalQuestions = quizQuestions.length;
    const incorrectAnswers = totalQuestions - correctAnswers;

    // Hide the quiz container and show the result container
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";

    // Create a pie chart using Chart.js
    const chartCanvas = document.getElementById("score-chart");
    const ctx = chartCanvas.getContext("2d");

    // Make the chart smaller
    chartCanvas.width = 150;
    chartCanvas.height = 150;

    const chartData = {
        labels: ["Correct Answers", "Incorrect Answers"],
        datasets: [{
            data: [correctAnswers, incorrectAnswers],
            backgroundColor: ["#4caf50", "#f44336"]
        }]
    };

    new Chart(ctx, {
        type: "pie",
        data: chartData
    });
}

// Function to reset the quiz
function resetQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    quizQuestions = generateQuiz();
    displayQuestion();

    // Reset the display of the containers
    document.getElementById("quiz-container").style.display = "block";
    document.getElementById("result-container").style.display = "none";

    // Reset the progress bar
    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = "0%";
}

// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
    displayQuestion();
    const resetButton = document.getElementById("reset-button");
    resetButton.addEventListener("click", resetQuiz);
});


// Function to open an external link when the "Learn more about saving money" button is clicked
function openExternalLink() {
    // Replace the URL with the external link you want to open
    window.open('https://www.fundamentaldecisions.com/2022/05/27/r001-the-learning-space/', '_blank');
}

// Add event listeners
document.addEventListener("DOMContentLoaded", () => {
    displayQuestion();

    // Add event listener to the reset button
    const resetButton = document.getElementById("reset-button");
    resetButton.addEventListener("click", resetQuiz);

    // Add event listener to the "Learn more about saving money" button
    const learnMoreButton = document.getElementById("learn-more-button");
    learnMoreButton.addEventListener("click", openExternalLink);
});

