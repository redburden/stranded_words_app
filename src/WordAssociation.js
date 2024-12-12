/*
  The function, APIRequest will be given a keyword. The function
  uses that keyword to query the twinword API for associated words.
*/

/*
    The WordAssociation default function will obtain a keyword from front-end user input.
    It will use that keyword to come up with 20 associated words.
  */

/*
    Add a timer to detect when we've been looping too long. Invalidate the keyword in that case.
  */

async function WordAssociation(keyword) {
  async function APIRequest(keyword) {
    let url =
      "https://twinword-word-graph-dictionary.p.rapidapi.com/association/?entry=";
    url += keyword;
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": "a5e3266b15msh8ef5c4e2b5b25b1p1fe1e1jsn8157911ee17f",
        "x-rapidapi-host": "twinword-word-graph-dictionary.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      let wordList = JSON.parse(result).assoc_word_ex;
      return wordList;
    } catch (error) {
      console.error(error);
    }
  }

  let assocWords = [];
  let APIwords = await APIRequest(keyword);

  while (assocWords.length < 20) {
    APIwords.forEach((word) => {
      if (assocWords.includes(word) == false) {
        assocWords.push(word);
      }
    });

    let newKeyword = assocWords[Math.ceil(Math.random() * assocWords.length)];

    APIwords = await APIRequest(newKeyword);
  }

  let wordCount = 0;
  assocWords.forEach((word) => {
    assocWords[wordCount] = [word, 20 - wordCount];
    wordCount++;
  });

  return assocWords;
}

/*
(async () => {
  let wordList = await WordAssociation("frog");
  console.log(wordList.toString());
})();
*/

module.exports = { WordAssociation: WordAssociation };
