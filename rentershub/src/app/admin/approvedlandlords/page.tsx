import { getpropertyfeatures } from '@/actions/property'
<<<<<<< HEAD
import PageView from '@/components/admin/features/PageView'
import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'
=======
import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'
import { getLandlords } from '../../../../data-access/actions/getlandlords'
import HandlePageView from '@/components/admin/ApprovedLandlords/HandlePageView'
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6

export const dynamic = "force-dynamic"


const page = async () => {
<<<<<<< HEAD
    const features = await getpropertyfeatures() ?? []
=======
    const landlords = await getLandlords() ?? []

    // console.log(landlords, "landlords server pagetsx")
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
    return (
        <div className='col-span-3 container'>
            <Suspense fallback={<Loader className='animate animate-spin text-secondary400'/>}>

<<<<<<< HEAD
            <PageView features={features} />
=======
            <HandlePageView landlords={landlords[1] ?? []} />
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
            </Suspense>
        </div>
    )
}

export default page