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
