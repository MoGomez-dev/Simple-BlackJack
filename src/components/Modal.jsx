import React from 'react'

export const Modal = (props) => {
//     const dispatch = useDispatch();
//     const {winOrLose} = useSelector((store) => store.deck)



  return (
    <div id='overlay'>
        <div id='content'>
            <h3>{props.winOrLose}</h3>
            <button onClick={props.resetGame} className='btn'>next game</button>
        </div>
    </div>
  )
}
