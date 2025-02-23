import { getpropertyfeatures } from '@/actions/property'
import PageView from '@/components/admin/features/PageView'
import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'
import { getPendingLandlords } from '../../../../data-access/actions/getlandlords'

export const dynamic = "force-dynamic"


const page = async () => {
    const landlords = await getPendingLandlords() ?? []

    console.log(landlords, "landlords server pagetsx")
    return (
        <div className='col-span-3 container'>
            <Suspense fallback={<Loader className='animate animate-spin text-secondary400'/>}>

            <PageView landlords={landlords[1] ?? []} />
            </Suspense>
        </div>
    )
}

export default page