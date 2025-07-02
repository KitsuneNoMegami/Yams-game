# Yam's

A console implementation of the classic Yams (Yahtzee) dice game, built with C#
The site to explore the results on HTML, CSS and JavaScript.

## Overview

Yams is a popular dice game where players roll five dice to make specific combinations and score points. This repository provides an interactive version of the game, featuring a user-friendly interface and scoring system.

## Features

- Play Yams (Yahtzee) your console and view the results on my website
- Interactive dice rolling and re-rolling
- Score sheet with automatic calculation
- Rules explanation and gameplay guide
- Responsive design for desktop and mobile

## Technologies Used

- **C#**: Backend logic (if using ASP.NET or WebAssembly)
- **JavaScript**: Frontend interactivity and game mechanics
- **HTML/CSS**: Layout and styling

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (if using build tools or npm packages)
- [.NET SDK](https://dotnet.microsoft.com/download) (if applicable)

## How to play

1. Clone the repo:
   ```
   git clone https://github.com/KitsuneNoMegami/Yams-game.git
   cd Yams-game
   ```
2. Console version (with .NET SDK):
   ```
   dotnet run
   ```
   Then open your browser at `http://localhost:5000`

3. Web version:
   - Open `index.html` in your browser

## Game Rules

1. Each player rolls five dice up to three times per turn.
2. After each roll, players may set aside dice to keep and re-roll the rest.
3. The goal is to fill out the score sheet with the best possible combinations:
    - Ones, Twos, Threes, Fours, Fives, Sixes
    - Three of a Kind, Four of a Kind, Full House, Small Straight, Large Straight, Yams (Yahtzee), Chance
4. The game ends when all categories are filled. The player with the highest total wins.

## Contributing

Contributions are welcome! Please open issues or pull requests for features, bugs, or suggestions.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgements

- Inspired by the classic Yahtzee™ game.
- Dice icons from [Font Awesome](https://fontawesome.com/)

---

Enjoy playing Yam's!
