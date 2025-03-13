"use client"
import { makeStore } from '@/store/store'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'

const ReactReduxProvider = ({children}:{children:ReactNode}) => {
  return (
    <Provider store={makeStore()}>
        {
            children
        }
    </Provider>
  )
}

export default ReactReduxProvider