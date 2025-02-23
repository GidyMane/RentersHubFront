import { getpropertyfeatures } from '@/actions/property'
import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'
import { getLandlords } from '../../../../data-access/actions/getlandlords'
import HandlePageView from '@/components/admin/ApprovedLandlords/HandlePageView'

export const dynamic = "force-dynamic"


const page = async () => {
    const landlords = await getLandlords() ?? []

    // console.log(landlords, "landlords server pagetsx")
    return (
        <div className='col-span-3 container'>
            <Suspense fallback={<Loader className='animate animate-spin text-secondary400'/>}>

            <HandlePageView landlords={landlords[1] ?? []} />
            </Suspense>
        </div>
    )
}

export default page