function setup() {
  // TODO: Make the canvas responsively sized
  let canvas = createCanvas(600, 800);
  background(200);
  textAlign(CENTER, CENTER);
}

bubbles = [];
function draw() {
  textSize(32);
  populateGrid();
  noLoop();
}

// TODO: Use mouseClick to alter bubble at mouse position
function mouseClicked() {
  // Get mouseX and mouseY and round them to the nearest 50
  // Find the bubble at that position
  // Change the bubble's color
  let x = mouseX;
  let y = mouseY;
  let xRound = Math.round(x / 50) * 50;
  let yRound = Math.round(y / 50) * 50;

  xRound = Math.floor(xRound / 100);
  yRound = Math.floor(yRound / 100);

  bubbleNum = yRound * 6 + xRound;

  bubbles[bubbleNum].update();
  bubbles[bubbleNum].display();
}

function randChars() {
  // Generate an array of 48 random chars
  // return the array
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let chars = [];
  for (let i = 0; i < 48; i++) {
    chars.push(
      characters.charAt(Math.floor(Math.random() * characters.length))
    );
  }
  return chars;
}

function populateGrid() {
  letters = randChars();
  gridChars = [];

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

  let i = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      bubbles.push(newCircle(letters[i], 50 + col * 100, 50 + row * 100));
      bubbles[i].display();
      i++;
    }
  }
  return bubbles;
}
