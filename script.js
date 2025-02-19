// Select the main display container where the cards will be added
const mainDisplay = document.querySelector(".mainDisplay");

// Define an array of card values (each pair appears twice)
const gameTexts = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F'];

let flippedCards = []; // Stores the two flipped cards for matching
let matchedPairs = 0;  // Tracks the number of matched pairs
let timeLeft = 60; // Game duration in seconds
let timerInterval; // Variable to store the timer

// Select the timer display element
const timerDisplay = document.querySelector(".timer");

// Function to start the game timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`; // Update timer display

        if (timeLeft === 0) {
            clearInterval(timerInterval); // Stop the timer
            alert("Time's up! You lost. Try again."); // Show game over message
            resetGame(); // Restart the game
        }
    }, 1000); // Update every second
}

// Function to shuffle the elements in an array (Fisher-Yates algorithm)
function shuffleTexts(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Get a random index
        [array[i], array[j]] = [array[j], array[i]];  // Swap elements
    }
}

// Function to flip a card and reveal its value
function flipCard(card) {
    card.classList.add("flipped");  // Add the "flipped" class for styling
    card.textContent = card.dataset.value; // Show the card's value
}

// Shuffle the cards before creating them
shuffleTexts(gameTexts);

// Function to create a card element
function createCard(text) {
    const card = document.createElement("div"); // Create a new div element
    card.classList.add("card");  // Add "card" class for styling
    card.dataset.value = text;  // Store the value in a dataset attribute

    // Add an event listener for when the card is clicked
    card.addEventListener("click", () => {
        // Prevent flipping more than two cards or clicking already flipped/matched cards
        if (flippedCards.length >= 2 || card.classList.contains("flipped") || card.classList.contains("matched")) {
            return; // Exit function if any condition is met
        }

        flipCard(card); // Flip the clicked card
        flippedCards.push(card); // Store the flipped card in the array

        // If two cards are flipped, check for a match
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 500); // Delay checking to show the second card
        }
    });

    mainDisplay.appendChild(card); // Add the card to the main display
}

// Function to check if two flipped cards match
function checkMatch() {
    if (flippedCards.length !== 2) return; // Safety check to prevent errors

    const [card1, card2] = flippedCards; // Get the two flipped cards

    if (card1.dataset.value === card2.dataset.value) {
        // Cards match, mark them as "matched"
        card1.classList.add("matched");
        card2.classList.add("matched");
        card1.style.backgroundColor = "blue"; // Change background color
        card2.style.backgroundColor = "blue";
        matchedPairs++; // Increase matched pair count

        // If all pairs are matched, show a "You Win!" alert and stop the timer
        if (matchedPairs === gameTexts.length / 2) {
            clearInterval(timerInterval); // Stop the timer
            setTimeout(() => {
                alert("You win! 🎉");
                resetGame(); // Restart the game
            }, 200);
        }
    } else {
        // If cards don't match, flip them back after a short delay
        setTimeout(() => {
            card1.textContent = "";
            card2.textContent = "";
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
        }, 400);
    }
    
    flippedCards = []; // Reset flippedCards array after checking
}

// Function to reset the game
function resetGame() {
    mainDisplay.innerHTML = ""; // Clear the board
    shuffledTexts = [...gameTexts]; // Reset game texts
    shuffleTexts(shuffledTexts); // Shuffle again
    matchedPairs = 0; // Reset matched pairs count
    flippedCards = []; // Reset flipped cards array
    timeLeft = 60; // Reset timer
    timerDisplay.textContent = `Time Left: ${timeLeft}s`; // Reset timer display
    clearInterval(timerInterval); // Clear previous timer
    startTimer(); // Restart the timer
    shuffledTexts.forEach(text => createCard(text)); // Recreate the cards
}

// Create all cards dynamically by looping through `gameTexts`
gameTexts.forEach(text => createCard(text));

// Start the game timer when the game loads
startTimer();
