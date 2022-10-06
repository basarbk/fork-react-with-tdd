import { configureStore } from '@reduxjs/toolkit'
import authSliceReducer from './authSlice'
import storage from './storage'

const store = configureStore({ reducer: { auth: authSliceReducer } })
store.subscribe(() => {
  let currentValue = store.getState()
  storage.setItem('auth', currentValue.auth)
  console.log(currentValue.auth.id)
})

export default store
