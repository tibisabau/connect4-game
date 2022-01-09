//ts-check
function GameState(sb) {
    this.playerType = null;
    this.MAX_CONNECTED= Setup.MAX_CONNECTED;
    //this.socket = socket;
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
    this.gameGrid =  Array(6).fill(Array(7).fill(5));
};

GameState.prototype.initializeStack = function () {
    this.stack = Array(7).fill(0);
}

GameState.prototype.updateGame = function(clickedSquare) {
    if(this.stack[parseInt(clickedSquare[4])] > 0) {
        if(this.getPlayerType() == "A")
            this.gameGrid[this.stack[parseInt(clickedSquare[4])]][parseInt(clickedSquare[5])] = 1;

        else
            this.gameGrid[this.stack[parseInt(clickedSquare[4])]][parseInt(clickedSquare[5])] = 2;

        this.stack[parseInt(clickedSquare[4])] --;
    }

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
    const gs = new GameState(sb);
    const grid = new Grid(gs);
    grid.initialize();
    gs.initializeStack();
    gs.initializeGrid();
})();