import { createSlice } from "@reduxjs/toolkit";

const CurrentPort = createSlice({
    name:'portNo',
    initialState:{
        portNo:"192.168.0.106"
    }
})

export default CurrentPort.reducer;

