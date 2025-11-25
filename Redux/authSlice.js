import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name:'auth',
    initialState:{
        uid:'',
        userName:'',
        userEmail:'',
        emailVerified:false,
        phoneNumber:'',
        photoUrl:''
    },

    reducers:{
        setAuthState:(state, action)=>{
            const {uid,userName,userEmail,emailVerified,phoneNumber,photoUrl} = action.payload
            state.uid =uid;
            state.userName = userName;
            state.userEmail = userEmail;
            state.emailVerified = emailVerified;
            state.phoneNumber = phoneNumber;
            state.photoUrl = photoUrl;
        },
        signOutAuthState:(state) => {
            state.uid ='';
            state.userName = '';
            state.userEmail = '';
            state.emailVerified = false;
            state.phoneNumber = '';
            state.photoUrl = '';
        }
    }
});

export const {setAuthState, signOutAuthState} =authSlice.actions;
export default authSlice.reducer