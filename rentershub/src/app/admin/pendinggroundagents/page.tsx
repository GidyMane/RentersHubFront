import { getpropertyfeatures } from '@/actions/property'

import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'



import { getPendingGroundAgents } from '../../../../data-access/actions/getgroundagents'
import HandlePageView from '@/components/admin/pendinggroundagents/HandlePageView'

export const dynamic = "force-dynamic"


const page = async () => {
    const landlords = await getPendingGroundAgents() ?? []    
    
    return (
        <div className='col-span-3 container'>
            <Suspense fallback={<Loader className='animate animate-spin text-secondary400'/>}>

            <HandlePageView landlords={landlords[1] ?? []} />
            </Suspense>
        </div>
    )
}

export default page