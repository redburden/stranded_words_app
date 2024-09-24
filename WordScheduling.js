import { generate } from "random-words";

// TO-DO: WordScheduling should be built as a function that takes in rawWords generated from WordAssociation.
// For now, we will just generate random words for testing.

let rawWords = generate({
  exactly: 20,
  maxLength: 10,
  formatter: (word) => word.toUpperCase(),
});

//TO-DO: For testing, assign random "weights" to each word in rawWords.
//    - The weights should be numbers 1-20 used only once.
//    - Weight will be used as a words' relationship score to the keyword.

console.log(rawWords);
