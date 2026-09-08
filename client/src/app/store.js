import { configureStore } from '@reduxjs/toolkit'
import  usernameReducer  from '../features/username/usernameSlice'
export const store = configureStore({
  reducer: {
    usernameReducer
  },
})