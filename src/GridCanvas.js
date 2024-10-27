import WordScheduling from "./WordScheduling.js";

let gridCharacter = (x, y) => ({
  xpos: x,
  ypos: y,
  letter: "",
  word: "",
  top: null,
  left: null,
  right: null,
  bottom: null,
});

let gridWidth = 6;
let gridHeight = 8;
let gridRow = (rowNum) => ({
  row: [],
  makeRow() {
    for (let i = 0; i < gridWidth; i++) {
      this.row.push(gridCharacter(i, rowNum));
    }
  },
});

let grid = () => ({
  g: [],
  makeGrid() {
    for (let i = 0; i < gridHeight; i++) {
      let r = gridRow(i);
      r.makeRow();
      this.g.push(r);
    }
  },
});

let sampleWords = [
  { word: "SCIENCEFICTION", weight: 20 },
  { word: "MUTANT", weight: 19 },
  { word: "ASTRONAUT", weight: 18 },
  { word: "ALIEN", weight: 17 },
  { word: "DROID", weight: 16 },
  { word: "CYBORG", weight: 15 },
  { word: "GALAXY", weight: 14 },
  { word: "ROBOT", weight: 13 },
  { word: "MARTIAN", weight: 12 },
  { word: "SPACESHIP", weight: 11 },
  { word: "ASTEROID", weight: 10 },
  { word: "EXTRATERRESTRIAL", weight: 9 },
  { word: "TELEPORT", weight: 8 },
  { word: "STARSHIP", weight: 7 },
  { word: "INTERGALACTIC", weight: 6 },
  { word: "ORBIT", weight: 5 },
  { word: "SPACECRAFT", weight: 4 },
  { word: "ASTRONOMY", weight: 3 },
  { word: "COSMOS", weight: 2 },
  { word: "SPACETIME", weight: 1 },
];

let puzzleWords = ["PICKLE", "BANANA", "CAKE", "TOAST"];
let puzzle_grid = grid();
puzzle_grid.makeGrid();

// Currently the loop is infinite because where it is placing some words it is boxing
// itself in and not able to place the rest of the words.
export default function GridCanvas(puzzleWords) {
  puzzleWords.forEach((word) => {
    let wordChars = word.split("");
    let wordLength = wordChars.length;
    // Pick a random point on the grid to start the word.
    let goodSpot = false;
    let xStart = 0;
    let yStart = 0;
    while (goodSpot == false) {
      xStart = Math.floor(Math.random() * gridWidth);
      yStart = Math.floor(Math.random() * gridHeight);
      if (puzzle_grid.g[yStart].row[xStart].letter == "") {
        goodSpot = true;
        puzzle_grid.g[yStart].row[xStart].letter = wordChars[0];
        puzzle_grid.g[yStart].row[xStart].word = word;
      }
    }

    // Iterate through the next letters, placing each in a legal position.
    for (let i = 1; i < wordLength; i++) {
      // Check the legal moves from the current position.
      let legalMoves = [];
      if (puzzle_grid.g[yStart].row[xStart].ypos > 0) {
        legalMoves.push(gridWidth * -1);
      }
      if (puzzle_grid.g[yStart].row[xStart].ypos < gridHeight - 1) {
        legalMoves.push(gridWidth);
      }
      if (puzzle_grid.g[yStart].row[xStart].xpos > 0) {
        legalMoves.push(-1);
      }
      if (puzzle_grid.g[yStart].row[xStart].xpos < gridWidth - 1) {
        legalMoves.push(1);
      }

      // Randomly choose a legal move.
      let goodMove = false;
      while (goodMove == false) {
        let move = legalMoves[Math.floor(Math.random() * legalMoves.length)];
        let xMove = move == -6 || move == 6 ? 0 : move;
        let yMove = move == -1 || move == 1 ? 0 : move / gridWidth;

        // Also need to check that we aren't boxing in any neighbors.
        // For each other legal move: if the neighbor is empty, check we are not boxing it in.
        // UNLESS: it is the last letter of the word.
        if (puzzle_grid.g[yStart + yMove].row[xStart + xMove].letter == "") {
          yStart += yMove;
          xStart += xMove;
          puzzle_grid.g[yStart].row[xStart].letter = wordChars[i];
          puzzle_grid.g[yStart].row[xStart].word = word;

          goodMove = true;
        }
      }
    }
  });
  let front_end_letters = [];
  puzzle_grid.g.forEach((row) => {
    row.row.forEach((cell) => {
      front_end_letters.push(cell.letter);
    });
  });
  return front_end_letters;
}

console.log(GridCanvas(puzzleWords));
