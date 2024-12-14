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
