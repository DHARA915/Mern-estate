import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload }; // ✅ Merge updated fields
    },
    deleteUserStart:(state)=>{
      state.loading=true;
    },
    deleteUserSuccess:(state)=>{
      state.currentUser=null
      state.loading=false;
      state.error=null
    },
    deleteUserFailure:(state,action)=>{
      state.error=action.payload;
      state.loading=false
    }
  },
});

export const { signInStart, signInFailure, signInSuccess, updateUserSuccess,deleteUserStart,deleteUserSuccess,deleteUserFailure} = userSlice.actions;
export default userSlice.reducer;
