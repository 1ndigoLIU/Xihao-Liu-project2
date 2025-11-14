# Sudoku Arcade

A single-player Sudoku game built with React, featuring two difficulty modes (Easy 6×6 and Normal 9×9), real-time validation, timer, and game state persistence.

**Author:** Xihao Liu  
**Course:** CS5610 Web Development  
**Project:** Project 2 - Sudoku  
**Live site:** https://xihao-liu-project2.onrender.com

## Features

### Core Functionality
- **Two Game Modes:**
  - **Easy Mode (6×6):** Starts with half the board (18 cells) pre-filled
  - **Normal Mode (9×9):** Starts with 28-30 cells pre-filled
- **Real-time Validation:** Invalid inputs are highlighted in red
- **Cell States:** Unselected, Selected, Incorrect, and Hover states with visual feedback
- **Game Controls:**
  - New Game: Generate a fresh puzzle
  - Reset: Revert to the original puzzle state
  - Timer: Track elapsed time
- **Completion Detection:** Board locks when puzzle is solved, displays congratulations message

### Bonus Features
- **Local Storage:** Game state persists across browser refreshes (Easy and Normal modes stored separately)
- **Backtracking Algorithm:** Ensures each puzzle has a unique solution with verification
- **Hint System:** Two-phase algorithm finds hint cells - first checks for cells with exactly one valid number, then uses backtracking to find "forced" cells that lead to unique solutions

## Tech Stack

- **Frontend Framework:** React 19.2.0
- **Routing:** React Router DOM 7.9.6
- **State Management:** React Context API with useReducer
- **Build Tool:** Vite 7.2.2
- **Styling:** Custom CSS with responsive design

## Installation

1. Clone the repository:
```bash
git clone https://github.com/1ndigoLIU/xihao-liu-project2.git
cd xihao-liu-project2
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── GamePage.jsx    # Main game page component
│   ├── SudokuBoard.jsx # Board rendering component
│   ├── SudokuCell.jsx  # Individual cell component
│   ├── GameControls.jsx# Control buttons
│   ├── Timer.jsx       # Timer display
│   └── Congratulations.jsx # Completion message
├── context/             # State management
│   └── SudokuContext.jsx # Context API with useReducer
├── pages/               # Page components
│   ├── Home.jsx
│   ├── GameEasy.jsx
│   ├── GameNormal.jsx
│   ├── GameSelection.jsx
│   ├── Rules.jsx
│   ├── Scores.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── utils/               # Utility functions
│   ├── sudokuGenerator.js  # Puzzle generation with backtracking
│   ├── hintUtils.js         # Hint finding algorithm
│   ├── localStorageUtils.js # Local storage management
│   └── timeFormatter.js     # Time formatting
└── styles/              # CSS stylesheets
    ├── common.css
    ├── game-easy.css
    └── game-hard.css
```

## Key Implementation Details

### State Management
- Uses React Context API with `useReducer` for centralized state management
- Game state includes: board, solution, given cells, selected cell, invalid cells, timer, and completion status
- All localStorage operations are handled through Context

### Puzzle Generation
- **Algorithm:** Formula-based pattern generation with row/column group shuffling
- **Uniqueness:** Backtracking algorithm ensures each puzzle has exactly one solution
- **Verification:** `verifyUniqueSolution()` function validates puzzle uniqueness after generation
- **Location:** `src/utils/sudokuGenerator.js`

### Hint System
- **Two-phase algorithm:**
  1. **Fast check:** Finds cells with exactly one valid number (immediate hints)
  2. **Backtracking check:** Uses solution counting to find "forced" cells that lead to unique solutions (even if multiple valid numbers exist)
- Randomly selects one if multiple hint cells are found
- **Location:** `src/utils/hintUtils.js`

### Local Storage
- Separate storage for Easy and Normal modes
- Auto-saves after each action
- Clears on game completion or reset
- **Location:** `src/utils/localStorageUtils.js`

## Routes

- `/` - Home page
- `/games` - Game selection page
- `/games/easy` - Easy mode (6×6)
- `/games/normal` - Normal mode (9×9)
- `/rules` - Game rules and credits
- `/scores` - High scores (mock data)
- `/login` - Login page
- `/register` - Registration page

## Responsive Design

The application is fully responsive and works on both desktop and mobile browsers. The layout adapts to different screen sizes with appropriate styling.

## Deployment

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## License

This project is part of CS5610 Web Development coursework at Northeastern University.

## Author

**Xihao Liu**
- Email: liu.xiha@northeastern.edu
- GitHub: [@1ndigoLIU](https://github.com/1ndigoLIU)
- LinkedIn: [xihao-liu](https://www.linkedin.com/in/xihao-liu)

---

Built with ❤️ for CS5610 Web Development
