class Game {
    constructor() {
        this._deckId = 'new';
        this._active = true;
        this._dealerHiddenCard = '';
        this._dealerHandMax = 0;
        this._dealerHandMin = 0;
        this._playerHandMax = 0;
        this._playerHandMin = 0;
    }

    async newGame() {
        this._active = true;
        document.querySelector("#result").innerHTML = "";
        this._dealerHandMax = 0;
        this._dealerHandMin = 0;
        this._playerHandMax = 0;
        this._playerHandMin = 0;
        await this.shuffle();
        await this.deal();
    }

    async shuffle() {
        let fullUri = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6';
        return await fetch(fullUri)
        .then(res => res.json())
        .then(data => 
        {
            document.querySelector(`#player-hand`).innerHTML = '';
            document.querySelector(`#dealer-hand`).innerHTML = '';
            this._deckId = data.deck_id;
        })
        .catch(err => console.log(err))
    }

    async deal() {
        let fullUri = `https://deckofcardsapi.com/api/deck/${this._deckId}/draw/?count=4`;
        let data = await this.drawCard(fullUri);
        setTimeout(() => {
            this.printCard(data.cards[0].image, "player");
            this._playerHandMax += this.calculateHand(data.cards[0].value, 'max');
            this._playerHandMin += this.calculateHand(data.cards[0].value, 'min');
        }, 1000);

        setTimeout(() => {
            this.printCard("https://deckofcardsapi.com/static/img/back.png", "dealer");
            this._dealerHiddenCard = data.cards[1].code;
            this._dealerHandMax += this.calculateHand(data.cards[1].value, 'max');
            this._dealerHandMin += this.calculateHand(data.cards[1].value, 'min');
        }, 2000);


        setTimeout(() => {
            this.printCard(data.cards[2].image, "player");
            this._playerHandMax += this.calculateHand(data.cards[2].value, 'max');
            this._playerHandMin += this.calculateHand(data.cards[2].value, 'min');
        }, 3000);


        setTimeout(() => {
            this.printCard(data.cards[3].image, "dealer");
            this._dealerHandMax += this.calculateHand(data.cards[3].value, 'max');
            this._dealerHandMin += this.calculateHand(data.cards[3].value, 'min');
        }, 4000);

        if (this._playerHandMax == 21) {
            this.endgame("Blackjack!, Player wins, Game Over");
        }
    }

    async hit() {
        let fullUri = `https://deckofcardsapi.com/api/deck/${this._deckId}/draw/?count=1`;
        let data = await this.drawCard(fullUri);
        this.printCard(data.cards[0].image, "player");
        this._playerHandMax += this.calculateHand(data.cards[0].value, 'max');
        this._playerHandMin += this.calculateHand(data.cards[0].value, 'min');
        if (this._playerHandMax == 21) {
            this.endgame("Blackjack!, Player wins, Game Over");
        } else if (this._playerHandMax > 21) {
            if (this._playerHandMax - this._playerHandMin > 10) {
                this._playerHandMax -= 10;
            }
            if (this._playerHandMin > 21) {
                this.endgame("Player bust, Dealer wins, Game Over");
            } else {
                this._playerHandMax = this._playerHandMin;
            }
        }
    }

    async stand() {
        document.querySelector('#dealer-hand').firstChild.setAttribute('src', `https://deckofcardsapi.com/static/img/${this._dealerHiddenCard}.png`);
        do {
            if (this._dealerHandMax == 21) {
                this.endgame("Blackjack!, Dealer wins, Game Over");
            }else if (this._dealerHandMax < 17) {
                let fullUri = `https://deckofcardsapi.com/api/deck/${this._deckId}/draw/?count=1`;
                let data = await this.drawCard(fullUri);
                this.printCard(data.cards[0].image, "dealer");
                this._dealerHandMax += this.calculateHand(data.cards[0].value, 'max');
                this._dealerHandMin += this.calculateHand(data.cards[0].value, 'min');
            } else if (this._dealerHandMax > 21) {
                if (this._dealerHandMin > 21) {
                    this.endgame("Dealer bust, Player wins, Game Over");
                } else {
                    this._dealerHandMax = this._dealerHandMin;
                }
            } else {
                if (this._dealerHandMax < this._playerHandMax) {
                    this.endgame("Dealer stands, Player wins, Game Over");
                } else if (this._dealerHandMax > this._playerHandMax) {
                    this.endgame("Dealer stands, Dealer wins, Game Over");
                } else {
                    this.endgame("Dealer stands, No winner, Game Over");
                }
            }
        } while (this._active);
    }

    printCard(src, person) {
        let image = document.createElement("img");
        image.setAttribute("src", src);
        document.querySelector(`#${person}-hand`).appendChild(image);
    }

    calculateHand(value, maxMin) {
        let aboveTen = ["JACK","QUEEN","KING"];
        if (aboveTen.includes(value)) {
            return 10;
        }
        if (value === "ACE" && maxMin == 'max') {
            return 11;
        }else if (value === "ACE" && maxMin == 'min') {
            return 1;
        }
        return parseInt(value);
    }

    async drawCard(fullUri) {
        return await fetch(fullUri)
        .then(res => res.json())
        .then(data => 
        {
            return data;
        })
        .catch(err => console.log(err))
    }

    endgame(message) {
        this._active = false;
        document.querySelector("#result").innerHTML = message;
    }
}

export default Game;