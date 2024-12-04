import fs from "fs";
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
  let frontEndKey = [];
  for (let index = 0; index < 48; index++) {
    frontEndLetters.push("");
    frontEndKey.push("");
  }

  puzzleWords.forEach((word) => {
    let wordChars = word.split("");
    let wordLength = wordChars.length;
    // Pick a random point on the grid to start the word.
    let goodSpot = false;
    let xStart = 0;
    let yStart = 0;

    // Copy the current state of the front-end letters array.
    let newLetters = [];
    let newKey = [];
    for (let i = 0; i < 48; i++) {
      newLetters.push(frontEndLetters[i]);
      newKey.push(frontEndKey[i]);
    }

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
        let simpleI = 6 * yStart + xStart;
        newLetters[simpleI] = wordChars[0];
        newKey[simpleI] = word + " 0";
      } else {
        console.log("Unacceptable placement at: " + xStart + "," + yStart);
      }
    }

    // Iterate through the next letters, placing each in a legal position.
    for (let i = 1; i < wordLength; i++) {
      // Check the legal moves from the current position.
      let legalMoves = emptyNeighbors(yStart, xStart, puzzle_grid);
      // Randomly choose a legal move.
      let goodMove = false;
      // Remove potential moves as we test them. If we can't find a move, we'll have to backtrack.

      while (goodMove == false && legalMoves.length > 0) {
        let randomMovePick = Math.floor(Math.random() * legalMoves.length);
        let move = legalMoves[randomMovePick];
        // Remove the move we're testing from legalMoves.
        legalMoves.splice(randomMovePick, 1);

        let yTest = move[0];
        let xTest = move[1];

        // Need to ignore the condition of leaving empty neighbors for the last letter.
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
          let simpleI = 6 * yStart + xStart;
          newLetters[simpleI] = wordChars[i];
          newKey[simpleI] = word + " " + i;
          // If this is the last letter, append " end" to the key.
          if (i == wordLength - 1) {
            newKey[simpleI] += " end";
          }
        }
      }
      // If we get to here and skipped a letter, need to restart from the beginning of the word.
      if (goodMove == false) {
        newLetters = frontEndLetters.slice();
        newKey = frontEndKey.slice();
        puzzleWords.push(word);
        break;
      }
    }
    // Update the front-end letters array with the new word.
    for (let i = 0; i < 48; i++) {
      frontEndLetters[i] = newLetters[i];
      frontEndKey[i] = newKey[i];
    }
  });
  return [frontEndLetters, frontEndKey];
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
  "species",
  "water",
  "animal",
  "cancer",
  "aquarium",
  "horse",
  "dog",
  "libra",
  "zoo",
];
let puzzle_grid = grid();
puzzle_grid.makeGrid();

let puzzle = GridCanvas(puzzleWords);
let puzzleLetters = puzzle[0];
let puzzleKey = puzzle[1];
console.log(puzzleLetters);

// print the last generated puzzleWords to a file named "lastPuzzle.txt"
// Get current working directory.
let cwd = process.cwd();
console.log(cwd);
fs.writeFileSync(cwd + "/resources/lastPuzzle.txt", puzzleLetters.toString());

fs.writeFileSync(cwd + "/resources/lastPuzzleKey.txt", puzzleKey.toString());
