import React, { useEffect, useState } from 'react'
import * as utilities from '../utils/utilities'
import { WhatDoYouDoButton } from './WhatDoYouDoButton';
import { Modal } from './Modal';
import { RulesAndStartButton } from './RulesAndStartButton';

export const PlayTable = () => {
  const [modal,setModal] = useState(false);
  const [winOrLose,setWinOrLose] = useState("");
  const [yourHand,setYourHand] = useState([]);
  const [yourScore,setYourScore] = useState(0);
  const [dealersHand,setDealersHand] = useState([]);
  const [pileHand,setPileHand] = useState([]);
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

  // 初回レンダリング時に新しいデッキを作成

  useEffect(() => {
    utilities.makeNewDeck()
      .then((res) => {
        setDeckId(res.deck_id);
        pileDraw(res.deck_id);
      })
  },[])

  // APIをフェッチしてパイルにカードを15枚引く

  const pileDraw = (url) => {
    utilities.drawCard(url,15)
      .then((res) => {
        let newArray = [];
        for(const card of res.cards){
          newArray = [...newArray, card];
        }
        setPileHand(newArray);
        // デッキのカードが50枚より少なくなったら新しいデッキを作成する
        if(res.remaining < 50){
          utilities.makeNewDeck()
            .then((res) => {
              setDeckId(res.deck_id);
            })
        }
      })
  }



// プレイヤーのスコアが変わるたびに発火する

  useEffect(() => {
    if(yourHand.length === 2 && haveAce && yourScore === 11){
        setWinOrLose("BLACK JACK!!");
        setModal(true);
        setIsYouMinimum(false);
    }
    if(yourScore > 21){
      setWinOrLose("YOU BUST (;o;)");
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

  // スコアの計算

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
    }
    if(arr.length === 1 && cardsValue === 1){
      setHasAce(true);
      setLargeDealersScore(11);
      setIsDealerMinimum(true);
    }
    setDealersScore(cardsValue);
  }

// パイルからカードを引く

  const dealerDraw = () => {
    let newArray = [];
    const newHand = pileHand[0];
    const cardValue = utilities.checkValue(newHand);
    newArray.push(newHand);
    pileHand.shift();
    setDealersHand(newArray);
    dealersScoreCalc(newArray);
  }

  const yourDraw = (num) => {
    let newArray = [...yourHand];
    for(let i=0;i < num;i++){
      newArray.push(pileHand[i]);
      pileHand.shift();
    }
    setYourHand(newArray);
    yourScoreCalc(newArray);
  }

// ディーラーのターン」

  

  const dealersTurn = (score) => {
    let newArray = [...dealersHand];
    let cardsValueA = 0
    let isFinish = false;
    let aceFlag = hasAce;
    let minimumFlag = false;
    isFinish = false;
    aceFlag = hasAce;
    while(!isFinish){
      const newHand = pileHand[0]
      newArray.push(newHand);
      pileHand.shift();
      if(utilities.checkHaveAce(newHand)){
        setHasAce(true);
        aceFlag = true;
      }
      cardsValueA = 0
      for(const card of newArray){
        const cardValue = utilities.checkValue(card)
        cardsValueA += cardValue;
      }
      if(newArray.length === 2 && aceFlag && cardsValueA === 11){
        setWinOrLose("Dealer BLACK JACK!!");
        setModal(true);
        setDealersHand(newArray);
        setIsDealerMinimum(false);
        setDealersScore(21);
        isFinish = true;
        break;
      }
      if(cardsValueA <= 11){
        setIsDealerMinimum(true);
        minimumFlag = true;
      } else {
        setIsDealerMinimum(false);
        minimumFlag = false;
      }
      if(minimumFlag && aceFlag){
        setLargeDealersScore(cardsValueA + 10);
      }
      if(cardsValueA > 21){
        setWinOrLose("DEALER BUST!! ^^b");
        setModal(true);
        isFinish = true;
      } 
      if(cardsValueA >= 7 && cardsValueA <= 11 && aceFlag){
        setWinOrLose(utilities.compareTotal(score,(cardsValueA + 10)));
        setModal(true);
        isFinish = true;
      } else if(cardsValueA > 16 && cardsValueA <= 21){
        setWinOrLose(utilities.compareTotal(score,cardsValueA));
        setModal(true);
        isFinish = true;
      }
      setDealersHand(newArray);
      dealersScoreCalc(newArray);
    }
  }

// ボタンアクション

  const resetGame = () => {
    let newArray = [];
    setModal(false);
    setWinOrLose("");
    setYourHand(newArray);
    setYourScore(0);
    setDealersHand(newArray);
    setDealersScore(0);
    setPileHand([]);
    setHaveAce(false);
    setHasAce(false);
    setLargeDealersScore(0);
    setLargeYourScore(0);
    setIsYouMinimum(false);
    setIsDealerMinimum(false);
    setIsStart(false);
    pileDraw(deckId);
  }

  const doHit = () => {
    yourDraw(1);
  }

  const doStand = () => {
    if(haveAce && isYouMinimum){
      setYourScore(largeYourScore);
      dealersTurn(largeYourScore);
    } else{
    dealersTurn(yourScore);
    }
  };

  const handleStart = () => {
    dealerDraw();
    yourDraw(2);
    setIsStart(true);
  }

  return (
    <div className='container'>
      {modal && <Modal winOrLose={winOrLose} resetGame={resetGame} />}
      {isStart && 
        <div className='table'>
          {(hasAce && isDealerMinimum) ? <h3>Dealer:{dealersScore}|{largeDealersScore}</h3> : <h3>Dealer:{dealersScore}</h3>}
          <div className='cardArea'>
            {dealersHand?.map((card,index) => {
              return <img  key={index} src={card.image} alt="card" className='card'/>
            })}
            {(dealersHand.length === 1) && <img src={backOfCardImage} alt="card" className='card' />  }
          </div>
          <div className='cardArea'>
            {yourHand?.map((card,index) => {
              return <img  key={index} src={card.image} alt="card" className='card'/>
            })}
          </div>
          {(haveAce && isYouMinimum) ? <h3>You:{yourScore}|{largeYourScore}</h3> : <h3>You:{yourScore}</h3>}
          <WhatDoYouDoButton doHit={doHit} doStand={doStand} />
        </div>
      }
      {isStart || <RulesAndStartButton handleStart={handleStart} />}
    </div>
  )
}
