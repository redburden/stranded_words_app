import WordScheduling from "./WordScheduling";

let gridCharacter = {
  xpos: null,
  ypos: null,
  letter: "",
  word: "",
  top: null,
  left: null,
  right: null,
  bottom: null,
};

let gridWidth = 6;
let gridHeight = 8;
let gridRow = (() => {
  let row = [];
  for (let i = 0; i < gridWidth; i++) {
    row.push(gridCharacter);
  }
  return row;
})();

let grid = (() => {
  let grid = [];
  for (let i = 0; i < gridHeight; i++) {
    grid.push(gridRow);
  }
  return grid;
})();
