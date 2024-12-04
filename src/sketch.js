let bubbles = [];
let lastClickedBubble = null; // Variable to store the last clicked bubble

let currentClicked = null;
let previousClicked = null;
let bubbleNum = null;
let clickedValues = [];
let letters = [];
let keys = [];

function preload() {
  try {
    letters = loadStrings("../resources/lastPuzzle.txt");
    keys = loadStrings("../resources/lastPuzzleKey.txt");
  } catch (e) {
    console.log(e);
    preload();
  }
}

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
      // Here we need to handle cases where we check for a valid word. As in: the user selected a list of bubbles that form a word.

      lastClickedBubble.fillColor = [255]; // Reset color of the previously clicked bubble
      lastClickedBubble.display(); // Refresh display.
    }

    let cvLength = clickedValues.length;
    if (
      //what if we used mouse clicks to make sure they were in the bubble like on the start page I used a pointer outside the  Strands Logo
      //then when I was touching the button with the mouse I changed the mouse to a hand....
      (clickedValues.length == 2 &&
        clickedValues[cvLength - 2] == clickedValues[cvLength - 1] + 6) ||
      clickedValues[cvLength - 2] == clickedValues[cvLength - 1] - 6 ||
      clickedValues[cvLength - 2] == clickedValues[cvLength - 1] + 1 ||
      clickedValues[cvLength - 2] == clickedValues[cvLength - 1] - 1 ||
      clickedValues[cvLength - 2] == clickedValues[cvLength - 1] - 7 ||
      clickedValues[cvLength - 2] == clickedValues[cvLength - 1] + 7 ||
      clickedValues[cvLength - 2] == clickedValues[cvLength - 1] - 5 ||
      clickedValues[cvLength - 2] == clickedValues[cvLength - 1] + 5
    ) {
      lastClickedBubble = bubbles[bubbleNum]; // Store the last
      lastClickedBubble.update(); // Update to change its color
      console.log("Drawing line from " + clickedValues[cvLength - 2]);
      drawLine(
        clickedValues[cvLength - 2],
        bubbles[bubbleNum].xpos,
        bubbles[bubbleNum].ypos
      ); // Connect the last bubble to the current one
      lastClickedBubble.display(); // Display the updated bubble
    } else if (clickedValues.length < 2) {
      lastClickedBubble = bubbles[bubbleNum]; // Store the last
      lastClickedBubble.update(); // Update to change its color
      lastClickedBubble.display(); // Display the updated bubble
    } else if (clickedValues[cvLength - 2] == clickedValues[cvLength - 1]) {
      // Test to see if the word was completed.
      let prevClicked = keys[clickedValues[0]].split(" ");
      let letterNum = Number(prevClicked[1]);
      if (letterNum == 0) {
        for (let i = 1; i < clickedValues.length; ) {
          if (
            keys[clickedValues[i]].split(" ")[2] &&
            keys[clickedValues[i]].split(" ")[2] == "end"
          ) {
            console.log("Valid word.");
            // Call the function to format the word blue. Add this to the list of words found.
            colorWordBlue(prevClicked[0]);
            clickedValues = [];
            break;
          } else {
            i++;
          }
          if (
            keys[clickedValues[i]].split(" ")[1] - 1 !=
              keys[clickedValues[i - 1]].split(" ")[1] ||
            keys[clickedValues[i]].split(" ")[0] !=
              keys[clickedValues[i - 1]].split(" ")[0]
          ) {
            console.log(
              "Not a valid word." +
                keys[clickedValues[i]] +
                " " +
                keys[clickedValues[i - 1]]
            );
            clickedValues.forEach((clicked) => {
              clearBubbleFormattingByIndex(clicked);
            });
            clickedValues = [];
            break;
          }
        }
      } else {
        // Clear formatting for each clicked bubble.
        clickedValues.forEach((clicked) => {
          clearBubbleFormattingByIndex(clicked);
        });
        clickedValues = [];
      }
    }
  }

  function drawLine(index, x, y) {
    bubbles[index].connect(x, y);
    bubbles[index].display();
  }

  function clearBubbleFormattingByIndex(index) {
    bubbles[index].fillColor = [255];
    bubbles[index].xConnect = bubbles[index].xpos;
    bubbles[index].yConnect = bubbles[index].ypos;
    bubbles[index].display();
  }

  function colorWordBlue(word) {
    for (let i = 0; i < bubbles.length; i++) {
      let bubbleKey = keys[i].split(" ")[0];
      if (bubbleKey == word) {
        bubbles[i].fillColor = [0, 0, 255];
        bubbles[i].display();
      }
    }
  }

  function showCurrentBubble() {
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

// Retrieve the grid greated by GridCanvas.js and display it.

function populateGrid() {
  // Get letter array from ../puzzle_resources/lastPuzzle.txt
  letters = letters[0].split(",");
  keys = keys[0].split(",");
  console.log(letters);
  textSize(32);
  let newCircle = (letter, xPos, yPos) => ({
    size: 50,
    xpos: xPos,
    ypos: yPos,
    fillColor: [255],
    letter: letter.toUpperCase(),
    xConnect: xPos,
    yConnect: yPos,
    display() {
      if (this.letter != "") {
        fill(this.fillColor);
        strokeWeight(2);
        ellipse(this.xpos, this.ypos, this.size, this.size);
        fill(0);
        text(this.letter, this.xpos, this.ypos);
        strokeWeight(5);
        if (this.xConnect != this.xpos || this.yConnect != this.ypos)
          line(this.xpos, this.ypos, this.xConnect, this.yConnect);
      }
    },
    update() {
      this.fillColor = [255, 165, 0];
    },
    connect(x, y) {
      this.xConnect = x;
      this.yConnect = y;
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
  console.log(clickedValues);

  /*
  if (clickedValues.length > 2) {
    clickedValues.shift();
  }
    */
}
