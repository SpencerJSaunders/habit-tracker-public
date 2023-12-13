import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../firebase/firebase";
import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";

const initialState = {
  userDetails: {},
  loadingUser: "",
  error: "",
  status: "",
};

export const logInUser = createAsyncThunk("user/logInUser", async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
});

export const logOutUser = createAsyncThunk("user/logOutUser", async () => {
  return signOut(auth);
});

export const userId = (state) => state.user.userDetails.providerDetails[0].uid;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(logInUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { displayName, email, photoURL } = action.payload.user;
        state.userDetails = {
          displayName,
          email,
          photoURL,
          uid: action.payload.user.uid,
        };
      })
      .addCase(logInUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(logOutUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(logOutUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userDetails = action.payload;
      })
      .addCase(logOutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
