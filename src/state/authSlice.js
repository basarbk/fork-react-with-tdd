import { createSlice } from '@reduxjs/toolkit'
import storage from './storage'
console.log('authSlice')

export const authSlice = createSlice({
  name: 'auth',
  initialState: storage.getItem('auth') || {
    isLoggedIn: false,
    id: '',
    image: null,
    username: '',
    header: ''
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.id = action.payload.id
      state.username = action.payload.username
      state.image = action.payload.image
      state.isLoggedIn = true
      state.header = action.payload.header
    },
    logout: (state) => {
      state.id = ''
      state.username = ''
      state.image = null
      state.isLoggedIn = false
      state.header = ''
    }
  }
})

export const selectAuth = (state) => state.auth

export const { loginSuccess, logout } = authSlice.actions

export default authSlice.reducer
