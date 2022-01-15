//ts-check

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
app.get("/play", indexRouter);
app.get("/", indexRouter);
const server = http.createServer(app);
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
    //con.send(messages.S_PLAYER_TURN_A);

    if (currentGame.hasTwoConnectedPlayers()) {
        currentGame = new Game(gameStatus.gamesInitialized++);
    }
    con.on("message", function incoming(message) {
        const oMsg = JSON.parse(message.toString());

        const gameObj = websockets[con["id"]];
        const isPlayerA = gameObj.playerA == con ? true : false;
        if (isPlayerA) {
            if (oMsg.type == messages.T_MAKE_A_GUESS) {
                gameObj.playerB.send(message.toString());
                gameObj.setStatus("TURN");
            }
        }

        else {
            if(oMsg.type == messages.T_PLAYER_2) {
                gameObj.playerA.send(message.toString());
            }
            if (oMsg.type == messages.T_MAKE_A_GUESS) {
                gameObj.playerA.send(message.toString());
                gameObj.setStatus("TURN");
            }

        }

        if (oMsg.type == messages.T_GAME_WON_BY) {
            gameObj.setStatus(oMsg.data);
            //game was won by somebody, update statistics
            gameStatus.gamesCompleted++;
        }
        if (oMsg.type == messages.O_GAME_TIED) {
            gameObj.setStatus("TIED");
            //game was tied by somebody, update statistics
            gameStatus.gamesCompleted++;
        }
    });

    con.on("close", function(code) {
        /*
         * code 1001 means almost always closing initiated by the client;
         * source: https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
         */
        console.log(`${con["id"]} disconnected ...`);
    
        if (code == 1001) {
          /*
           * if possible, abort the game; if not, the game is already completed
           */
          const gameObj = websockets[con["id"]];
    
          if (gameObj.isValidTransition(gameObj.gameState, "ABORTED")) {
            gameObj.setStatus("ABORTED");
              gameStatus.gamesAborted++;
            /*
             * determine whose connection remains open;
             * close it
             */
            try {
              gameObj.playerA.close();
              gameObj.playerA = null;
            } catch (e) {
              console.log("Player A closing: " + e);
            }
    
            try {
              gameObj.playerB.close();
              gameObj.playerB = null;
            } catch (e) {
              console.log("Player B closing: " + e);
            }
          }
        }
      });
})
server.listen(port);