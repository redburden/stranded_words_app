let bubbles = [];
let lastClickedBubble = null; // Variable to store the last clicked bubble

let currentClicked = null;
let previousClicked = null;
let bubbleNum = null;
let clickedValues = [];

function setup() {
  // Create the canvas and set background
  let grid_container = createDiv();
  grid_container.addClass("grid-container");
  let canvas = createCanvas(600, 800);
  canvas.parent(grid_container);
  background(200);
  textAlign(CENTER, CENTER);
  background(200);
  populateGrid();
  textSize(32);
}

function draw() {
  noLoop();
}

function mouseClicked() {
  // Get mouseX and mouseY, round them to the nearest 50
  let x = mouseX;
  let y = mouseY;
  let xRound = Math.round(x / 50) * 50;
  let yRound = Math.round(y / 50) * 50;

  // Calculate which bubble was clicked
  xRound = Math.floor(xRound / 100);
  yRound = Math.floor(yRound / 100);

  bubbleNum = yRound * 6 + xRound;
  handleClick();

  if (bubbleNum < bubbles.length) {
    // Check if the index is valid
    if (bubbles[bubbleNum] == lastClickedBubble) {
      lastClickedBubble.fillColor = [255]; // Reset color of the previously clicked bubble
      lastClickedBubble.display(); // Display it again
    }

    if (
      (clickedValues.length == 2 && clickedValues[1] == clickedValues[0] + 6) ||
      clickedValues[1] == clickedValues[0] - 6 ||
      clickedValues[1] == clickedValues[0] + 1 ||
      clickedValues[1] == clickedValues[0] - 1
    ) {
      lastClickedBubble = bubbles[bubbleNum]; // Store the last
      lastClickedBubble.update(); // Update to change its color
      lastClickedBubble.display(); // Display the updated bubble
      showCurrentBubble();
    } else if (clickedValues.length < 2) {
      lastClickedBubble = bubbles[bubbleNum]; // Store the last
      lastClickedBubble.update(); // Update to change its color
      lastClickedBubble.display(); // Display the updated bubble
      showCurrentBubble();
    } else {
      clickedValues = [];
      clearBubbleFormatting();
    }
  }

  // TODO: This method should only apply to the word in progress.
  function clearBubbleFormatting() {
    for (let i = 0; i < bubbles.length; i++) {
      bubbles[i].fillColor = [255];
      bubbles[i].display();
    }
  }

  function showCurrentBubble() {
    //background(200);
    currentBubble = bubbleNum;
    text(currentBubble, 100, 100);
  }
}

function randChars() {
  // Generate an array of 48 random chars
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let chars = [];

  for (let i = 0; i < 48; i++) {
    chars.push(
      characters.charAt(Math.floor(Math.random() * characters.length))
    );
  }

  return chars;
}

// TODO: This should get the grid from GridCanvas.js and display it on the front-end.

function populateGrid() {
  //let letters = randChars();
  let letters = [
    "",
    "",
    "",
    "",
    "A",
    "N",
    "T",
    "",
    "",
    "",
    "B",
    "A",
    "S",
    "A",
    "",
    "",
    "A",
    "N",
    "T",
    "O",
    "",
    "",
    "",
    "",
    "E",
    "K",
    "",
    "",
    "",
    "",
    "",
    "A",
    "",
    "",
    "",
    "",
    "",
    "C",
    "K",
    "L",
    "E",
    "",
    "P",
    "I",
    "C",
    "",
    "",
    "",
  ];
  textSize(32);
  let newCircle = (letter, xPos, yPos) => ({
    size: 50,
    xpos: xPos,
    ypos: yPos,
    fillColor: [255],
    letter: letter,
    display() {
      fill(this.fillColor);
      ellipse(this.xpos, this.ypos, this.size, this.size);
      fill(0);
      text(this.letter, this.xpos, this.ypos);
    },
    update() {
      this.fillColor = [255, 165, 0];
    },
  });

  // Populate the grid with bubbles
  let i = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      bubbles.push(newCircle(letters[i], 50 + col * 100, 50 + row * 100));
      bubbles[i].display();
      i++;
    }
  }
  // Unsure for now if this needs to return the array.
  return bubbles;
}

function handleClick(value) {
  value = bubbleNum;
  clickedValues.push(value);

  if (clickedValues.length > 2) {
    clickedValues.shift();
  }
}



// This is for pull requests.