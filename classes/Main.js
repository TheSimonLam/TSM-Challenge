import {Match} from './Match';
import fetch from 'node-fetch';

let options = {
    method: 'GET',
    headers: {
        "X-Riot-Token": "RGAPI-b2405678-de6d-4f9d-8bd9-69e2ce1b050b"
    }
};

export class Main{

    constructor(name, region){
        this.name = name;
        this.region = region;
        this.accountId = '';
        this.matches = [];

        this.getAccountIds();
    }

    getAccountIds(){
        fetch('https://' + this.region + '.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + this.name, options)
            .then(res => res.json())
            .then(json => this.getMatchList(json));
    }

    getMatchList(data){
        this.accountId = data.accountId;
        fetch('https://' + this.region + '.api.riotgames.com/lol/match/v3/matchlists/by-account/'+ this.accountId + '?beginIndex=0&endIndex=5&queue=420', options)
            .then(res => res.json())
            .then(function(data){
                for (let match of data.matches) {
                    let currentMatch = new Match(match.timestamp, match.champion, match.gameId);
                    this.getMatch(currentMatch);
                }
            }.bind(this));
    }

    getMatch(match){
        fetch('https://' + this.region + '.api.riotgames.com/lol/match/v3/matches/' + match.matchId, options)
            .then(res => res.json())
            .then(function(data){
                match.setPatch(data.gameVersion);

                for (let participant of data.participantIdentities) {
                    if(participant.player.accountId === this.accountId){
                        match.setMatchHistroyLink(participant.player.matchHistoryUri);
                        // match.setMatchup(data.participants);
                        // match.setFullBuild();
                        // match.setTeamComp();
                        // match.setSummonerSpells();
                        // match.setRunes();
                        // match.setWinLoss();
                        console.log(match);
                        // this.getTimelineMatch(match);
                    }
                }
            }.bind(this));
    }

    // getMatch(match){
    //     fetch('https://' + this.region + '.api.riotgames.com/lol/match/v3/timelines/by-match/' + match.matchId, options)
    //         .then(res => res.json())
    //         .then(function(data){
    //             for (let frame of data.frames) {
    //                 for (let events of frame) {
    //                     if(events.participantId === match.participantId){
    //                         match.setCompletedItemsPath();
    //                         match.setSkillOrder();
    //
    //                         //TODO: CALL SAVE HERE!
    //                         this.save();
    //                     }
    //                 }
    //             }
    //         }.bind(this));
    //
    //
    // }

    save(){
        //TODO: save this.matches[] along with the player name to file!
    }
}

