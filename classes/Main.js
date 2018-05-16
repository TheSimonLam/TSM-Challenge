import {Match} from './Match';
import fetch from 'node-fetch';

let options = {
    method: 'GET',
    headers: {
        "X-Riot-Token": "RGAPI-45672fb8-27d6-43f0-82b6-a5d108ff8ea0"
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
                        match.setSummonerName(participant.player.summonerName);
                        match.setMatchHistroyLink(participant.player.matchHistoryUri);
                        match.setParticipantIdAndBlueSide(participant.participantId);
                        match.setLane(this.generateLane(data.participants, match.participantId));
                        match.setTeamComps(this.generateTeamComps(data.participants));
                        match.setMatchupChamp(this.generateMatchup(data.participants, match.participantId,  match.lane, match.teamCompAlly));
                        match.setFullBuild(this.generateFullBuild(data.participants, match.participantId));
                        match.setSummonerSpells(this.generateSummonerSpells(data.participants, match.participantId));
                        match.setRunes(this.generateRunes(data.participants, match.participantId));
                        match.setWin(this.generateWin(data.participants, match.participantId));

                        this.getTimelineMatch(match);
                    }
                }
            }.bind(this));
    }

    getTimelineMatch(match){
        fetch('https://' + this.region + '.api.riotgames.com/lol/match/v3/timelines/by-match/' + match.matchId, options)
            .then(res => res.json())
            .then(function(data){
                match.setCompletedItemsPath(this.generateCompletedItems(data.frames, match.participantId));
                match.setSkillOrder(this.generateSkillOrder(data.frames, match.participantId));

                this.save(match);
            }.bind(this));
    }

    generateCompletedItems(frames, participantId){
        let itemsPurchased = [];
        for (let frame of frames) {
            for (let event of frame.events) {
                if(event.participantId === participantId && event.type === "ITEM_PURCHASED"){
                    itemsPurchased.push(event.itemId);
                }
            }
        }
        return itemsPurchased;
    }

    generateSkillOrder(frames, participantId){
        let skills = [];
        for (let frame of frames) {
            for (let event of frame.events) {
                if(event.participantId === participantId && event.type === "SKILL_LEVEL_UP"){
                    skills.push(event.skillSlot);
                }
            }
        }
        return skills;
    }

    generateLane(participants, participantId){
        for (let participant of participants) {
            if(participant.participantId === participantId){
                return participant.timeline.lane;
            }
        }
    }

    generateMatchup(participants, participantId, lane, teamCompAlly){
        for (let participant of participants) {
            for(let i=0;i<teamCompAlly.length; i++) {
                if(participant.championId !== teamCompAlly[i]){
                    if((participant.participantId !== participantId) && (participant.timeline.lane === lane)){
                        return participant.championId;
                    }
                }
            }
        }
    }

    generateFullBuild(participants, participantId){
        let itemArray = [];
        for (let participant of participants) {
            if(participant.participantId === participantId){
                itemArray.push(participant.stats.item0);
                itemArray.push(participant.stats.item1);
                itemArray.push(participant.stats.item2);
                itemArray.push(participant.stats.item3);
                itemArray.push(participant.stats.item4);
                itemArray.push(participant.stats.item5);
            }
        }
        return itemArray;
    }

    generateTeamComps(participants){
        let teamComps = [];
        for (let participant of participants) {
            teamComps.push(participant.championId);
        }
        return teamComps;
    }

    generateSummonerSpells(participants, participantId){
        let summonerSpells = [];
        for (let participant of participants) {
            if(participant.participantId === participantId){
                summonerSpells.push(participant.spell1Id);
                summonerSpells.push(participant.spell2Id);
            }
        }
        return summonerSpells;
    }

    generateRunes(participants, participantId){
        let runes = [];
        for (let participant of participants) {
            if(participant.participantId === participantId){
                runes.push(participant.stats.perk0);
                runes.push(participant.stats.perk1);
                runes.push(participant.stats.perk2);
                runes.push(participant.stats.perk3);
                runes.push(participant.stats.perk4);
                runes.push(participant.stats.perk5);
            }
        }
        return runes;
    }

    generateWin(participants, participantId){
        for (let participant of participants) {
            if(participant.participantId === participantId){
                return participant.stats.win;
            }
        }
    }

    save(match){
        console.log(match);
        // console.log(match.getJson());
    }
}

