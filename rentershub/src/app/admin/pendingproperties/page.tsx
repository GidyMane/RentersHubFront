

import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'
import { getPendingProperties } from '../../../../data-access/actions/gethouses'
import HandlePageView from '@/components/admin/pendingproperties/HandlePageView'





export const dynamic = "force-dynamic"


const page = async () => {
    const properties = await getPendingProperties() ?? []    
     
    console.log(properties, "properties")
    return (
        <div className='col-span-3 container'>
            <Suspense fallback={<Loader className='animate animate-spin text-secondary400'/>}>

            <HandlePageView landlords={properties[1] ?? []} />
            </Suspense>
        </div>
    )
}

export default page