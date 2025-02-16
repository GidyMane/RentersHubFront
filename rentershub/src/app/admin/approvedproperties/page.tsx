
import React, { Suspense } from 'react'

import { getAllproperties, getproperties, getpropertyfeatures } from '@/actions/property'
import { Loader } from 'lucide-react'

import { getpropertytypes } from '@/actions/propertytype'
import PageView from '@/components/admin/ApprovedProperties/ManageProperties'

export const dynamic = "force-dynamic"


const page = async () => {
    const properties = await getAllproperties() ?? []
    const features = await getpropertyfeatures() ?? []
    const propertytypes = await getpropertytypes() ?? []
    // console.log(propertytypes, "propertypes,,,,,,,");
    // console.log(properties, "properties222,,,,,,,");
    // console.log(features, "features 333,,,,,,,");



    return (
        <div className="col-span-3 md:container">
            <Suspense fallback={<Loader className='animate animate-spin text-secondary400' />}>

                <PageView properties={properties} propertytypes={propertytypes[0]} features={features} />
            </Suspense>

        </div>
    )
}

export default page