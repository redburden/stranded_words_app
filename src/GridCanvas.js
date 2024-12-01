//import WordScheduling from "./WordScheduling.js";

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

// DEBUG ISSUE #1: Currently the loop is infinite because where it is placing some words it is boxing
// itself in and not able to place the rest of the words.
export default function GridCanvas(puzzleWords) {
  let frontEndLetters = [];
  for (let index = 0; index < 48; index++) {
    frontEndLetters.push(0);
  }

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
      if (
        puzzle_grid.g[yStart].row[xStart].letter == "" &&
        emptyNeighbors(yStart, xStart, puzzle_grid).length > 0
      ) {
        goodSpot = true;
        puzzle_grid.g[yStart].row[xStart].letter = wordChars[0];
        puzzle_grid.g[yStart].row[xStart].word = word;
        let simpleI = 6 * (yStart + 1) + xStart;
        frontEndLetters[simpleI] = wordChars[0];
      } else {
        console.log("Unacceptable placement at: " + xStart + "," + yStart);
      }
    }

    // Check the legal moves from the current position.
    let legalMoves = emptyNeighbors(yStart, xStart, puzzle_grid);

    // Iterate through the next letters, placing each in a legal position.
    for (let i = 1; i < wordLength; i++) {
      // Randomly choose a legal move.
      let goodMove = false;
      // Remove potential moves as we test them. If we can't find a move, we'll have to backtrack.
      while (goodMove == false && legalMoves.length > 0) {
        let randomMovePick = Math.floor(Math.random() * legalMoves.length);
        let move = legalMoves[randomMovePick];
        // Remove that move from legalMoves.
        legalMoves.splice(randomMovePick, 1);

        let yTest = move[0];
        let xTest = move[1];

        if (
          i == wordLength - 1 ||
          emptyNeighbors(yTest, xTest, puzzle_grid).length > 0
        ) {
          yStart = yTest;
          xStart = xTest;
          puzzle_grid.g[yStart].row[xStart].letter = wordChars[i];
          puzzle_grid.g[yStart].row[xStart].word = word;
          goodMove = true;
          // Find the basic (front-end) index of this bubble position.
          let simpleI = 6 * (yStart + 1) + xStart;
          frontEndLetters[simpleI] = wordChars[i];
        }
      }
    }
  });
  return frontEndLetters;
}
// Determine how many bubbles each puzzle word will use.
export function allotSpace(puzzleWords) {
  let wordSizes = [];
  puzzleWords.forEach((word) => {
    wordSizes.push(word.split("").length);
  });

  return wordSizes;
}

function emptyNeighbors(y, x, grid) {
  let gridHeight = grid.g.length;
  let gridWidth = grid.g[0].row.length;

  let neighbors = [];
  let validNeighbors = [];
  neighbors.push([y, x - 1]);
  neighbors.push([y, x + 1]);
  neighbors.push([y - 1, x]);
  neighbors.push([y + 1, x]);
  neighbors.push([y - 1, x - 1]);
  neighbors.push([y + 1, x - 1]);
  neighbors.push([y - 1, x + 1]);
  neighbors.push([y + 1, x + 1]);

  neighbors.forEach((neighbors) => {
    if (
      neighbors[0] >= 0 &&
      neighbors[0] < gridHeight &&
      neighbors[1] >= 0 &&
      neighbors[1] < gridWidth
    ) {
      if (grid.g[neighbors[0]].row[neighbors[1]].letter == "") {
        validNeighbors.push(neighbors);
      }
    }
  });
  return validNeighbors;
}

let puzzleWords = [
  "pool",
  "reptile",
  "frog",
  "species",
  "leather",
  "amphibian",
  "underwater",
  "ship",
];
let puzzle_grid = grid();
puzzle_grid.makeGrid();

console.log(GridCanvas(puzzleWords));
console.log(emptyNeighbors(0, 0, puzzle_grid));
console.log(emptyNeighbors(4, 3, puzzle_grid));
console.log(allotSpace(puzzleWords));
