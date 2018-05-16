import champions from "../static/champions";
import summonerSpells from "../static/summonerSpells";
import items from "../static/items";
import masteries from "../static/masteries";

export class Match{

    constructor(timestamp, champCode, matchId, platform, region, accountId){
        this.platform = platform;
        this.region = region;
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
        this.masteries = null;
        this.skillOrder = null;
        this.win = null;
        this.lane = null;
        this.blueSide = null;
        this.summonerSpell1 = null;
        this.summonerSpell2 = null;
        this.skillOrderMax = null;
        this.accountId = accountId;
        this.matchHistoryLink = "http://matchhistory.leagueoflegends.co." + this.region + "/ko/#match-details/" + this.platform + "/" + this.matchId + "/" + this.accountId;
    }

    setSummonerName(name){this.summonerName = name;}
    setPatch(patchNum){this.patch = patchNum.substr(0,4);}
    setMatchupChamp(champCode){this.matchupChamp = this.translateChampCode(champCode)}
    setParticipantIdAndBlueSide(id){
        this.participantId = id;
        id <= 5 ? this.blueSide = true : this.blueSide = false;
    }
    setFullBuild(itemArray){this.fullBuild = this.generateItems(itemArray);}
    setSummonerSpells(summonerSpellsArray){
        this.summonerSpell1 = this.translateSummonerSpell(summonerSpellsArray[0]);
        this.summonerSpell2 = this.translateSummonerSpell(summonerSpellsArray[1]);
    }
    setRunes(masteriesArray){this.masteries = this.generateMasteryCodes(masteriesArray);}
    setWin(win){this.win = win;}
    setCompletedItemsPath(itemsArray){this.completedItemsPath = this.generateItems(itemsArray);}
    setSkillOrder(skillOrderArray){
        this.skillOrder = this.generateSkillOrder(skillOrderArray);
        this.skillOrderMax = this.generateSkillOrderMax(this.skillOrder);
    }
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

    generateSkillOrderMax(skillOrderArray){
        let maxArray = [],
            q = 0, w = 0, e = 0, r = 0,
            qMaxed = false, wMaxed = false, eMaxed = false, rMaxed = false;

        for (let skill of skillOrderArray) {
            switch (skill) {
                case "Q":
                    q++;
                    break;
                case "W":
                    w++;
                    break;
                case "E":
                    e++;
                    break;
                case "R":
                    r++;
                    break;
            }

            if(q === 4 && !qMaxed){
                maxArray.push("Q");
                qMaxed = true;
            }
            else if(w === 4 && !wMaxed){
                maxArray.push("W");
                wMaxed = true;
            }
            else if(e === 4 && !eMaxed){
                maxArray.push("E");
                eMaxed = true;
            }
            else if(r === 4 && !rMaxed){
                maxArray.push("R");
                rMaxed = true;
            }

        }
        return maxArray;
    }

    generateSkillOrder(skillOrderArray){
        let translatedSkillOrderArray = [];
        for (let skillOrderCode of skillOrderArray) {
            translatedSkillOrderArray.push(this.translateSkillOrderCode(skillOrderCode));
        }
        return translatedSkillOrderArray;
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
            "Player": this.summonerName,
            "Champ": this.champ,
            "Patch": this.patch,
            "Date": this.date,
            "VS": this.matchupChamp,
            "Enemy Team": this.teamCompEnemy.toString(),
            "Ally Team": this.teamCompAlly.toString(),
            "Item Slot 1": this.fullBuild[0] || " ",
            "Item Slot 2": this.fullBuild[1] || " ",
            "Item Slot 3": this.fullBuild[2] || " ",
            "Item Slot 4": this.fullBuild[3] || " ",
            "Item Slot 5": this.fullBuild[4] || " ",
            "Item Slot 6": this.fullBuild[5] || " ",
            "Build Order": this.completedItemsPath.toString(),
            "Mastery 1": this.masteries[0],
            "Mastery 2": this.masteries[1],
            "Mastery 3": this.masteries[2],
            "Mastery 4": this.masteries[3],
            "Mastery 5": this.masteries[4],
            "Mastery 6": this.masteries[5],
            "Max": this.skillOrderMax.toString(),
            "Skill Order": this.skillOrder.toString(),
            "Victory": this.win,
            "Blue Side": this.blueSide,
            "Summ Spell 1": this.summonerSpell1,
            "Summ Spell 2": this.summonerSpell2,
            "Match Link": this.matchHistoryLink
        }
    }
}
