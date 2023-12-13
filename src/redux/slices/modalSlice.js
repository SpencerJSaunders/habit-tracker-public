import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayDeleteHabitConfirmationModal: false,
};

const modalSlice = createSlice({
  name: "modalSlice",
  initialState,
  reducers: {
    setDisplayDeleteHabitModal(state, action) {
      state.displayDeleteHabitConfirmationModal = action.payload;
    },
  },
});

export const { setDisplayDeleteHabitModal } = modalSlice.actions;

export default modalSlice.reducer;
