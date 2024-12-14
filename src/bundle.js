(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
(function (process){(function (){
// Data structures used to make the grid.

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

function GridCanvas(puzzleWords) {
  let puzzle_grid = grid();
  puzzle_grid.makeGrid();
  let frontEndLetters = [];
  let frontEndKey = [];
  for (let index = 0; index < 48; index++) {
    frontEndLetters.push("");
    frontEndKey.push("");
  }

  // Sort the puzzleWords array by length descending.
  puzzleWords.sort((a, b) => b.length - a.length);
  let wordsCopy = puzzleWords.slice();
  let errorCount = 0;

  while (puzzleWords.length > 0) {
    let word = puzzleWords.pop();
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
        //console.log("Unacceptable placement at: " + xStart + "," + yStart);
        errorCount++;
        if (errorCount > 100) {
          console.log("Too many errors, breaking.");
          errorCount = 0;
          frontEndLetters = [];
          frontEndKey = [];
          puzzleWords = wordsCopy.slice();
        }
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
        // Another impossible placement has occurred. Keep an error count to avoid constantly looping.
        errorCount++;
        if (errorCount > 100) {
          console.log("Too many errors, breaking.");
          errorCount = 0;
          frontEndLetters = [];
          frontEndKey = [];
          puzzleWords = wordsCopy.slice();
        } else {
          newLetters = frontEndLetters.slice();
          newKey = frontEndKey.slice();
          puzzleWords.push(word);
        }
        break;
      }
    }
    // Update the front-end letters array with the new word.
    for (let i = 0; i < 48; i++) {
      frontEndLetters[i] = newLetters[i];
      frontEndKey[i] = newKey[i];
    }
  }
  return [frontEndLetters, frontEndKey];
}
// Determine how many bubbles each puzzle word will use.
// This was an attempt to fill the grid but has wound up being scrap code.
function allotSpace(puzzleWords) {
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

// This function is not used in the web version of the game. It was used in testing on Node.js.
function WritePuzzleToFile(puzzleWords) {
  const fs = require("fs");
  let puzzle = GridCanvas(puzzleWords);
  let puzzleLetters = puzzle[0];
  let puzzleKey = puzzle[1];
  //console.log(puzzleLetters);

  // print the last generated puzzleWords to a file named "lastPuzzle.txt"
  // Get current working directory.
  let cwd = process.cwd();
  //console.log(cwd);
  fs.writeFileSync(cwd + "/resources/lastPuzzle.txt", puzzleLetters.toString());

  fs.writeFileSync(cwd + "/resources/lastPuzzleKey.txt", puzzleKey.toString());
}

module.exports = GridCanvas;

}).call(this)}).call(this,require('_process'))
},{"_process":2,"fs":1}],4:[function(require,module,exports){
// Require jsdom
// const jsdom = require("jsdom");

async function RelatedWords(keyword) {
  const pageLink =
    "https://pacific-fjord-98167-21542ad415f7.herokuapp.com/https://relatedwords.io/" +
    keyword;
  let words = [];
  try {
    const response = await fetch(pageLink);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const body = await response.text();
    //const pageDOM = new jsdom.JSDOM(body);
    const parser = new DOMParser();
    const pageDOM = parser.parseFromString(body, "text/html");
    let wordDivs = pageDOM.querySelectorAll(".word-ctn");

    wordDivs.forEach((div) => {
      words.push([
        div.querySelector("a").textContent,
        wordDivs.length - words.length,
      ]);
    });
    //console.log(words.length);
  } catch (error) {
    console.error(error.message);
  }
  return words;
}

module.exports = RelatedWords;

},{}],5:[function(require,module,exports){
const RelatedWords = require("./RelatedWords.js");
const GridCanvas = require("./GridCanvas.js");
//const WordAssociation = require("./WordAssociation.js");

let wordForm = document.getElementById("keyword");
let submitButton = document.getElementById("submit");

// Add an event listener to the form to run the WordScheduling function when the form is submitted.
submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  let keyword = wordForm.value;
  RelatedWords(keyword).then((weightedWords) => {
    let scheduledWords = WordScheduling(weightedWords);
    //console.log("Scheduled Words: ", scheduledWords);
    let lettersAndKeys = GridCanvas(scheduledWords);
    //console.log("Scheduled Words: ", scheduledWords);
    let letters = lettersAndKeys[0];
    //console.log("Letters: ", letters);
    let keys = lettersAndKeys[1];
    // Write the letters and keys to a hidden <p> element.
    let lettersElement = document.getElementById("letters");
    lettersElement.textContent = letters.join();
    document.body.appendChild(lettersElement);
    let keysElement = document.getElementById("keys");
    keysElement.textContent = keys.join();
    document.body.appendChild(keysElement);
  });
});

// Parameters: weightedWords - an array of words generated from WordAssociation that is sorted by descending weight.
// Returns: an array of words whose characters total to 48.
//   - The words should be selected to maximize weight.
function WordScheduling(weightedWords) {
  try {
    // Step 1: Validate that the input is a valid array
    if (!Array.isArray(weightedWords)) {
      throw new TypeError("Input must be an array.");
    }

    if (weightedWords.length === 0) {
      throw new Error("Input array is empty.");
    }
    // Implement a greedy algorithm to select words that total to 48 characters.
    // The first word in the array must be used.
    // TO-DO: Handle error cases where there are no combinations that total to 48 characters.
    //    - Will need to get a larger set of related words to try. Or tell the user to try a different keyword.

    let selectedWords = [];
    let totalChars = 0;
    let keyword = weightedWords[0][0];
    let totalWeight = weightedWords[0][1];

    if (!keyword || typeof keyword !== "string") {
      throw new Error("First word in the array must be a valid string.");
    }

    // Stop conditions are when we've reached 48 characters or there are no more words to consider.
    while (weightedWords.length > 0 && totalChars < 48) {
      /*
      // Starting here means we need to reset the selectedWords array.
      // It starts with the keyword only.
      selectedWords = [keyword];
      totalChars = keyword.length;
      totalWeight = weightedWords[0][1];

      
        Pop off the highest weighted word.
        We do this because on the first run that word is the keyword which we are guaranteed to use, 
        OR:We tried all combinations that use the highest weighted word and it didn't work. So get rid of
        that word and try again.
    
      weightedWords.reverse();
      weightedWords.pop();
      weightedWords.reverse();

      */
      // Iterate through the remaining words to find the best combination.
      weightedWords = weightedWords.reverse();
      while (weightedWords.length > 0) {
        let word = weightedWords.pop();
        if (
          totalChars + word[0].length <= 48 &&
          !selectedWords.includes(word[0])
        ) {
          console.log("Word: ", word[0]);
          console.log("Selected Words: ", selectedWords);
          selectedWords.push(word[0]);
          totalChars += word[0].length;
          totalWeight += word[1];
        } else {
          // When we get here it means the last word we tried to add made us "bust" the 48 character limit.
          // Try and replace a word that was already added with this one.
          for (let j = selectedWords.length - 1; j >= 1; j--) {
            if (
              selectedWords[j].length < word[0].length &&
              totalChars + word[0].length - selectedWords[j].length == 48 &&
              !selectedWords.includes(word[0])
            ) {
              //console.log("Word: ", word[0]);

              totalChars -= selectedWords[j].length;
              totalChars += word[0].length;
              selectedWords[j] = word[0];
              totalWeight += word[1];
              //console.log("Selected Words: ", selectedWords);
              return selectedWords;
            }
          }
        }
      }
    }

    // When this line is reached, totalChars will either be 48 or only the weight of the keyword.
    if (totalChars !== 48) {
      return "No combinations that total to 48 characters.";
    } else {
      console.log("Total Weight: ", totalWeight);
      return selectedWords;
    }
  } catch (error) {
    // Step 4: Handle any errors and return a message
    console.error("An error occurred: ", error.message);
    return error.message; // Optionally return error message
  }
}
/*
let testCase1 = sampleWords;
console.log("Test Case 1: ", WordScheduling(testCase1)); // Should output an array of words with 48 characters.

// Test Case 2: No Valid Combinations
// Input: An array of words with lengths that make it impossible to reach a total of 48 characters.
// Example: [{ word: "BUTTERFLY", weight: 10 }, { word: "DRAGONFLY", weight: 9 }]
let testCase2 = [
  { word: "BUTTERFLY", weight: 10 },
  { word: "DRAGONFLY", weight: 9 },
];
console.log("Test Case 2: ", WordScheduling(testCase2)); // Should output: "No combinations that total to 48 characters."

// =============================
// Test Case 3: Empty Input
// Input: [] (an empty array)
// Expected Output: The string "No combinations that total to 48 characters."
let testCase3 = [];
console.log("Test Case 3: ", WordScheduling(testCase3)); // Should output: "No combinations that total to 48 characters."

// Test Case 4: Input with Single Word
// Input: [{ word: "EARTH", weight: 5 }]
// Expected Output: The string "No combinations that total to 48 characters."
let testCase4 = [{ word: "EARTH", weight: 5 }];
console.log("Test Case 4: ", WordScheduling(testCase4)); // Should output: "No combinations that total to 48 characters."

// Test Case 5: Input with Words of the Same Length
// Input: An array of words where all words have the same length.
// Example: [{ word: "FOUR", weight: 1 }, { word: "FIVE", weight: 2 }, { word: "NINE", weight: 3 }]
let testCase5 = [
  { word: "FOUR", weight: 1 },
  { word: "FIVE", weight: 2 },
  { word: "NINE", weight: 3 },
];
console.log("Test Case 5: ", WordScheduling(testCase5)); // Should output: "No combinations that total to 48 characters."
let testCase6 = [
  { word: "GALAXY", weight: 10 }, // 6 characters
  { word: "SPACESHIP", weight: 9 }, // 9 characters
  { word: "MARTIAN", weight: 8 }, // 7 characters
  { word: "ASTRONAUT", weight: 15 }, // 9 characters
  { word: "SCIENCEFICTION", weight: 12 }, // 14 characters
];
console.log("Test Case 6: ", WordScheduling(testCase6));
// Expected Output: An array of words totaling exactly 48 characters.

let testCase7 = [
  { word: "SPACE", weight: 5 }, // 5 characters
  { word: "SATELLITE", weight: 10 }, // 9 characters
  { word: "PLANET", weight: 8 }, // 6 characters
  { word: "ASTROBIOLOGY", weight: 12 }, // 13 characters
  { word: "ASTEROID", weight: 7 }, // 8 characters
  { word: "COSMOS", weight: 6 }, // 6 characters
  { word: "STARS", weight: 4 }, // 5 characters
  { word: "INTERSTELLAR", weight: 15 }, // 12 characters
];
console.log("Test Case 7: ", WordScheduling(testCase7));
// Expected Output: An array of words that total to 48 characters.

let testCase8 = [
  { word: "SUPERCALIFRAGILISTICEXPIALIDOCIOUS", weight: 100 }, // 48 characters
];
console.log("Test Case 8: ", WordScheduling(testCase8));
// Expected Output: ["SUPERCALIFRAGILISTICEXPIALIDOCIOUS"]

let testCase9 = [
  { word: "BLACKHOLE", weight: 12 }, // 9 characters
  { word: "QUASAR", weight: 9 }, // 6 characters
  { word: "NEBULA", weight: 8 }, // 6 characters
  { word: "STAR", weight: 5 }, // 4 characters
  { word: "SUPERNOVA", weight: 10 }, // 9 characters
  { word: "UNIVERSE", weight: 7 }, // 8 characters
];
console.log("Test Case 9: ", WordScheduling(testCase9));
// Expected Output: "No combinations that total to 48 characters."

let testCase10 = [
  { word: "MOON", weight: 1 }, // 4 characters
  { word: "MARS", weight: 2 }, // 4 characters
  { word: "SPACE", weight: 3 }, // 5 characters
  { word: "ASTRONOMY", weight: 4 }, // 9 characters
  { word: "STARS", weight: 5 }, // 5 characters
  { word: "NEBULA", weight: 6 }, // 6 characters
  { word: "GALAXY", weight: 7 }, // 6 characters
  { word: "PLANETS", weight: 8 }, // 7 characters
];
console.log("Test Case 10: ", WordScheduling(testCase10));
// Expected Output: Array of words that sum to 48 characters, with weights considered.

let testCase11 = [
  { word: "INTERSTELLARVOYAGER", weight: 20 }, // 19 characters
  { word: "EXTRATERRESTRIALCOMMUNICATION", weight: 18 }, // 26 characters
  { word: "UNIVERSE", weight: 10 }, // 8 characters
];
console.log("Test Case 11: ", WordScheduling(testCase11));
// Expected Output: "No combinations that total to 48 characters."

let testCase12 = [
  { word: "SUN", weight: 1 }, // 3 characters
  { word: "MOON", weight: 2 }, // 4 characters
  { word: "BLACKHOLE", weight: 3 }, // 9 characters
  { word: "QUASAR", weight: 4 }, // 6 characters
  { word: "INTERGALACTIC", weight: 5 }, // 13 characters
  { word: "EXOPLANET", weight: 6 }, // 8 characters
  { word: "GRAVITY", weight: 7 }, // 7 characters
  { word: "STARS", weight: 8 }, // 5 characters
];
console.log("Test Case 12: ", WordScheduling(testCase12));
// Expected Output: An array of words that sum to 48 characters.

//code to test the function just remove //
function main() {
  let testCase1 = sampleWords;
  console.log("Test Case 1: ", WordScheduling(testCase1)); // Should output an array of words with 48 characters.

  let testCase2 = [
    { word: "Satisfied", weight: 10 },
    { word: "funtimesy", weight: 9 },
  ];
  console.log("Test Case 2: ", WordScheduling(testCase2)); // Should output: "No combinations that total to 48 characters."

  let testCase3 = [];
  console.log("Test Case 3: ", WordScheduling(testCase3)); // Should output: "No combinations that total to 48 characters."

  // Add more test cases as needed
}
*/
// Call main to run the tests
//main(main);
/*
(async () => {
  let wordList = await RelatedWords("fish");
  let scheduledWords = WordScheduling(wordList);
  console.log("scheduled words:" + scheduledWords);
  // Print the number of characters found in all of the words.
  let totalChars = 0;
  scheduledWords.forEach((word) => {
    totalChars += word.length;
  });
  console.log("Total Characters: ", totalChars);
})();
*/

},{"./GridCanvas.js":3,"./RelatedWords.js":4}]},{},[5]);
