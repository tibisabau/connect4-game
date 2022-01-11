function GameState(socket, sb) {
    this.playerType = null;
    this.MAX_CONNECTED= Setup.MAX_CONNECTED;
    this.socket = socket;
    this.gameGrid = null;
    this.statusBar = sb;
    this.stack = null;
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

GameState.prototype.updateGame = function(clickedSquare) {
    if(this.stack[parseInt(clickedSquare[5])] >= 0) {
        if(this.getPlayerType() == "A") {
            this.gameGrid[this.stack[parseInt(clickedSquare[5])]][parseInt(clickedSquare[5])] = 1;
            document.getElementById("cell" +this.stack[parseInt(clickedSquare[5])].toString() + clickedSquare[5]) .style.backgroundColor = "red";
        }

        else {
            this.gameGrid[this.stack[parseInt(clickedSquare[5])]][parseInt(clickedSquare[5])] = 2;
            document.getElementById("cell" +this.stack[parseInt(clickedSquare[5])].toString() + clickedSquare[5]) .style.backgroundColor = "yellow";        }

        this.stack[parseInt(clickedSquare[5])] --;
    }
    console.table(this.gameGrid);
}

function Grid(gs) {
    this.initialize = function () {
        const squares = document.querySelectorAll(".cell");
        Array.from(squares).forEach(function(el) {
            el.addEventListener("click", function singleClick(e) {
                const clickedSquare = e.target["id"];
                console.log(parseInt(clickedSquare[4]), parseInt(clickedSquare[5]))
                gs.updateGame(clickedSquare);
            })
            el.addEventListener('mouseover', function (e){
                const hoveredSquare = e.target.id;
                const column = hoveredSquare[5];
                const nextAvailable = gs.stack[parseInt(column)];
                console.log("cell" + nextAvailable.toString() +column);
                document.getElementById("cell" + nextAvailable.toString() + column).className = "taken";
            })
            el.addEventListener('mouseleave', function (e){
                const hoveredSquare = e.target.id;
                const column = hoveredSquare[5];
                const nextAvailable = gs.stack[parseInt(column)];
                console.log("cell" + nextAvailable.toString() +column);
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