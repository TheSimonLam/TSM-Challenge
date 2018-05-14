import {Main} from "./classes/Main";
import playersData from "./playersData";
let playerCount = 0;

function loop(){
    if(playerCount < playersData.players.length){
        let playerName = playersData.players[playerCount].name;
        let playerRegion = playersData.players[playerCount].region;

        new Main(playerName, playerRegion);

        playerCount++;
    }
    else{
        clearInterval(myInterval);
    }
}

var myInterval = setInterval(loop, 1000);