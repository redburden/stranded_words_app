let modalDiv;
let brightness = 32; // Default brightness
let speed = 30; // Default speed for color change

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight); // Create a full-window canvas
  canvas.style("position", "absolute"); // Ensure the canvas stays behind other elements
  canvas.style("top", "0");
  canvas.style("left", "0");
  canvas.style("z-index", "0"); // Place the canvas below the buttons

  textSize(80); // Adjust the text size to fit the canvas
  textAlign(CENTER, CENTER);

  // Reference to buttons
  const startButton = select("#start-button");
  const helpButton = select("#help-button");
  const settingsButton = select("#settings-button");
  const creditsButton = select("#credits-button");

  // Assign functionality to buttons
  startButton.mousePressed(goToNextScreen);
  helpButton.mousePressed(showHelpModal);
  settingsButton.mousePressed(showSettingsModal);
  creditsButton.mousePressed(showCredits);

  // Create a hidden div for the help modal and apply CSS class
  modalDiv = createDiv(`
    <div class="modal-content">
      <h2>Instructions</h2>
      <p>1. Enter a theme word.</p>
      <p>2. The game will generate a word grid.</p>
      <p>3. Connect adjacent letters to find words.</p>
      <p>4. Correct words turn blue.</p>
      <p>5. Use all letters and no sharing between words.</p>
      <p>6. Earn hints by finding three words.</p>
      <button id='close-btn'>Close</button>
    </div>
  `);

  modalDiv.addClass("modal");
  modalDiv.style("display", "none"); // Initially hide the modal

  // Add event listener to the close button
  select("#close-btn").mousePressed(hideHelpModal);

  // Settings Modal
  settingsModal = createDiv(`
    <div class="modal-content">
      <h2>Settings</h2>
      <label for="brightness">Brightness: </label>
      <input type="range" id="brightness" min="10" max="100" value="${brightness}">
      <br><br>
      <label for="speed">Color Speed: </label>
      <input type="range" id="speed" min="5" max="60" value="${speed}">
      <br><br>
      <button id='close-settings'>Close</button>
    </div>
  `);

  settingsModal.addClass("modal");
  settingsModal.style("display", "none"); // Initially hide settings modal

  // Add event listener to the close button for settings
  select("#close-settings").mousePressed(hideSettingsModal);

  // Handle brightness and speed adjustments
  select("#brightness").input(() => {
    brightness = select("#brightness").value();
  });

  select("#speed").input(() => {
    speed = select("#speed").value();
  });
}

function draw() {
  background(brightness); // Set the background based on brightness level

  // Create a fading effect with colors (blue, orange, white)
  if (frameCount % speed === 0) {
    // Change color based on speed setting
    fill(lerpColor(color(0, 120, 255), color(255, 165, 0), random(0.0, 1.0)));
  }

  text("STRANDED", width / 2, height / 2 - 100); // Draw the "STRANDED" text moved down a bit (was previously -200)
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Adjust the canvas size to match the new window size
}

function showHelpModal() {
  modalDiv.style("display", "flex"); // Show the modal
  select("#button-container").style("display", "none"); // Hide button container
}

function hideHelpModal() {
  modalDiv.style("display", "none"); // Hide the modal
  select("#button-container").style("display", "block"); // Show button container
}

function goToNextScreen() {
  // Code to transition to the next screen goes here
  window.location.href = "../stranded.html"; // Adjust the path as needed
}

function showSettingsModal() {
  settingsModal.style("display", "flex"); // Show the settings modal
  select("#button-container").style("display", "none"); // Hide button container
}

function hideSettingsModal() {
  settingsModal.style("display", "none"); // Hide the settings modal
  select("#button-container").style("display", "block"); // Show button container
}

function showCredits() {
  alert(
    "Game by: \n Enas Awad \n Kyle Furnish \n Austin Burden \n Erika Ferris"
  ); // Placeholder for credits information
}
