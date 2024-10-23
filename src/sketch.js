let bubbles = [];
let clickedValues = [];
let selectedLetters = []; // To store the letters of clicked bubbles
let validWords = ["ANT", "ASTEROID", "GALAXY", "PICKLE", "BANANA", "CAKE", "TOAST"]; // Example valid words list

function setup() {
  let grid_container = createDiv();
  grid_container.addClass("grid-container");
  let canvas = createCanvas(600, 800);
  canvas.parent(grid_container);
  background(200);
  textAlign(CENTER, CENTER);
  textSize(32);

  // Populate the grid with bubbles
  populateGrid();
}

function draw() {
  noLoop(); // Only need to redraw when necessary
}

function mouseClicked() {
  let xRound = Math.floor(mouseX / 100);
  let yRound = Math.floor(mouseY / 100);

  bubbleNum = yRound * 6 + xRound;

  if (bubbleNum < bubbles.length) {
    handleClick();
  }
}

function handleClick() {
  let currentBubble = bubbles[bubbleNum];

  // Allow for continuous clicks if adjacent or diagonal
  if (clickedValues.length === 0) {
    // First bubble click
    clickedValues.push(bubbleNum);
    selectedLetters.push(currentBubble.letter); // Add the first letter
    updateBubble(currentBubble);
  } else if (
    clickedValues.length >= 1 &&
    (
      bubbleNum === clickedValues[clickedValues.length - 1] + 6 || // Vertical adjacency
      bubbleNum === clickedValues[clickedValues.length - 1] - 6 ||
      bubbleNum === clickedValues[clickedValues.length - 1] + 1 || // Horizontal adjacency
      bubbleNum === clickedValues[clickedValues.length - 1] - 1 ||
      bubbleNum === clickedValues[clickedValues.length - 1] + 7 || // Bottom-right diagonal
      bubbleNum === clickedValues[clickedValues.length - 1] - 7 || // Top-left diagonal
      bubbleNum === clickedValues[clickedValues.length - 1] + 5 || // Bottom-left diagonal
      bubbleNum === clickedValues[clickedValues.length - 1] - 5    // Top-right diagonal
    )
  ) {
    clickedValues.push(bubbleNum); // Allow continuous selection of adjacent or diagonal bubbles
    selectedLetters.push(currentBubble.letter); // Add the letter of the clicked bubble
    updateBubble(currentBubble);

    // Check if selectedLetters form a valid word
    let currentWord = selectedLetters.join("");
    if (isValidWord(currentWord)) {
      console.log("You've formed a valid word:", currentWord);
      // Reset after forming a valid word
      clickedValues = [];
      selectedLetters = [];
      clearBubbleFormatting(); // Reset the colors of the bubbles
    }
  } else {
    // If the clicked bubble is not adjacent, reset the selection
    clickedValues = [];
    selectedLetters = [];
    clearBubbleFormatting();
  }
}

function updateBubble(bubble) {
  bubble.update(); // Change color
  bubble.display(); // Redraw with new color
  showCurrentBubble();
}

function clearBubbleFormatting() {
  for (let i = 0; i < bubbles.length; i++) {
    bubbles[i].fillColor = [255]; // Reset to default white color
    bubbles[i].display();
  }
  clickedValues = [];
  selectedLetters = [];
}

function showCurrentBubble() {
  let currentBubble = bubbleNum;
  fill(0);
  text(`Current Bubble: ${currentBubble}`, width / 2, height - 50);
}

function isValidWord(word) {
  // Add your list of valid words or fetch from your word generation logic
  return validWords.includes(word);
}

// Populate the grid with bubbles
function populateGrid() {
  let letters = [
    "", "", "", "", "A", "N", "T", "", "", "", "B", "A", "S", "A", "", "",
    "A", "N", "T", "O", "", "", "", "", "E", "K", "", "", "", "", "", "A", "",
    "", "", "", "", "", "C", "K", "L", "E", "", "P", "I", "C", "", "", ""
  ];

  // Fill remaining empty letters with random letters
  for (let i = 0; i < letters.length; i++) {
    if (letters[i] === "") {
      letters[i] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Fill with random letters (A-Z)
    }
  }

  let newCircle = (letter, xPos, yPos) => ({
    size: 50,
    xpos: xPos,
    ypos: yPos,
    fillColor: [255],
    letter: letter,
    display() {
      fill(this.fillColor);
      ellipse(this.xpos, this.ypos, this.size, this.size); // Draw bubble
      fill(0);
      text(this.letter, this.xpos, this.ypos); // Display letter in the bubble
    },
    update() {
      this.fillColor = [255, 165, 0]; // Change to orange on click
    }
  });

  let i = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      bubbles.push(newCircle(letters[i], 50 + col * 100, 50 + row * 100));
      bubbles[i].display();
      i++;
    }
  }
}
