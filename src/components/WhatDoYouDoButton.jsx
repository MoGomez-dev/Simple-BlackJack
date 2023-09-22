import React from 'react'

export const WhatDoYouDoButton = ({doHit,doStand}) => {
  return (
    <div className='is-start-true'>
        <button onClick={doHit} className='btn' >Hit</button>
        <button onClick={doStand} className='btn' >Stand</button>
    </div>
  )
}
