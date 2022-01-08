//ts-check
const playerA = 1;
const playerB = 2;
const empty = 0;

function Table() {
    this.gameTable = undefined;
    this.initialise = function(){
        this.gameTable = [[0, 0, 0, 0, 0, 0, 0],
                          [0, 0, 0, 0, 0, 0, 0],
                          [0, 0, 0, 0, 0, 0, 0],
                          [0, 0, 0, 0, 0, 0, 0],
                          [0, 0, 0, 0, 0, 0, 0],
                          [0, 0, 0, 0, 0, 0, 0]];
    };
}