export const fetchDeckOfCardApi = (url) => {
    return new Promise((resolve,reject) => {
        fetch(url)
            .then((res) =>  res.json())
            .then((data) => resolve(data));
    })
};

export  const drawCard = async (url,num) => {
    const drawDeckUrl = `https://www.deckofcardsapi.com/api/deck/${url}/draw/?count=${num}`;
    let res = await fetchDeckOfCardApi(drawDeckUrl);
    return res;
};

export const makeNewDeck = async () => {
    let res = await fetchDeckOfCardApi("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
    return res;
};

export const checkValue = (card) => {
        switch (card.value){
            case 'ACE': return 1
            case 'JACK': return 10;
            case 'QUEEN': return 10;
            case 'KING': return 10;
            default:
                return Number(card.value);
        }
}

export const checkHaveAce = (card) => {
    if(card.value ==="ACE"){
        return true;
    } 
    return false;
}

export const isMinimum = (score) => {
    if((score + 10) <= 21){
        return true;
    }
    return false;
}

export const compareTotal = (you,dealer) => {
    if(you > dealer){
        return "YOU WIN ^^b";
    } else if(you === dealer){
        return "DRAW";
    } else {
        return "YOU LOSE (;o;)";
    }
}
