export class Match{

    constructor(date, champ, matchId){
        this.matchId = matchId;
        this.date = date;
        this.champ = champ;
        this.participantId;
        this.patch;
        this.matchUp;
        this.teamComp;
        this.completedItemsPath;
        this.fullBuild;
        this.historyLink;
        this.summonerSpells;
        this.runes;
        this.skillOrder;
        this.winLoss;
    }

    setPatch(patch){this.patch = patch;}
    setMatchup(){}
    setTeamComp(){}
    setFullBuild(){}
    setMatchHistroyLink(matchHistoryUri){this.historyLink = matchHistoryUri;}
    setSummonerSpells(){}
    setRunes(){}
    setWinLoss(){}
    setCompletedItemsPath(){}
    setSkillOrder(){}

    getJson(){
        return {
            "date": this.date,
            "champ": this.champ
        }
    }
}
