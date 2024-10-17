document.querySelector("#draw").addEventListener('click', () => {
    let fullUri = 'https://deckofcardsapi.com/api/deck/new/draw/?count=1';
    fetch(fullUri) 
    .then(res => res.json()) 
    .then(data => 
    {
        let image = document.createElement("img");
        image.setAttribute("src", data.cards[0].image);
        document.querySelector("#result").innerHTML = '';
        document.querySelector("#result").appendChild(image);
        console.log(data);
    }) 
    .catch(err => console.log(err)) 
});