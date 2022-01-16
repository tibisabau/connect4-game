const websocket = require("ws");
const game = function(gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.turn = null;
    this.gameState = "0 JOINT";
};

game.prototype.transitionStates = {
    "0 JOINT": 0,
    "1 JOINT": 1,
    "2 JOINT": 2,
    "TURN": 3,
    "A": 4, //A won
    "B": 5, //B won
    "ABORTED": 6,
    "TIED" : 7
};

game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 1],
    [0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0]
];

game.prototype.isValidTransition = function(from, to) {
    let i, j;
    if (!(from in game.prototype.transitionStates)) {
        return false;
    } else {
        i = game.prototype.transitionStates[from];
    }

    if (!(to in game.prototype.transitionStates)) {
        return false;
    } else {
        j = game.prototype.transitionStates[to];
    }

    return game.prototype.transitionMatrix[i][j] > 0;
};

game.prototype.isValidState = function(s) {
    return s in game.prototype.transitionStates;
};

game.prototype.setStatus = function(w) {
    if (
        game.prototype.isValidState(w) &&
        game.prototype.isValidTransition(this.gameState, w)
    ) {
        this.gameState = w;
        console.log("[STATUS] %s", this.gameState);
    } else {
        return new Error(
            `Impossible status change from ${this.gameState} to ${w}`
        );
    }
};

game.prototype.setPlayerTurn = function(w) {
    if (this.gameState != "1 JOINT" && this.gameState != "2 JOINT") {
        return new Error(
            `Trying to set player turn, but game status is ${this.gameState}`
        );
    }
    this.turn = w;
};

game.prototype.getTurn = function() {
    return this.turn;
};

game.prototype.hasTwoConnectedPlayers = function() {
    return this.gameState == "2 JOINT";
};

game.prototype.addPlayer = function(p) {
    if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
        return new Error(
            `Invalid call to addPlayer, current state is ${this.gameState}`
        );
    }
    const error = this.setStatus("1 JOINT");
    if (error instanceof Error) {
        this.setStatus("2 JOINT");
    }

    if (this.playerA == null) {
        this.playerA = p;
        return "A";
    } else {
        this.playerB = p;
        return "B";
    }
};

module.exports = game;