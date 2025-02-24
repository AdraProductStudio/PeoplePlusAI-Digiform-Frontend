import { configureStore } from "@reduxjs/toolkit";
import commonReducer from './src/redux/slices/commonSlice'

const store = configureStore({
    reducer : {
        commonState : commonReducer
    }
})


export default store