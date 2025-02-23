import AddPropertyPage from '@/components/AddProperty/AddPropertyPage'
import React from 'react'


const key = process.env.GOOGLE_MAPS_API_KEY!

const page = () => {
  return (
    <>
    <AddPropertyPage GOOGLE_MAPS_API_KEY={key}/>
    </>
    
  )
}

export default page