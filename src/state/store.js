import { configureStore } from '@reduxjs/toolkit'
import authSliceReducer from './authSlice'
import storage from './storage'

let store
const createStore = () => {
  if (store) return store
  store = configureStore({ reducer: { auth: authSliceReducer() } })
  store.subscribe(() => {
    let currentValue = store.getState()
    storage.setItem('auth', currentValue.auth)
    console.log(currentValue.auth.id)
  })
  return store
}

export default createStore
