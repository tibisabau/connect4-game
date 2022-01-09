const express = require("express");
const http = require("http");
const websocket = require("ws");

const indexRouter = require("./routes/index");
const messages = require("./public/javascripts/messages");

const gameStatus = require("./statTracker");
const Game = require("./game");

if(process.argv.length < 3) {
    console.log("Error: expected a port as argument (eg. 'node app.js 3000').");
    process.exit(1);
}

const port = process.argv[2];
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);

app.get("/play", indexRouter);
app.get("/", indexRouter);

const wss = new websocket.Server({ server });
const websockets = {};

setInterval(function() {
    for (let i in websockets) {
        if (Object.prototype.hasOwnProperty.call(websockets,i)) {
            let gameObj = websockets[i];
            //if the gameObj has a final status, the game is complete/aborted
            if (gameObj.finalStatus != null) {
                delete websockets[i];
            }
        }
    }
}, 50000);

let currentGame = new Game(gameStatus.gamesInitialized++);
let connectionID = 0;

wss.on("connection", function connection(ws) {
    const con = ws;
    con["id"] = connectionID++;
    const playerType = currentGame.addPlayer(con);
    websockets[con["id"]] = currentGame;

    console.log(
        `Player ${con["id"]} placed in game ${currentGame.id} as ${playerType}`
    );

    con.send(playerType == "A" ? messages.S_PLAYER_A : messages.S_PLAYER_B);
    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(gameStatus.gamesInitialized++);
    }

})
server.listen(port);