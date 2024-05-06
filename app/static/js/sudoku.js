document.addEventListener("DOMContentLoaded", function () {
  const sudokuContainer = document.getElementById("sudokuContainer");
  const difficultyButtons = document.querySelectorAll("#difficultyMenu button");
  const numberSelectionDiv = document.getElementById("numberSelection");
  const mistakeCounter = document.getElementById("mistakeCounter");
  const timerDisplay = document.getElementById("timer");
  const scoreDisplay = document.getElementById("score");

  let solvedBoard = [];
  let playableBoard = [];
  let selectedNumber = null;
  let mistakes = 0;
  let timer = null;
  let timeElapsed = 0;
  let score = 0;
  let consecutiveCorrectMoves = 0;

  function startTimer() {
    timer = setInterval(() => {
      timeElapsed++;
      timerDisplay.textContent = `Time: ${Math.floor(timeElapsed / 60)}:${
        timeElapsed % 60 < 10 ? "0" : ""
      }${timeElapsed % 60}`;
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  difficultyButtons.forEach((button) => {
    button.addEventListener("click", function () {
      let difficulty = this.getAttribute("data-difficulty");
      console.log(`Difficulty set to: ${difficulty}`);
      solvedBoard = generateSolvedBoard();
      playableBoard = createPlayableBoard(solvedBoard, difficulty);
      renderBoard(sudokuContainer, playableBoard);
      renderNumberButtons();
      document.getElementById("difficultyMenu").style.display = "none";
      mistakes = 0;
      mistakeCounter.textContent = `Mistakes: ${mistakes}`;
      timeElapsed = 0;
      startTimer();
    });
  });

  function renderNumberButtons() {
    numberSelectionDiv.innerHTML = "";
    for (let i = 1; i <= 9; i++) {
      let button = document.createElement("button");
      button.textContent = i;
      button.dataset.number = i;
      button.addEventListener("click", function () {
        selectedNumber = parseInt(this.dataset.number);
        console.log(`Number selected: ${selectedNumber}`);
      });
      numberSelectionDiv.appendChild(button);
    }
    numberSelectionDiv.style.display = "flex";
    disableUnplayableNumbers(playableBoard);
  }

  function disableUnplayableNumbers(boardData) {
    const gridSize = 9;
    let numberCounts = new Array(10).fill(0); // Index 0 is not used

    // Count occurrences of each number in the board
    boardData.forEach((row) => {
      row.forEach((cell) => {
        if (cell !== 0) {
          numberCounts[cell]++;
        }
      });
    });

    // Disable buttons for numbers that already have 9 occurrences
    for (let i = 1; i <= gridSize; i++) {
      const button = document.querySelector(`button[data-number="${i}"]`);
      if (numberCounts[i] === gridSize) {
        button.disabled = true;
      } else {
        button.disabled = false;
      }
    }
  }

  function generateSolvedBoard() {
    console.log("Generating solved board...");
    let board = new Array(9).fill(null).map(() => new Array(9).fill(0));
    solve(board);
    return board;
  }

  function createPlayableBoard(board, difficulty) {
    console.log("Creating playable board...");
    let copy = JSON.parse(JSON.stringify(board)); // Deep copy the board
    return pokeHoles(copy, difficulty);
  }

  function pokeHoles(board, difficulty) {
    let holes =
      difficulty === "testing"
        ? 4
        : difficulty === "easy"
        ? 35
        : difficulty === "medium"
        ? 45
        : difficulty === "hard"
        ? 50
        : 55;
    let attempts = holes;
    while (attempts > 0) {
      let row = Math.floor(Math.random() * 9);
      let col = Math.floor(Math.random() * 9);
      if (board[row][col] !== 0) {
        board[row][col] = 0;
        attempts--;
      }
    }
    return board;
  }

  function solve(board, row = 0, col = 0) {
    if (row === 9) {
      return true;
    }
    if (col === 9) {
      return solve(board, row + 1, 0);
    }
    if (board[row][col] !== 0) {
      return solve(board, row, col + 1);
    }
    for (let num = 1; num <= 9; num++) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num;
        if (solve(board, row, col + 1)) {
          return true;
        }
        board[row][col] = 0;
      }
    }
    return false;
  }

  function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (board[i][col] === num || board[row][i] === num) {
        return false;
      }
      let boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      let boxCol = 3 * Math.floor(col / 3) + (i % 3);
      if (board[boxRow][boxCol] === num) {
        return false;
      }
    }
    return true;
  }

  function renderBoard(container, boardData) {
    console.log("Rendering board...");
    container.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "grid";

    boardData.forEach((row, rowIndex) => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "row";
      row.forEach((cell, colIndex) => {
        const cellDiv = document.createElement("div");
        cellDiv.className = "cell";
        cellDiv.textContent = cell !== 0 ? cell : "";
        cellDiv.addEventListener("click", () =>
          handleCellClick(rowIndex, colIndex)
        );
        rowDiv.appendChild(cellDiv);
      });
      grid.appendChild(rowDiv);
    });
    container.appendChild(grid);
  }

  function handleCellClick(row, col) {
    if (selectedNumber !== null && playableBoard[row][col] === 0) {
      console.log(
        `Placing number ${selectedNumber} at row ${row}, column ${col}`
      );
      playableBoard[row][col] = selectedNumber;
      renderBoard(sudokuContainer, playableBoard);

      if (selectedNumber === solvedBoard[row][col]) {
        console.log("Correct move!");
        consecutiveCorrectMoves++; // Increment for each consecutive correct move
        score += 10 * consecutiveCorrectMoves; // Calculate score based on consecutive correct moves
        updateScoreDisplay(); // Function to update the score display
        disableUnplayableNumbers(playableBoard);
        if (checkWin()) {
          gameWon(); // Call gameWon function if the player wins
        }
      } else {
        console.log("Incorrect move, try again!");
        mistakes++;
        mistakeCounter.textContent = `Mistakes: ${mistakes}`;
        consecutiveCorrectMoves = 0; // Reset on incorrect move
        playableBoard[row][col] = 0;
        renderBoard(sudokuContainer, playableBoard);
      }
    }
  }

  function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('score');
    scoreDisplay.textContent = `Score: ${score}`;
}


  function updateStylesForCompletedSegments(playableBoard, solvedBoard) {
    const gridSize = 9;
    const subGridSize = 3;

    // Check rows and columns for completion and correctness
    for (let i = 0; i < gridSize; i++) {
      let rowComplete = true;
      let colComplete = true;

      for (let j = 0; j < gridSize; j++) {
        if (
          playableBoard[i][j] !== solvedBoard[i][j] ||
          playableBoard[j][i] !== solvedBoard[j][i]
        ) {
          rowComplete = false;
          colComplete = false;
        }
      }

      if (rowComplete) {
        document
          .querySelectorAll(`.row:nth-child(${i + 1}) .cell`)
          .forEach((cell) => cell.classList.add("filled"));
      }
      if (colComplete) {
        for (let k = 0; k < gridSize; k++) {
          document
            .querySelector(`.row:nth-child(${k + 1}) .cell:nth-child(${i + 1})`)
            .classList.add("filled");
        }
      }
    }

    // Check 3x3 grids for completion and correctness
    for (let row = 0; row < gridSize; row += subGridSize) {
      for (let col = 0; col < gridSize; col += subGridSize) {
        let gridComplete = true;
        for (let r = row; r < row + subGridSize; r++) {
          for (let c = col; c < col + subGridSize; c++) {
            if (playableBoard[r][c] !== solvedBoard[r][c]) {
              gridComplete = false;
            }
          }
        }
        if (gridComplete) {
          for (let r = row; r < row + subGridSize; r++) {
            for (let c = col; c < col + subGridSize; c++) {
              document
                .querySelector(
                  `.row:nth-child(${r + 1}) .cell:nth-child(${c + 1})`
                )
                .classList.add("filled");
            }
          }
        }
      }
    }
  }

  function checkWin() {
    const gridSize = 9;
    const boxSize = 3;

    // Check for any empty cells first
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (playableBoard[row][col] === 0) {
          return false; // There's still at least one empty cell, so the game isn't won yet.
        }
      }
    }

    // Check rows and columns for valid completions
    for (let i = 0; i < gridSize; i++) {
      let rowNumbers = new Set();
      let colNumbers = new Set();
      for (let j = 0; j < gridSize; j++) {
        rowNumbers.add(playableBoard[i][j]);
        colNumbers.add(playableBoard[j][i]);
      }
      if (rowNumbers.size !== gridSize || colNumbers.size !== gridSize) {
        return false; // If any row or column doesn't contain exactly 9 unique numbers
      }
    }

    // Check 3x3 subgrids for valid completions
    for (let row = 0; row < gridSize; row += boxSize) {
      for (let col = 0; col < gridSize; col += boxSize) {
        let numbers = new Set();
        for (let r = 0; r < boxSize; r++) {
          for (let c = 0; c < boxSize; c++) {
            numbers.add(playableBoard[row + r][col + c]);
          }
        }
        if (numbers.size !== gridSize) {
          return false; // If any 3x3 box doesn't contain exactly 9 unique numbers
        }
      }
    }

    // If all checks pass, the board is correctly solved
    return true;
  }

  function gameWon() {
    stopTimer();
    console.log(
      `Congratulations! You completed the game in ${timeElapsed} seconds with ${mistakes} mistakes!`
    );
    alert("Congratulations! You solved the puzzle!");
    playAgain();
  }

  function gameLost() {
    stopTimer();
    console.log(`Game over with ${mistakes} mistakes.`);
    alert("Game over! You made too many mistakes.");
  }

  function playAgain() {
    // first let's ask the user if they want to play again, if they do, we will reset the game and show the difficulty menu
    let playAgain = confirm("Do you want to play again?");
    if (playAgain) {
      document.getElementById("difficultyMenu").style.display = "flex";
      sudokuContainer.innerHTML = "";
      numberSelectionDiv.innerHTML = "";
      mistakeCounter.textContent = "";
      timerDisplay.textContent = "";
      scoreDisplay.textContent = "";
    }
  }
});
