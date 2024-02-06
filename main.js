const GameController = function(player1, player2) {
    const playerOne = Player(player1, "X")
    const playerTwo = Player(player2, "O")

    let currPlayer;

    const playGame = () => {
        currPlayer = undefined;
        boardInst.clearBoard();
        playTurn();
    }

    const playTurn = () => {
        currPlayer = !currPlayer || currPlayer === playerTwo ? playerOne : playerTwo;

        boardInst.printBoard();

        screen.setPlayerTurn(currPlayer.getName())
    }

    const checkWin = () => {
        const board = boardInst.getBoard();
        const sym = currPlayer.getSymbol();

        const horizontalWin = board.some(row => row.every(cell => cell === sym));
        const firstVerticalWin = board[0][0] === sym && board[1][0] === sym && board[2][0] === sym;
        const secondVerticalWin = board[0][1] === sym && board[1][1] === sym && board[2][1] === sym;
        const thirdVerticalWin = board[0][2] === sym && board[1][2] === sym && board[2][2] === sym;
        const firstDiagonalWin = board[0][0] === sym && board[1][1] === sym && board[2][2] === sym;
        const secondDiagonalWin = board[0][2] === sym && board[1][1] === sym && board[2][0] === sym;

        if (horizontalWin || firstVerticalWin || secondVerticalWin || thirdVerticalWin || firstDiagonalWin || secondDiagonalWin) {
            boardInst.printBoard();
            screen.setGameResult("win", currPlayer.getName());
            return true;
        } else if (board.every(row => row.every(cell => cell !== ""))) {
            boardInst.printBoard();
            screen.setGameResult();
            return "Tie";
        }

        return false;
    }

    const getCurrPlayer = () => currPlayer;

    return {
        playTurn,
        checkWin,
        playGame,
        getCurrPlayer
    }
}

const Gameboard = function() {
    let board = [["", "", ""], ["", "", ""], ["", "", ""]];
    let selectedCell;

    const printBoard = () => {
        screen.clear();
        screen.render();
    }

    const getBoard = () => board;

    const drawSymbol = (symbol, row, column) => {
        let rowNode = screen.getRow(row);
        let cell = screen.getColumn(rowNode, column);

        if (cell.textContent === "") {
            board[Number(row) - 1][Number(column) - 1] = symbol;
            cell.textContent = symbol;
            selectedCell = cell;
        } else {
            return;
        }
    }

    const askForAxis = (axis) => {
        const input = prompt(`Which ${axis}? (1-3)`);

        if (input === "exit") throw new Error("Exited game");

        let position = Number(input);
        
        while (position < 1 || position > 3) {
            alert(`${axis} is outside the board's bounds!`);
            position = Number(prompt(`Which ${axis}? (1-3)`));
        }

        return position;
    }

    const clearBoard = () => {
        board = [["", "", ""], ["", "", ""], ["", "", ""]];
        screen.clear();
        screen.render();
    }

    const getSelectedCell = () => selectedCell;

    return {
        printBoard,
        getBoard,
        drawSymbol,
        askForAxis,
        clearBoard,
        getSelectedCell
    };
};

const Player = function(name, sym) {
    let playerName = name;
    let symbol = sym;

    const getName = () => playerName;

    const getSymbol = () => symbol;

    return {
        getName,
        getSymbol
    };
}

const ScreenController = function() {
    const containerDiv = document.querySelector(".container");
    const boardDiv = document.querySelector("#board");
    const turnH2 = document.querySelector("#turn");
    const resultH2 = document.querySelector("#result");
    const playAgainBtn = document.querySelector("#playAgain-btn");
    const startForm = document.querySelector("#start-form");
    const restartBtn = document.querySelector("#restart-btn");
    const changeNamesBtn = document.querySelector("#changeNames-btn");

    const render = () => {
        boardInst.getBoard().forEach((row, i) => {
            const rowDiv = document.createElement("div");
            rowDiv.className = "row";
            rowDiv.dataset.row = i + 1;

            row.forEach((cell, i) => {
                const cellDiv = document.createElement("div");
                const cellBtn = document.createElement("button");
                cellBtn.textContent = cell;
                cellBtn.dataset.column = i + 1;
                
                if (rowDiv.dataset.row === "1" && cellBtn.dataset.column === "1") {
                    cellBtn.id = "top-left";
                } else if (rowDiv.dataset.row === "1" && cellBtn.dataset.column === "3") {
                    cellBtn.id = "top-right";
                } else if (rowDiv.dataset.row === "3" && cellBtn.dataset.column === "1") {
                    cellBtn.id = "bottom-left";
                } else if (rowDiv.dataset.row === "3" && cellBtn.dataset.column === "3") {
                    cellBtn.id = "bottom-right";
                }

                cellBtn.addEventListener("click", () => {
                    if (boardInst.getSelectedCell() !== undefined && cellBtn.dataset.column === boardInst.getSelectedCell().dataset.column && rowDiv.dataset.row === boardInst.getSelectedCell().parentNode.parentNode.dataset.row || cellBtn.textContent !== "") {
                        return;
                    }
                    
                    const cellRow = rowDiv.dataset.row;
                    const cellColumn = i + 1;

                    boardInst.drawSymbol(game.getCurrPlayer().getSymbol(), cellRow, cellColumn);

                    if (!game.checkWin()) {
                        game.playTurn();
                    } else {
                        screen.showPlayAgainButton();
                        screen.removeRestartBtn();
                    }
                })
                cellDiv.appendChild(cellBtn);
                rowDiv.appendChild(cellDiv);
            })

            boardDiv.appendChild(rowDiv);
        })
    }

    const clear = () => {
        boardDiv.innerHTML = "";
    }

    const getRow = row => document.querySelector(`[data-row='${row}']`);

    const getColumn = (rowNode, column) => rowNode.querySelector(`[data-column='${column}']`);

    const setPlayerTurn = player => {
        turnH2.textContent = `${player}'s turn...`;
    }

    const setGameResult = (result = "", player = undefined) => {
        resultLayout();
        turnH2.textContent = "";

        switch (result) {
            case "win":
                resultH2.textContent = `${player} wins!`;
                break;
            default:
                resultH2.textContent = "It's a tie!";
        }

        document.querySelectorAll("#board button").forEach(button => button.disabled = true);
    }

    const showPlayAgainButton = () => {
        playAgainBtn.style.display = "block";
    }

    const removePlayAgainButton = () => {
        playAgainBtn.style.display = "none";
    }

    const showRestartBtn = () => {
        restartBtn.style.display = "block";
    }

    const removeRestartBtn = () => {
        restartBtn.style.display = "none";
    }

    const showChangeNamesBtn = () => {
        changeNamesBtn.style.display = "block";
    }

    const removeChangeNamesBtn = () => {
        changeNamesBtn.style.display = "none";
    }

    playAgainBtn.addEventListener("click", () => {
        resultH2.textContent = "";
        game.playGame();
        removePlayAgainButton();
        showRestartBtn();
        gameLayout();
    });

    restartBtn.addEventListener("click", () => {
        resultH2.textContent = "";
        game.playGame();
    });

    startForm.addEventListener("submit", e => {
        e.preventDefault();

        const player1 = document.querySelector("#player1").value;
        const player2 = document.querySelector("#player2").value;

        game = GameController(player1 || "Player 1", player2 || "Player 2");
        game.playGame();

        boardDiv.style.display = "grid";

        startForm.style.display = "none";

        showRestartBtn();

        showChangeNamesBtn();

        gameLayout();
    })

    changeNamesBtn.addEventListener("click", () => {
        boardDiv.style.display = "none";
        startForm.style.display = "grid";
        resultH2.textContent = "";
        turnH2.textContent = "";
        removeChangeNamesBtn();
        if (document.querySelector("#restart-btn")) removeRestartBtn();
        if (document.querySelector("#playAgain-btn")) removePlayAgainButton();

        startLayout();
    })

    const startLayout = () => {
        containerDiv.style.gridTemplateAreas = "'. header header .' 'form form form form'";
    }

    const gameLayout = () => {
        containerDiv.style.gridTemplateAreas = "'. header header .' '. turn turn .' '. result result .' '. playAgain playAgain .' '. board board .' 'restart restart changeNames changeNames'";
    }

    const resultLayout = () => {
        containerDiv.style.gridTemplateAreas = "'. header header .' '. turn turn .' '. result result .' '. playAgain playAgain .' '. board board .' '. changeNames changeNames .'";
    }

    return {
        render,
        clear,
        getRow,
        getColumn,
        setPlayerTurn,
        setGameResult,
        showPlayAgainButton,
        removeRestartBtn,
        startLayout
    }
}

const boardInst = Gameboard();

const screen = ScreenController();
screen.startLayout();

let game;
