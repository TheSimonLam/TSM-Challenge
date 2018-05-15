export class Match{

    constructor(date, champ, matchId){
        this.matchId = matchId;
        this.date = date;
        this.champ = champ;
        this.participantId = null;
        this.patch = null;
        this.matchupChamp = null;
        this.teamCompEnemy = null;
        this.teamCompAlly = null;
        this.completedItemsPath = null;
        this.fullBuild = null;
        this.historyLink = null;
        this.summonerSpells = null;
        this.runes = null;
        this.skillOrder = null;
        this.win = null;
        this.lane = null;
        this.blueSide = null;
        this.summonerSpell1 = null;
        this.summonerSpell2 = null;
    }

    setPatch(patch){this.patch = patch;}
    setMatchupChamp(champ){this.matchupChamp = champ;}
    setParticipantIdAndBlueSide(id){
        this.participantId = id;
        id <= 5 ? this.blueSide = true : this.blueSide = false;
    }
    setFullBuild(itemArray){this.fullBuild = itemArray;}
    setMatchHistroyLink(matchHistoryUri){this.historyLink = matchHistoryUri;}
    setSummonerSpells(summonerSpellsArray){this.summonerSpell1 = summonerSpellsArray[0]; this.summonerSpell2 = summonerSpellsArray[1]; }
    setRunes(runes){this.runes = runes;}
    setWin(win){this.win = win;}
    setCompletedItemsPath(itemsArray){this.completedItemsPath = itemsArray;}
    setSkillOrder(skillOrderArray){this.skillOrder = skillOrderArray;}
    setLane(lane){this.lane = lane;}
    setTeamComps(comps){
        if(this.blueSide){
            this.teamCompAlly = comps.slice(0, 5);
            this.teamCompEnemy = comps.slice(5, 10);
        }
        else{
            this.teamCompEnemy = comps.slice(0, 5);
            this.teamCompAlly = comps.slice(5, 10);
        }
    }

    getJson(){
        return {
            "date": this.date,
            "champ": this.champ
        }
    }
}
