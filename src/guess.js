module.exports = class Guess {
    constructor(word, hoster) {
        if (word == false) {
            this.started = false;
            this.wordToGuess = "";
        } else if (typeof word == "string") {
            this.started = true;
            this.wordToGuess = word;
        }
        this.hoster = hoster;
        this.startDate = new Date();
        this.stopDate = null;
        this.isWordGuessed = false;
        this.wordsGuessed = [];
        this.players = [];
        this.winnerPlayer = null;
    }

    stop(guessed = false){
        this.started = false;
        this.isWordGuessed = guessed;
        this.stopDate = new Date();
        return true;
    }

    check(word, player){
        if (!this.players.includes(player)){
            this.players.push(player);
        }
        if (word.toLowerCase() == this.wordToGuess.toLowerCase()) {
            this.isWordGuessed = true;
            this.winnerPlayer = player;
            this.stopDate = new Date();
            return true;
        } else{
            this.wordsGuessed.push(word);
            return false;
        }
    }
};