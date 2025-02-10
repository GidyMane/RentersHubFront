import { configureStore } from '@reduxjs/toolkit'
import { propertyReducer } from './slices/PropertySlice'
import { datatableReducer } from './slices/DataTableSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      property:propertyReducer,
      datatable:datatableReducer
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']