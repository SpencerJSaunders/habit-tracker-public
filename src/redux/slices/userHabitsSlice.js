import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import uniqid from "uniqid";

const initialState = {
  userHabits: [],
  status: "",
  error: "",
};

export const addUserHabit = createAsyncThunk(
  "userHabits/addUserHabit",
  async (formData) => {
    const docRef = await addDoc(collection(db, "user-habits"), {
      ...formData,
      habitId: uniqid(),
    });
    
    return docRef;
  }
);

export const updateUserHabit = createAsyncThunk(
  "userHabits/updateUserHabit",
  async (formData) => {
    const docRef = doc(db, "user-habits", formData.id);

    await updateDoc(docRef, {
      ...formData,
    });

    if (formData.habitLimit) {
      await updateDoc(docRef, {
        daysCompleted: [],
      });
    }
  }
);

const userHabitsSlice = createSlice({
  name: "userHabits",
  initialState,
  reducers: {
    updateUserHabitsList(state, action) {
      state.userHabits = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addUserHabit.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(addUserHabit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUserHabit.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(updateUserHabit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateUserHabitsList } = userHabitsSlice.actions;

export default userHabitsSlice.reducer;
