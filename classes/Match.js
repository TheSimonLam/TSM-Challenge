import champions from "../static/champions";
import summonerSpells from "../static/summonerSpells";
import items from "../static/items";
import masteries from "../static/masteries";

export class Match{

    constructor(timestamp, champCode, matchId){
        this.matchId = matchId;
        this.date = this.generateFormattedDate(timestamp);
        this.champ = this.translateChampCode(champCode);
        this.summonerName = null;
        this.participantId = null;
        this.patch = null;
        this.matchupChamp = null;
        this.teamCompEnemy = null;
        this.teamCompAlly = null;
        this.completedItemsPath = null;
        this.fullBuild = null;
        this.historyLink = null;
        this.summonerSpells = null;
        this.masteries = null;
        this.skillOrder = null;
        this.win = null;
        this.lane = null;
        this.blueSide = null;
        this.summonerSpell1 = null;
        this.summonerSpell2 = null;
        this.skillOrderMax;
    }

    setSummonerName(name){this.summonerName = name;}
    setPatch(patchNum){this.patch = patchNum.substr(0,4);}
    setMatchupChamp(champCode){this.matchupChamp = this.translateChampCode(champCode)}
    setParticipantIdAndBlueSide(id){
        this.participantId = id;
        id <= 5 ? this.blueSide = true : this.blueSide = false;
    }
    setFullBuild(itemArray){this.fullBuild = this.generateItems(itemArray);}
    setMatchHistroyLink(matchHistoryUri){this.historyLink = matchHistoryUri;}
    setSummonerSpells(summonerSpellsArray){
        this.summonerSpell1 = this.translateSummonerSpell(summonerSpellsArray[0]);
        this.summonerSpell2 = this.translateSummonerSpell(summonerSpellsArray[1]);
    }
    setRunes(masteriesArray){this.masteries = this.generateMasteryCodes(masteriesArray);}
    setWin(win){this.win = win;}
    setCompletedItemsPath(itemsArray){this.completedItemsPath = this.generateItems(itemsArray);}
    setSkillOrder(skillOrderArray){this.skillOrder = skillOrderArray;}
    setLane(lane){this.lane = lane;}
    setTeamComps(comps){
        if(this.blueSide){
            this.teamCompAlly = this.generateTeamComps(comps.slice(0, 5));
            this.teamCompEnemy = this.generateTeamComps(comps.slice(5, 10));
        }
        else{
            this.teamCompEnemy = this.generateTeamComps(comps.slice(0, 5));
            this.teamCompAlly = this.generateTeamComps(comps.slice(5, 10));
        }
    }

    generateMasteryCodes(masteriesArray){
        let translatedMasteriesArray = [];
        for (let masteryCode of masteriesArray) {
            translatedMasteriesArray.push(this.translateMasteryCode(masteryCode));
        }
        return translatedMasteriesArray;
    }

    generateItems(inventoryArray){
        let itemsArray = [];
        for (let itemCode of inventoryArray) {
            itemsArray.push(this.translateItemCode(itemCode));
        }
        return itemsArray;
    }

    generateTeamComps(champCodeArray){
        let champArray = [];
        for (let champCode of champCodeArray) {
            champArray.push(this.translateChampCode(champCode));
        }
        return champArray;
    }

    generateFormattedDate(timestamp){
        let monthNames = [
                "Jan", "Feb", "Mar",
                "Apr", "May", "Jun", "Jul",
                "Aug", "Sep", "Oct",
                "Nov", "Dec"
            ],
            date = new Date(timestamp),
            day = date.getDate(),
            monthIndex = date.getMonth();

        return day + ' ' + monthNames[monthIndex];
    }

    translateSkillOrderCode(skillOrderCode){
        switch (skillOrderCode) {
            case 1:
                return "Q";
            case 2:
                return "W";
            case 3:
                return "E";
            case 4:
                return "R";
        }
    }

    translateSummonerSpell(spellCode){
        for (let key in summonerSpells) {
            if (!summonerSpells.hasOwnProperty(key)) continue;
            var summonerSpell = summonerSpells[key];

            if(summonerSpell.id === spellCode){
                return summonerSpell.name;
            }

        }
    }

    translateMasteryCode(masteryCode){
        for (let mastery of masteries) {
            if(mastery.id === masteryCode){
                return mastery.name;
            }
        }
    }

    translateChampCode(champCode){
        for (let key in champions) {
            if (!champions.hasOwnProperty(key)) continue;
            var champ = champions[key];

            if(champ.id === champCode){
                return champ.name;
            }

        }
    }

    translateItemCode(itemCode){
        for (let key in items) {
            if (!items.hasOwnProperty(key)) continue;
            var item = items[key];

            if(item.id === itemCode){
                return item.name;
            }

        }
    }

    getJson(){
        return {
            "date": this.date,
            "champ": this.champ
        }
    }
}
