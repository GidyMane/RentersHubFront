import React from 'react'
import DashboardLayout from '@/components/Test/Rentershub/DashbordLayout'
import AddPropertyForm from '@/components/AddProperty/AddPropertyForm'

const page = () => {
  return (
    <div>
       
       <DashboardLayout>
        <AddPropertyForm/>
       </DashboardLayout>
      
    </div>
  )
}

export default page
