import React from 'react'

export const ShuffleOrStartButton = ({handleShuffle,handleStart}) => {
  return (
    <div className='is-start-false'>
      <div className='rules'>
        <h1>ルール</h1>
        <h3>21を超えないようにできるだけ近づけてください。</h3>
        <h3>あなたがバーストしたら、無条件で負けです。</h3>
        <h3>ディーラーは17以上になると、カードを引くのを止めます。</h3>
        <h3>J,Q,Kは、すべて10と数えます。Aは、1と数えても11と数えても良いです。</h3>
        <h3>最初の2枚で21ぴったりになったら、ブラックジャックです。あなたの勝ちになります。</h3>
      </div>
        <button onClick={handleShuffle} className='btn' >Shuffle</button>
        <button onClick={handleStart} className='btn' >Start</button>
    </div>
  )
}
