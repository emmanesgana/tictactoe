const startButton = document.querySelector("#start");
const restartButton = document.querySelector("#restart");

restartButton.addEventListener("click", () => {
    game.restart();
})

startButton.addEventListener("click", () => {
    if (document.querySelector("#player1").value === "" || document.querySelector("#player2").value === "") {
        alert("Enter player name!");
        return
    };

    game.start();
})

restartButton.disabled = true;

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

const createPlayer = (name, marker) => {
    return {
        name,
        marker,
        score: score = 1
    };
}

const game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameEnd;

    const score1 = document.querySelector(".player1-score");
    const score2 = document.querySelector(".player2-score");

    const start = () => {
        players = [
            createPlayer(document.querySelector("#player1").value, "X"),
            createPlayer(document.querySelector("#player2").value, "O")
        ]

        currentPlayerIndex = 0;

        players.forEach((player, index) => {
            if (index % 2 === 0) {
                console.log('true')
                score1.innerHTML = `<p class="player-name-score player-${index}" data-name="${player.name}">${player.name}: <span class="score1" data-name="${player.name}">0</span> <p>`
            } else {
                console.log('false')
                score2.innerHTML = `<p class="player-name-score player-${index}" data-name="${player.name}">${player.name}: <span class="score2" data-name="${player.name}">0</span> <p>`
            }
        })

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
            messageController.renderMessage(`<p><span class="player-name">${players[currentPlayerIndex].name}</span> has won!</p><p class="next">${players[currentPlayerIndex].name} start's next.</p>`);

            //add score for each player
            const increment = players[currentPlayerIndex].score++;
            document.querySelector(".player-name-score").getAttribute("data-name") === players[currentPlayerIndex].name ?
                document.querySelector(".score1").innerHTML = `<span>${increment}</span>` :
                document.querySelector(".score2").innerHTML = `<span>${increment}</span>`;
        } else if (checkTie(gameBoard.getArr())) {
            gameEnd = true;
            messageController.renderMessage(`It's a tie!`)
        } else {
            currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
        }

        console.log(players[currentPlayerIndex])
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