function GameState(socket, sb) {
    this.playerType = null;
    this.MAX_CONNECTED= Setup.MAX_CONNECTED;
    this.socket = socket;
    this.gameGrid = null;
    this.statusBar = sb;
    this.stack = null;
    this.numberOfDiscs = 0;
}

GameState.prototype.getPlayerType = function () {
    return this.playerType;
};

GameState.prototype.setPlayerType = function (p) {
    this.playerType = p;
};

GameState.prototype.initializeGrid = function () {
    this.gameGrid =  [[0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0],
                      [0, 0, 0, 0, 0, 0, 0]];
};

GameState.prototype.initializeStack = function () {
    this.stack = Array(7).fill(5);
}
GameState.prototype.FourInARow = function(lastCell, player) {

}
GameState.prototype.checkIfOver = function(lastCell) {
    //the grid is full, so the game is a tie
    if(this.numberOfDiscs == 42) {
        return "TIE";
    }
    //check if player A won
    if(this.getPlayerType() == "A") {
        if(FourInARow(lastCell,1)) {
            return 'A';
        }
    }
    //check if player B won
    else {
        if(FourInARow(lastCell,2)) {
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
        this.stack[parseInt(clickedSquare[5])] --;
    }
    const winner = this.checkIfOver(clickedSquare);
    if(winner != null) {
        const elements = document.querySelectorAll(".cell");
        Array.from(elements).forEach(function (el) {
          // @ts-ignore
          el.style.pointerEvents = "none";
        });

        let alertString;
        if(winner == 'TIE') {
            alertString = Status["gameTied"];
        } else {
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
            el.addEventListener('mouseover', function (e){
                const hoveredSquare = e.target.id;
                const column = hoveredSquare[5];
                const nextAvailable = gs.stack[parseInt(column)];
                console.table(gs.stack);
                if(gs.getPlayerType() == "A")
                    var colorClass = "takenRed";
                else
                    colorClass = "takenYellow";
                document.getElementById("cell" + nextAvailable.toString() + column).className = colorClass;
            })
            el.addEventListener('mouseleave', function (e){
                const hoveredSquare = e.target.id;
                const column = hoveredSquare[5];
                const nextAvailable = gs.stack[parseInt(column)];
                document.getElementById("cell" + nextAvailable.toString() + column).className = "cell";
            })
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
    grid.initialize();
    gs.initializeStack();
    gs.setPlayerType("A");
    gs.initializeGrid();
})();