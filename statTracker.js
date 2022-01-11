//ts-check

/**
 * In-game stat tracker. 
 * 
 */
 const gameStatus = {
    since: Date.now() /* since we keep it simple and in-memory, keep track of when this object was created */,
    gamesInitialized: 0 /* number of games initialized */,
    gamesInAction: 0 /* number of games that are played at the moment. */,
    gamesCompleted: 0 /* number of games successfully completed */
  };
  
  module.exports = gameStatus;