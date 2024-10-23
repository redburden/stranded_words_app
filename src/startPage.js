const message = "Stranded";
const messageX = 30;
const messageY = 150;
let helpButton, modalDiv;

function setup() {
  createCanvas(300, 300);
  textSize(60);

  // Create help button and apply CSS class
  helpButton = createButton("Help");
  helpButton.position(width / 2 - 30, height - 130); // Center the button
  helpButton.addClass("help-button"); // Add the CSS class defined in style.css

  helpButton.mousePressed(showHelpModal); // Show the help modal when pressed

  // Create a hidden div for the help modal and apply CSS class
  modalDiv = createDiv(`
    <h2>Instructions</h2>
    <p>1. Enter a theme word.</p>
    <p>2. The game will generate a word grid.</p>
    <p>3. Connect adjacent letters to find words.</p>
    <p>4. Correct words turn blue.</p>
    <p>5. Use all letters and no sharing between words.</p>
    <p>6. Earn hints by finding three words.</p>
    <button id='close-btn'>Close</button>
  `);

  modalDiv.addClass("modal"); // Apply the modal CSS class for styling

  // Add event listener to the close button
  select("#close-btn").mousePressed(hideHelpModal);
}

function draw() {
  background(32);

  // Glowing effect for the "Stranded" text
  if (isMouseInsideText(message, messageX, messageY)) {
    cursor(HAND); // Change cursor to hand when hovering over "Stranded"
    fill(200, 190, 0);
    stroke(0, 200, 255);
    strokeWeight(2);
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = "rgba(0, 200, 255, 0.7)";
  } else {
    cursor(ARROW); // Regular cursor when not hovering over "Stranded"
    fill(255);
    stroke(255);
    strokeWeight(1);
    drawingContext.shadowBlur = 0;
  }

  // Display the "Stranded" text
  text(message, messageX, messageY);
}

// Detect mouse click on the "Stranded" text
function mouseClicked() {
  if (isMouseInsideText(message, messageX, messageY)) {
    // Open another page when "Stranded" is clicked
    window.open("https://www.example.com", "_blank"); // Opens in a new tab
  }
}

function showHelpModal() {
  modalDiv.style("display", "block"); // Show the modal
  helpButton.hide(); // Hide the help button
}

function hideHelpModal() {
  modalDiv.style("display", "none"); // Hide the modal
  helpButton.show(); // Show the help button again
}

// Check if the mouse is inside the "Stranded" text
function isMouseInsideText(message, messageX, messageY) {
  const messageWidth = textWidth(message);
  const messageTop = messageY - textAscent();
  const messageBottom = messageY + textDescent();

  return (
    mouseX > messageX &&
    mouseX < messageX + messageWidth &&
    mouseY > messageTop &&
    mouseY < messageBottom
  );
}
