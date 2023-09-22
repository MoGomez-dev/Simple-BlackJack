import React, { useEffect, useState } from 'react'
import * as utilities from '../utils/utilities'
import { WhatDoYouDoButton } from './WhatDoYouDoButton';
import { Modal } from './Modal';
import { ShuffleOrStartButton } from './ShuffleOrStartButton';

export const PlayTable = () => {
  const [modal,setModal] = useState(false);
  const [winOrLose,setWinOrLose] = useState("");
  const [yourHand,setYourHand] = useState([]);
  const [yourScore,setYourScore] = useState(0);
  const [dealersHand,setDealersHand] = useState([]);
  const [dealersPileHand,setDealersPileHand] = useState([]);
  const [dealersScore,setDealersScore] = useState(0);
  const [deckId,setDeckId] = useState("");
  const [haveAce,setHaveAce] = useState(false);
  const [hasAce,setHasAce] = useState(false);
  const [largeDealersScore,setLargeDealersScore] = useState(0);
  const [largeYourScore,setLargeYourScore] = useState(0);
  const [isYouMinimum,setIsYouMinimum] = useState(false);
  const [isDealerMinimum,setIsDealerMinimum] = useState(false);
  const [isStart,setIsStart] = useState(false)

  const backOfCardImage = 'https://www.deckofcardsapi.com/static/img/back.png' ;

  useEffect(() => {
    utilities.makeNewDeck()
    .then((res) => {
      setDeckId(res.deck_id);
    })
  },[])

  const yourScoreCalc = (arr) => {
    let cardsValue = 0;
    for(const card of arr){
      const cardValue = utilities.checkValue(card)
      cardsValue += cardValue;
      if(utilities.checkHaveAce(card)){
        setHaveAce(true);
      }
    }
    setYourScore(cardsValue);
  }

  const dealersScoreCalc = (arr) => {
    let cardsValue = 0;
    for(const card of arr){
      const cardValue = utilities.checkValue(card)
      cardsValue += cardValue;
      if(utilities.checkHaveAce(card)){
        setHasAce(true);
      }
    }
    setDealersScore(cardsValue);
  }

  useEffect(() => {
    if(yourHand.length === 2){
      isBlackJack();
    }
    if(yourScore > 21){
      setWinOrLose("YOU BUST! YOU LOSE!!");
      setModal(true);
    } 
    if(utilities.isMinimum(yourScore)){
      setIsYouMinimum(true);
    } else {
      setIsYouMinimum(false);
    }
    if(haveAce && isYouMinimum){
      const score = yourScore + 10;
      setLargeYourScore(score);
    }
  },[yourScore])

  useEffect(() => {
    if(dealersHand.length === 2){
      isDealerBlackJack();
    }
    if(dealersScore > 21){
      setWinOrLose("DEALER BUST!! YOU WIN");
      setModal(true);
    } 
    if(dealersScore > 16 && dealersScore <= 21){
      setWinOrLose(utilities.compareTotal(yourScore,dealersScore));
      setModal(true);
    }
    if(utilities.isMinimum(dealersScore)){
      setIsDealerMinimum(true);
    } else {
      setIsDealerMinimum(false);
    }
    if(hasAce && isDealerMinimum){
      const score = dealersScore + 10;
      setLargeDealersScore(score);
    }
  },[dealersScore])

  const startYourTurn = (url) => {
    dealerDraw(url,1);
    yourDraw(url,2);
  }

  const dealerPileDraw = (url) => {
    utilities.drawCard(url,10)
      .then((res) => {
        let newArray = [...dealersPileHand];
        for(const card of res.cards){
          newArray = [...newArray, card];
        }
        setDealersPileHand(newArray);
      })
  }

  const dealerDraw = (url,num) => {
    utilities.drawCard(url,num)
      .then((res) => {
        const newArray = [...dealersHand, res.cards[0]];
        setDealersHand(newArray);
        dealersScoreCalc(newArray);
      })
  }

  const yourDraw = (url,num) => {
    utilities.drawCard(url,num)
      .then((res) => {
        let newArray = [...yourHand];
        for(const card of res.cards){
          newArray = [...newArray, card];
        }
        setYourHand(newArray);
        yourScoreCalc(newArray);
      })
  }

  const isBlackJack = () => {
    if(haveAce && yourScore === 11){
      // dealerDraw(deckId,1);
      setWinOrLose("BLACK JACK!!");
      setModal(true);
    }
  }

  const isDealerBlackJack = () => {
    if(hasAce && dealersScore === 11){
      setWinOrLose("Dealer BLACK JACK!!");
      setModal(true);
    }
  }

  let cardsValueA = 0

  const dealersTurn = () => {
    let newArray = [...dealersHand];
    while(cardsValueA < 17){
      newArray.push(dealersPileHand[0]);
      dealersPileHand.shift();
      cardsValueA = 0
      for(const card of newArray){
        const cardValue = utilities.checkValue(card)
        cardsValueA += cardValue;
      }
    }
    setDealersHand(newArray);
    dealersScoreCalc(newArray);
  }

  const resetGame = () => {
    let newArray = [];
    setModal(false);
    setWinOrLose("");
    setYourHand(newArray);
    setYourScore(0);
    setDealersHand(newArray);
    setDealersScore(0);
    setDealersPileHand([]);
    setHaveAce(false);
    setHasAce(false);
    setLargeDealersScore(0);
    setLargeYourScore(0);
    setIsYouMinimum(false);
    setIsDealerMinimum(false);
    setIsStart(false);
  }

  const doHit = () => {
    yourDraw(deckId,1);
  }

  const doStand = () => {
    dealersTurn();
  };

  const handleShuffle = () => {
    utilities.makeNewDeck()
    .then((res) => {
      setDeckId(res.deck_id);
    })
  }

  const handleStart = () => {
    startYourTurn(deckId);
    dealerPileDraw(deckId);
    setIsStart(true);
  }

  return (
    <div className='container'>
      {modal && <Modal winOrLose={winOrLose} resetGame={resetGame} />}
      {isStart && 
        <div className='table'>
          <h3>Dealer</h3>
          <div className='cardArea'>
            {dealersHand?.map((card,index) => {
              return <img  key={index} src={card.image} alt="card" className='card'/>
            })}
            {(dealersHand.length === 1) && <img src={backOfCardImage} alt="card" className='card' />  }
          </div>
          {(hasAce && isDealerMinimum) ? <p>{dealersScore}|{largeDealersScore}</p> : <p>{dealersScore}</p>}
          <h3>You</h3>
          <div className='cardArea'>
            {yourHand?.map((card,index) => {
              return <img  key={index} src={card.image} alt="card" className='card'/>
            })}
          </div>
          {(haveAce && isYouMinimum) ? <p>{yourScore}|{largeYourScore}</p> : <p>{yourScore}</p>}
        </div>
      }
            {isStart ? <WhatDoYouDoButton doHit={doHit} doStand={doStand} /> : <ShuffleOrStartButton handleShuffle={handleShuffle} handleStart={handleStart} /> }
    </div>
  )
}
