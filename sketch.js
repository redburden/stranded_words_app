// Add an event listener for the click event
document.addEventListener('DOMContentLoaded', () => {
  populateGrid();

  // Add a click event listener to each bubble
  document.querySelectorAll('.grid-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      cell.classList.toggle('clicked');
    });
  });
});

function randChars() {
  // Generate an array of 48 random characters.
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let chars = [];

  for (let i = 0; i < 48; i++) {
    chars.push(characters.charAt(Math.floor(Math.random() * characters.length)));
  }
  return chars;
}

function populateGrid() {
  const letters = randChars();

  // Select grid container element from the HTML
  const gridContainer = document.getElementById('grid-container');

  letters.forEach((letter, index) => {
    // Create a new div for each bubble
    const cell = document.createElement('div');
    // Add the grid-cell class so it is styled correctly 
    cell.classList.add('grid-cell');
    // Set the letter as the content of the bubble & append the bubble to the grid container 
    cell.textContent = letter;
    gridContainer.appendChild(cell);
  });
}
