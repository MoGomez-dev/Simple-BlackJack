import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    yourHand: [],
    yourTotal: 0,
    enemyHand: [],
    enemyTotal: 0,
    deckId: "",
    modal: false,
    winOrLose:""
}

const handSlice = createSlice({
    name: "hand",
    initialState: initialState,
    reducers: {
        setEnemyHand: (state, action) => {
            console.log('setenemyhand');
            const newHand = action.payload;
            state.enemyHand = [...state.enemyHand, newHand];
            switch (newHand.value){
                case 'ACE': state.enemyTotal += 1
                    break;
                case 'JACK':
                case 'QUEEN':
                case 'KING': state.enemyTotal += 10;
                    break;
                default:
                    state.enemyTotal += Number(newHand.value);
            }
            if(state.enemyTotal > 21){
                state.enemyTotal = 0;
            }   
            // console.log(state.enemyTotal);
        },
        setYourHand: (state, action) => {
            console.log('yourhand');
            const newHand = action.payload;
            state.yourHand = [...state.yourHand, newHand];
            switch (newHand.value){
                case 'ACE': state.yourTotal += 1
                    break;
                case 'JACK':
                case 'QUEEN':
                case 'KING': state.yourTotal += 10;
                    break;
                default:
                    state.yourTotal += Number(newHand.value);
            }
            if(state.yourTotal > 21){
                state.yourTotal = 0;
            }   
        },
        yourTurn: (state, action) => {
            const tentativeEnemyTotal = state.enemyTotal;
            if(tentativeEnemyTotal < 17){
                
            }
            const newHand = action.payload;
            state.enemyHand = [...state.enemyHand, newHand];
            switch (newHand.value){
                case 'ACE': state.enemyTotal += 1
                    break;
                case 'JACK':
                case 'QUEEN':
                case 'KING': state.enemyTotal += 10;
                    break;
                default:
                    state.enemyTotal += Number(newHand.value);
            }
            if(state.enemyTotal > 21){
                state.enemyTotal = 0;
            }
        },
        handleModal: (state,action) => {
            state.modal = !state.modal;
            state.winOrLose = action.payload;
        },
        resetFunction: (state) => {
            console.log('resetfunction');
            state.enemyHand = [];
            state.yourHand = [];
        },
        setDeckId: (state, action) => {
            const deckId = action.payload;
            state.deckId = deckId;
        },
    },
})

export const { setEnemyHand, setYourHand,yourTurn,resetFunction,setDeckId,handleModal } = handSlice.actions;
export default handSlice.reducer;