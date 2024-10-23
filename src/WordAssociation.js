class WordAssociation {
    constructor() {
    this.themeModal = select('#themeModal');
    this.themeInput = select('#themeInput');
    this.submitButton = select('#themeSubmit');
    this.themeWords = {
        "Space": ["ASTEROID", "GALAXY", "PLANET", "ROCKET", "ALIEN"],
        "Food": ["PIZZA", "BURGER", "CAKE", "TOAST", "BANANA"],
        "Animals": ["ELEPHANT", "TIGER", "LION", "PANDA", "GIRAFFE"]
    };
}

    show() {
    this.themeModal.style('display', 'block');
    this.submitButton.mousePressed(() => this.handleSubmit());
    }

    handleSubmit() {
        let theme = this.themeInput.value();
        if (theme in this.themeWords) {
        this.themeModal.style('display', 'none');
          console.log("Theme selected:", theme);  // Add this log
          startGameWithTheme(this.themeWords[theme]); // Pass the word list to the game
        } else {
        alert("Theme not found! Please enter a valid theme.");
        }
    }
    }
