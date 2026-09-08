import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: ""
}

export const usernameSlice = createSlice({
  name: 'username',
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload
    },clearUsername: (state) => {
      state.username = ""
    },
  },
})

export const { setUsername, clearUsername} = usernameSlice.actions

export default usernameSlice.reducer