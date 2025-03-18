import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: JSON.parse(localStorage.getItem("user")) || null,
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
    // signInSuccess: (state, action) => {
    //   const storedAvatar = JSON.parse(localStorage.getItem("user"))?.avatar; 
    //   state.currentUser = { ...action.payload, avatar: storedAvatar || action.payload.avatar };
    //   localStorage.setItem("user", JSON.stringify(state.currentUser)); // Store updated user
    //   state.loading = false;
    // },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload }; 
      localStorage.setItem("user", JSON.stringify(state.currentUser));
    },
    deleteUserStart:(state)=>{
      state.loading=true;
    },
    deleteUserSuccess:(state)=>{
      state.currentUser=null
      state.loading=false;
      state.error=null;
      localStorage.removeItem("user");
    },
    deleteUserFailure:(state,action)=>{
      state.error=action.payload;
      state.loading=false
    },
    signoutUserStart:(state)=>{
      state.loading=true;
    },
   
    signoutUserSuccess: (state) => {
      state.loading = false;
      state.error = null;


      state.currentUser = null;
    },
    signoutUserFailure:(state,action)=>{
      state.error=action.payload;
      state.loading=false
    },
  },
});

export const {signoutUserFailure,signoutUserSuccess, signoutUserStart,signInStart, signInFailure, signInSuccess, updateUserSuccess,deleteUserStart,deleteUserSuccess,deleteUserFailure} = userSlice.actions;
export default userSlice.reducer;
