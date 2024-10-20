import Game from "./game.js";

const blackjack = new Game();

// SETUP
await blackjack.shuffle();
// DEAL
await blackjack.deal();
// PLAYER ACTION
document.querySelector('#hit').addEventListener('click', async() => {
    await blackjack.hit();
});
document.querySelector('#stand').addEventListener('click', async() => {
    await blackjack.stand();
});
// DEALER ACTION
// CONCLUSION

document.querySelector('#newgame').addEventListener('click', async() =>{
    await blackjack.newGame();
});