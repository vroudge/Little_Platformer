function stateMachine() {
    //Connaître l'état du jeu
    var currentState = {
        "menu": false,
        "newGame": true,
        "restartLevel": false,
        "nextLevel": false,
        "pause": false,
        "inGame": false,
        "gameOver": false
    };
    var stateKeys = Object.keys(currentState);

    this.setState = function(whichState) {
        for (var i = stateKeys.length - 1; i >= 0; i--) {
            if(currentState[stateKeys[i]] === true) {
                currentState[stateKeys[i]] = false;
            }
        };
        currentState[whichState] = true;
    }

    this.getState = function() {
        for (var i = stateKeys.length - 1; i >= 0; i--) {
            if(currentState[stateKeys[i]] === true) {
                return stateKeys[i];
            }
        };
    }
}