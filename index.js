import {Main} from "./classes/Main";
import players from "./static/players";
let playerCount = 0;

function loop(){
    if(playerCount < players.length){
        let playerName = players[playerCount].name;
        let playerRegion = players[playerCount].region;

        new Main(playerName, playerRegion);

        playerCount++;
    }
    else{
        clearInterval(myInterval);
    }
}

var myInterval = setInterval(loop, 1000);