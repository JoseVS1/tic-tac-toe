const GameController = function() {

    const gameboard = Gameboard();
    const playerOne = Player("player 1", "X");
    const playerTwo = Player("player 2", "O");

    let currPlayer;

    const playGame = () => {
        currPlayer = undefined;
        gameboard.clearBoard();
        playTurn();
    }

    const playTurn = () => {
        currPlayer = !currPlayer || currPlayer === playerTwo ? playerOne : playerTwo;

        gameboard.printBoard();

        console.log(`${currPlayer.getName()}'s turn...`);

        const row = gameboard.askForAxis("row");
        const column = gameboard.askForAxis("column");

        if (!row || !column) return;

        gameboard.drawSymbol(currPlayer.getSymbol(), row, column);

        if (!checkWin()) {
            playTurn();
        } else {
            const playAgain = Boolean(prompt("Play again?"));
            if (playAgain) playGame();
        }
    }

    const checkWin = () => {
        const board = gameboard.getBoard();
        const sym = currPlayer.getSymbol();

        const horizontalWin = board.some(row => row.every(cell => cell === sym));
        const firstVerticalWin = board[0][0] === sym && board[1][0] === sym && board[2][0] === sym;
        const secondVerticalWin = board[0][1] === sym && board[1][1] === sym && board[2][1] === sym;
        const thirdVerticalWin = board[0][2] === sym && board[1][2] === sym && board[2][2] === sym;
        const firstDiagonalWin = board[0][0] === sym && board[1][1] === sym && board[2][2] === sym;
        const secondDiagonalWin = board[0][2] === sym && board[1][1] === sym && board[2][0] === sym;

        if (horizontalWin || firstVerticalWin || secondVerticalWin || thirdVerticalWin || firstDiagonalWin || secondDiagonalWin) {
            gameboard.printBoard();
            console.log(`${currPlayer.getName()} wins!`);
            return true;
        } else if (board.every(row => row.every(cell => cell !== ""))) {
            gameboard.printBoard();
            console.log("It's a tie!");
            return "Tie";
        }

        return false;
    }

    playGame();
}

const Gameboard = function() {
    let board = [["", "", ""], ["", "", ""], ["", "", ""]];

    const printBoard = () => {
        for (let row of board) {
            console.log(row);
        }
    }

    const getBoard = () => board;

    const drawSymbol = (symbol, row, column) => {
        let location = board[row - 1][column - 1];
        if (location === "") {
            board[row - 1][column - 1] = symbol;
        } else {
            let newRow;
            let newColumn;
            while (location !== "") {
                alert("That location already has a symbol! Choose a new one:");
                newRow = askForAxis("row");
                newColumn = askForAxis("column");
                location = board[newRow - 1][newColumn - 1];
            }

            drawSymbol(symbol, newRow, newColumn);
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
    }

    return {
        printBoard,
        getBoard,
        drawSymbol,
        askForAxis,
        clearBoard
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

GameController();