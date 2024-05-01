document.addEventListener('DOMContentLoaded', function() {
    console.log('Sudoku script loading...');
    const sudokuContainer = document.getElementById('sudokuContainer');
    
    let board = generateBoard('easy'); // Change difficulty as needed
    renderBoard(sudokuContainer, board);

    function generateBoard(difficulty) {
        console.log('Generating board...');
        let board = createInitialBoard(difficulty);
        board = pokeHoles(board, difficulty);
        if (!solve(board)) {
            console.error('Failed to solve the board');
        }
        return board;
    }

    function createInitialBoard(difficulty) {
        console.log(`Creating initial board with difficulty: ${difficulty}`);
        let board = new Array(9).fill(null).map(() => new Array(9).fill(0));
        solve(board); // Generate a full solution first
        return pokeHoles(board, difficulty); // Then poke holes according to the difficulty
    }

    function pokeHoles(board, difficulty) {
        console.log(`Poking holes in the board, difficulty: ${difficulty}`);
        let holes = difficulty === 'easy' ? 35 : difficulty === 'medium' ? 45 : 55;
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
    }

    function handleCellClick(row, col) {
        console.log(`Cell clicked at row ${row}, column ${col}`);
        // Add game logic or interaction as needed
    }
});
