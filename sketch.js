function setup() {
  // TODO: Make the canvas responsively sized
  let canvas = createCanvas(600, 800);
  background(200);
  textAlign(CENTER, CENTER);
}

// TODO: Add a function to draw the grid
//    6 columns, 8 rows
//    Bubbles will hold the characters of the puzzle
bubbles = [];
function draw() {
  textSize(32);
  populateGrid();
  noLoop();
}

// TODO: Use mouseClick to alter bubble at mouse position
function mouseClicked() {}

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
  let newCircle = (xPos, yPos) => ({
    size: 50,
    xpos: xPos,
    ypos: yPos,
    fillColor: [255],
    display() {
      fill(this.fillColor);
      ellipse(this.xpos, this.ypos, this.size, this.size);
    },
    update() {
      this.ypos += 1;
    },
  });

  i = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      bubbles.push(newCircle(50 + col * 100, 50 + row * 100));
      bubbles[i].display();
      bubbles[i].update();
      i++;
    }
  }
  return bubbles;
}
