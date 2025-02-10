import { getpropertyfeatures } from '@/actions/property'
import PageView from '@/components/admin/features/PageView'
import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'

export const dynamic = "force-dynamic"


const page = async () => {
    const features = await getpropertyfeatures() ?? []
    return (
        <div className='col-span-3 container'>
            <Suspense fallback={<Loader className='animate animate-spin text-secondary400'/>}>

            <PageView features={features} />
            </Suspense>
        </div>
    )
}

export default page