function GameState(socket, sb) {
    this.playerType = null;
    this.playerTurn = null;
    this.socket = socket;
    this.gameGrid = [[0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0]];
    this.statusBar = sb;
    this.stack = null;
    this.numberOfDiscs = 0;
}

GameState.prototype.getPlayerType = function () {
    return this.playerType;
};

GameState.prototype.getPlayerTurn = function () {
    return this.playerTurn;
};

GameState.prototype.setPlayerTurn = function (p) {
    this.playerTurn = p;
};

GameState.prototype.setPlayerType = function (p) {
    this.playerType = p;
};

GameState.prototype.initializeStack = function () {
    this.stack = Array(7).fill(5);
}
GameState.prototype.fourInARow = function(player) {
    return horizontalCheck(player, this.gameGrid) || verticalCheck(player, this.gameGrid)|| diagonalCheck(player, this.gameGrid) || secondDiagonalCheck(player, this.gameGrid);
}
function horizontalCheck(player, grid){
    for (let row = 0; row < grid.length; row++){
        for (let col =0; col < 4; col++){
            if(grid[row][col] == player && grid[row][col+1] == player && grid[row][col+2] == player && grid[row][col+3] == player)
               return true;
        }
    }
    return false;
}

function verticalCheck(player, grid){
    for (let col = 0; col < 7; col++){
        for (let row = 0; row < 3; row++){
            if(grid[row][col] == player && grid[row+1][col] == player && grid[row+2][col] == player && grid[row+3][col] == player)
               return true;
         }
    }   
    return false;
}

function diagonalCheck(player, grid){
    for(let col = 0; col < 4; col++){
        for (let row = 0; row < 3; row++){
            if(grid[row][col] == player && grid[row+1][col+1] == player && grid[row+2][col+2] == player && grid[row+3][col+3] == player)
                    return true;
                
            }
        }
        return false;
}

function secondDiagonalCheck(player, grid){
    for(let col = 0; col < 4; col++){
        for (let row = 5; row > 2; row--){
            if(grid[row][col] == player && grid[row-1][col+1] == player && grid[row-2][col+2] == player && grid[row-3][col+3] == player)
                    return true;
            
        }
    }
    return false;
}

GameState.prototype.checkIfOver = function() {
    //the grid is full, so the game is a tie
    if(this.numberOfDiscs == 42) {
        return "TIE";
    }
    //check if player A won
    if(this.getPlayerType() == "A") {
        if(this.fourInARow(1)) {
            return 'A';
        }
    }
    //check if player B won
    else {
        if(this.fourInARow(2)) {
            return 'B';
        }
    }
    //game is not over
    return null;
};

GameState.prototype.updateGame = function(clickedSquare) {
    if(this.stack[parseInt(clickedSquare[5])] >= 0) {
        if(this.getPlayerType() == "A") {
            this.gameGrid[this.stack[parseInt(clickedSquare[5])]][parseInt(clickedSquare[5])] = 1;
             document.getElementById("cell" +this.stack[parseInt(clickedSquare[5])].toString() + clickedSquare[5]) .className = "red";
        }

        else {
            this.gameGrid[this.stack[parseInt(clickedSquare[5])]][parseInt(clickedSquare[5])] = 2;
             document.getElementById("cell" +this.stack[parseInt(clickedSquare[5])].toString() + clickedSquare[5]) .className = "yellow";
            }
        const outgoingMsg = Messages.O_MAKE_A_GUESS;
        outgoingMsg.data = "cell" +this.stack[parseInt(clickedSquare[5])].toString() + clickedSquare[5];
        console.log(outgoingMsg.data);
        this.stack[parseInt(clickedSquare[5])] --;
        this.numberOfDiscs++;
        this.socket.send(JSON.stringify(outgoingMsg));
    }



    const winner = this.checkIfOver();
    if(winner != null) {
        const elements = document.querySelectorAll(".cell");
        Array.from(elements).forEach(function (el) {
          el.style.pointerEvents = "none";
        });

        let alertString;
        if(winner == "TIE") {
            alertString = Status["gameTied"];
        }
        else {
            if (winner == this.playerType) {
                alertString = Status["gameWon"];
            } else {
                alertString = Status["gameLost"];
            }
            alertString += Status["playAgain"];
            this.statusBar.setStatus(alertString);

            let finalMsg = Messages.O_GAME_WON_BY;
            finalMsg.data = winner;
            this.socket.send(JSON.stringify(finalMsg));
        }
        this.socket.close();
    }
    console.table(this.gameGrid);
}

function Grid(gs) {
    this.initialize = function () {
        const squares = document.querySelectorAll(".grid div");
        Array.from(squares).forEach(function(el) {
            el.addEventListener("click", function singleClick(e) {
                const clickedSquare = e.target["id"];
                gs.updateGame(clickedSquare);
            })
            // el.addEventListener('mouseover', function (e){
            //     const hoveredSquare = e.target.id;
            //     const column = hoveredSquare[5];
            //     const nextAvailable = gs.stack[parseInt(column)];
            //     //console.table(gs.stack);
            //     if(gs.getPlayerType() == "A")
            //         var colorClass = "takenRed";
            //     else
            //         colorClass = "takenYellow";
            //     document.getElementById("cell" + nextAvailable.toString() + column).className = colorClass;
            // })
            // el.addEventListener('mouseleave', function (e){
            //     const hoveredSquare = e.target.id;
            //     const column = hoveredSquare[5];
            //     const nextAvailable = gs.stack[parseInt(column)];
            //     document.getElementById("cell" + nextAvailable.toString() + column).className = "cell";
            // })
        })
    }
}

function StatusBar() {
    this.setStatus = function (status) {
        document.getElementById("status").innerHTML = status;
    };
}

(function setup() {
    const socket = new WebSocket(Setup.WEB_SOCKET_URL);
    const sb = new StatusBar();
    const gs = new GameState(socket, sb);
    const grid = new Grid(gs);

    socket.onmessage = function (event) {
        let incomingMsg = JSON.parse(event.data);
        //set player type
        if (incomingMsg.type === Messages.T_PLAYER_TYPE) {
            gs.initializeStack();
            grid.initialize();
            gs.setPlayerType(incomingMsg.data);
            // if (gs.getPlayerTurn() == null)
            //     gs.setPlayerTurn("A");
        }
            // if (incomingMsg.type == Messages.T_PLAYER_TURN) {
            //     console.log(gs.getPlayerTurn());
            //     if(gs.getPlayerTurn() == "A") {
            //         sb.setStatus(Status["player1Intro"]);
            //     }
            //     else {
            //         sb.setStatus(Status["player2Intro"]);
            //     }
            // }
        if (incomingMsg.type == Messages.T_MAKE_A_GUESS) {
            if(gs.getPlayerType() == "A") {
                sb.setStatus(Status["picked"] + incomingMsg.data);
                gs.updateGame(incomingMsg.data);
                gs.setPlayerTurn("B");
            }

            else {
                sb.setStatus(Status["picked"] + incomingMsg.data);
                gs.updateGame(incomingMsg.data);
                gs.setPlayerTurn("A");
            }

        }

    }
        socket.onopen = function () {
            socket.send("{}");
        };

        //server sends a close event only if the game was aborted from some side
        socket.onclose = function () {
            if (gs.checkIfOver() == null) {
                sb.setStatus(Status["aborted"]);
            }
        };
    socket.onerror = function () {};
})();