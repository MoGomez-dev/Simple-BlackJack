import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    began: false,
    deckId: "",
    modal: false,
    winOrLose:""
}

const deckSlice = createSlice({
    name: "deck",
    initialState: initialState,
    reducers: {
        setDeckId: (state, action) => {
            const deckId = action.payload;
            state.deckId = deckId;
        },
        handleBegan: (state) => {
            state.began = !state.began;
        },
        handleModal: (state,action) => {
            state.modal = !state.modal;
            state.winOrLose = action.payload;
        },
    },
})

export const { setDeckId, handleBegan, handleModal } = deckSlice.actions;
export default deckSlice.reducer;