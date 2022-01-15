(function (exports) {
    exports.T_GAME_WON_BY = "GAME-WON-BY";
    exports.O_GAME_WON_BY = {
        type: exports.T_GAME_WON_BY,
        data: null,
    };
    
    exports.O_GAME_TIED = {
        type: "GAME-TIED",
    };
    exports.S_GAME_TIED = JSON.stringify(exports.O_GAME_TIED);

    exports.O_GAME_ABORTED = {
        type: "GAME-ABORTED",
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_A = {
        type: exports.T_PLAYER_TYPE,
        data: "A",
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);

    exports.O_PLAYER_B = {
        type: exports.T_PLAYER_TYPE,
        data: "B",
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);

    exports.T_PLAYER_2 = "PLAYER-2";
    exports.O_PLAYER_2 = {
        type: exports.T_PLAYER_2,
        data:"A",
    };

    exports.T_MAKE_A_GUESS = "MAKE-A-GUESS";
    exports.O_MAKE_A_GUESS = {
        type: exports.T_MAKE_A_GUESS,
        data: null,
    };

    exports.T_GAME_OVER = "GAME-OVER";
    exports.O_GAME_OVER = {
        type: exports.T_GAME_OVER,
        data: null,
    };
})(typeof exports === "undefined" ? (this.Messages = {}) : exports);