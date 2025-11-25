import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import CurrentPort from './CurrentPort'

const index = configureStore({
    reducer:{
        auth:authReducer,
        portNo:CurrentPort,
    }
});

export default index;