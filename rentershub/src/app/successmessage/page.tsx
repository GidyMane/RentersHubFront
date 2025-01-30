import SuccessMessage from '@/components/SuccessMessage'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
     style={{ backgroundImage: "url('/interior.jpg')" }}>
      <SuccessMessage/>
    </div>
  )
}

export default page
