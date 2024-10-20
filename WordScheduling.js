import { generate } from "random-words";

// TO-DO: WordScheduling should be built as a function that takes in rawWords generated from WordAssociation.
// To test, we will need to generate random words.

let rawWords = generate({
  exactly: 20,
  maxLength: 10,
  formatter: (word) => word.toUpperCase(),
});

//TO-DO: For testing, assign random "weights" to each word in rawWords.
//    - The weights should be numbers 1-20 used only once.
//    - Weight will be used as a words' relationship score to the keyword.

// Theme: Spacing out
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
//DROID
//CYBORG
//MUTANT
//ROBOT
//ALIEN
//MARTIAN
//SCIENCEFICTION
//Total Weight: 112

// Parameters: weightedWords - an array of words generated from WordAssociation that is sorted by descending weight.
// Returns: an array of words whose characters total to 48.
//   - The words should be selected to maximize weight.
export default function WordScheduling(weightedWords) {
  // Implement a greedy algorithm to select words that total to 48 characters.
  // The first word in the array must be used.
  // TO-DO: Handle error cases where there are no combinations that total to 48 characters.
  //    - Will need to get a larger set of related words to try. Or tell the user to try a different keyword.

  let selectedWords = [];
  let totalChars = 0;
  let keyword = weightedWords[0].word;
  let totalWeight = weightedWords[0].weight;

  // Stop conditions are when we've reached 48 characters or there are no more words to consider.
  while (weightedWords.length > 0 && totalChars < 48) {
    // Starting here means we need to reset the selectedWords array.
    // It starts with the keyword only.
    selectedWords = [keyword];
    totalChars = keyword.length;
    totalWeight = weightedWords[0].weight;

    /* 
       Pop off the highest weighted word.
       We do this because on the first run that word is the keyword which we are guaranteed to use, OR:
       We tried all combinations that use the highest weighted word and it didn't work. So get rid of
       that word and try again.
    */
    weightedWords.reverse();
    weightedWords.pop();
    weightedWords.reverse();

    // Iterate through the remaining words to find the best combination.
    weightedWords.forEach((word) => {
      if (totalChars + word.word.length <= 48) {
        selectedWords.push(word.word);
        totalChars += word.word.length;
        totalWeight += word.weight;
      } else {
        // When we get here it means the last word we tried to add made us "bust" the 48 character limit.
        // Try and replace a word that was already added with this one.
        for (let j = selectedWords.length - 1; j >= 1; j--) {
          if (totalChars + word.word.length - selectedWords[j].length == 48) {
            selectedWords[j] = word.word;
            totalChars += word.word.length - selectedWords[j].length;
            totalWeight += word.weight;
            break;
          }
        }
      }
    });
  }

  // When this line is reached, totalChars will either be 48 or only the weight of the keyword.
  if (totalChars !== 48) {
    return "No combinations that total to 48 characters.";
  } else {
    console.log("Total Weight: ", totalWeight);
    return selectedWords;
  }
}

//console.log(WordScheduling(sampleWords));
