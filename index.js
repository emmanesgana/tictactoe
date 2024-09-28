const startButton = document.querySelector("#start");
const restartButton = document.querySelector("#restart");

restartButton.addEventListener("click", () => {
    game.restart();
})

startButton.addEventListener("click", () => {
    game.start();
})

restartButton.disabled = true;

// create a module to display the game board use IIFE
const gameBoard = (() => {
    let arr = ["", "", "", "", "", "", "", "", ""];

    const render = () => {
        let board = "";

        restartButton.disabled = false;

        arr.forEach((square, index) => {
            board += `<div id="square-${index}" class="square">${square}</div>`
        });

        document.querySelector(".board").innerHTML = board;

        const squares = document.querySelectorAll(".square");

        squares.forEach((square) => {
            square.addEventListener("click", game.handleClick);
        });
    }

    const update = (index, value) => {
        arr[index] = value;
        render();
    };

    const getArr = () => arr;

    return {
        render,
        update,
        getArr
    };
})();

const messageController = (() => {
    const renderMessage = (message) => {
        document.querySelector("#result").innerHTML = message;
    }

    return {
        renderMessage
    }
})();


//create a factory for players
const createPlayer = (name, marker) => {
    return {
        name,
        marker
    };
}

// create a module that has the games logic inside
const game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameEnd;

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ]
        currentPlayerIndex = 0;
        gameEnd = false;
        gameBoard.render();
    };

    const handleClick = (e) => {
        if (gameEnd) return;

        let index = Number(e.target.id.split("").slice(-1).join(""));

        if (gameBoard.getArr()[index] !== "") return;

        gameBoard.update(index, players[currentPlayerIndex].marker);

        if (checkWinner(gameBoard.getArr(), players[currentPlayerIndex].marker)) {
            gameEnd = true;
            messageController.renderMessage(`<span class="player-name">${players[currentPlayerIndex].name}</span> has won!`);
        } else if (checkTie(gameBoard.getArr())) {
            gameEnd = true;
            messageController.renderMessage(`It's a tie!`)
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    };

    const restart = () => {

        for (let i = 0; i < 9; i++) {
            gameBoard.update(i, "");
        }

        gameBoard.render();
        gameEnd = false;
        messageController.renderMessage("");
    }

    return {
        start,
        handleClick,
        restart
    };
})();

function checkWinner(board) {
    const winningCombination = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < winningCombination.length; i++) {
        const [a, b, c] = winningCombination[i];

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }

    return false;
}

function checkTie(board) {
    return board.every(cell => cell !== "");
}