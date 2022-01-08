//ts-check
function GameState(gameGrid, sb, socket) {
    this.playerType = null;
    this.MAX_CONNECTED= Setup.MAX_CONNECTED;
    this.socket = socket;
    this.gameGrid = gameGrid;
}

GameState.prototype.getPlayerType = function () {
    return this.playerType;
};

GameState.prototype.setPlayerType = function (p) {
    this.playerType = p;
};

function Grid(gs) {
    this.initialize = function () {
        const squares = document.querySelectorAll('grid div');
        Array.from(squares).forEach(function(el) {
            el.addEventListener("click", function singleClick(e) {
                const clickedSquare = e.target["id"]
            })
        })
    }
}
