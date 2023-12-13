import { configureStore } from "@reduxjs/toolkit";
import userHabitsReducer from "./slices/userHabitsSlice";
import userReducer from "./slices/userSlice";
import modalSlice from "./slices/modalSlice";

const store = configureStore({
  reducer: {
    userHabits: userHabitsReducer,
    user: userReducer,
    modals: modalSlice,
  },
});

export default store;
