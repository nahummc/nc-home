document.addEventListener('DOMContentLoaded', function() {
    const sudokuContainer = document.getElementById('sudokuContainer');
    const difficultyButtons = document.querySelectorAll('#difficultyMenu button');
    const numberSelectionDiv = document.getElementById('numberSelection');

    let solvedBoard = [];
    let playableBoard = [];
    let selectedNumber = null;

    difficultyButtons.forEach(button => {
        button.addEventListener('click', function() {
            let difficulty = this.getAttribute('data-difficulty');
            console.log(`Difficulty set to: ${difficulty}`);
            solvedBoard = generateSolvedBoard();
            playableBoard = createPlayableBoard(solvedBoard, difficulty);
            renderBoard(sudokuContainer, playableBoard);
            renderNumberButtons();
            document.getElementById('difficultyMenu').style.display = 'none';
        });
    });

    function renderNumberButtons() {
        numberSelectionDiv.innerHTML = ''; // Clear previous buttons if any
        for (let i = 1; i <= 9; i++) {
            let button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', function() {
                selectedNumber = i;
                console.log(`Number selected: ${selectedNumber}`);
            });
            numberSelectionDiv.appendChild(button);
        }
        numberSelectionDiv.style.display = 'flex'; // Display the number selection
    }

    function generateSolvedBoard() {
        console.log('Generating solved board...');
        let board = new Array(9).fill(null).map(() => new Array(9).fill(0));
        solve(board);
        return board;
    }

    function createPlayableBoard(board, difficulty) {
        console.log('Creating playable board...');
        let copy = JSON.parse(JSON.stringify(board)); // Deep copy the board
        return pokeHoles(copy, difficulty);
    }

    function pokeHoles(board, difficulty) {
        let holes = difficulty === 'testing' ? 4 : difficulty === 'easy' ? 35 : difficulty === 'medium' ? 45 : difficulty === 'hard' ? 50 : 55;
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
            let boxCol = 3 * Math.floor(col / 3) + i % 3;
            if (board[boxRow][boxCol] === num) {
                return false;
            }
        }
        return true;
    }

    function renderBoard(container, boardData) {
        console.log('Rendering board...');
        container.innerHTML = '';
        const grid = document.createElement('div');
        grid.className = 'grid';
    
        boardData.forEach((row, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'row';
            row.forEach((cell, colIndex) => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'cell';
                cellDiv.textContent = cell !== 0 ? cell : '';
                cellDiv.addEventListener('click', () => handleCellClick(rowIndex, colIndex));
                rowDiv.appendChild(cellDiv);
            });
            grid.appendChild(rowDiv);
        });
        container.appendChild(grid);
        updateStylesForCompletedSegments(boardData, solvedBoard); // Check for completed segments
    }
    
    

    function handleCellClick(row, col) {
        if (selectedNumber !== null && playableBoard[row][col] === 0) {
            console.log(`Placing number ${selectedNumber} at row ${row}, column ${col}`);
            playableBoard[row][col] = selectedNumber; // Temporarily update the board for re-render
            renderBoard(sudokuContainer, playableBoard); // Re-render the board
    
            // Check if the placed number matches the solved board
            if (selectedNumber === solvedBoard[row][col]) {
                console.log('Correct move!');
            } else {
                console.log('Incorrect move, try again!');
                playableBoard[row][col] = 0; // Reset the cell if the move is wrong
                renderBoard(sudokuContainer, playableBoard); // Re-render the board to show the reset
            }
        }
    }

    function updateStylesForCompletedSegments(playableBoard, solvedBoard) {
        const gridSize = 9;
        const subGridSize = 3;
    
        // Check rows and columns for completion and correctness
        for (let i = 0; i < gridSize; i++) {
            let rowComplete = true;
            let colComplete = true;
    
            for (let j = 0; j < gridSize; j++) {
                if (playableBoard[i][j] !== solvedBoard[i][j] || playableBoard[j][i] !== solvedBoard[j][i]) {
                    rowComplete = false;
                    colComplete = false;
                }
            }
    
            if (rowComplete) {
                document.querySelectorAll(`.row:nth-child(${i + 1}) .cell`).forEach(cell => cell.classList.add('filled'));
            }
            if (colComplete) {
                for (let k = 0; k < gridSize; k++) {
                    document.querySelector(`.row:nth-child(${k + 1}) .cell:nth-child(${i + 1})`).classList.add('filled');
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
                            document.querySelector(`.row:nth-child(${r + 1}) .cell:nth-child(${c + 1})`).classList.add('filled');
                        }
                    }
                }
            }
        }
    }
    
    
    
});
