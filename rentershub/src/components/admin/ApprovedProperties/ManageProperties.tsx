"use client"

import { DataTable } from '@/components/globalcomponents/data-table'
import { Button } from '@/components/ui/button'
import { RootState } from '@/store/store'
import { Loader } from 'lucide-react'
import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'

import { useAppDispatch } from '@/store/hooks'
import { clearEditData, setIsAdd } from '@/store/slices/PropertySlice'

import Link from 'next/link'
import { columns } from '@/app/admin/approvedproperties/columns'
import AddProperty from './AddProperty'

const PageView = ({ properties, features, propertytypes}: { properties: any; features:any; propertytypes:any;}) => {
    const editdata = useSelector((state: RootState) => state.property.editdata)
    const isedit = useSelector((state: RootState) => state.property.isedit)
    const isadd = useSelector((state: RootState) => state.property.isadd)
    console.log(editdata, 'the data');
    console.log(editdata.id, 'the data id');


    

    const dispatch = useAppDispatch()
    return (
        <div className='flex flex-col w-full'>
            <div className='flex justify-between my-4'>
                <h1 className="text-2xl font-bold mb-5">Manage Properties</h1>
                <Button onClick={() => {
                    if (isedit) {
                        dispatch(clearEditData())
                    } else {
                        dispatch(setIsAdd())

                    }
                }} className='bg-primary text-white rounded-none' >
                    {isadd || isedit ? "back" : "add property"}
                </Button>
            </div>

            <Suspense fallback={<Loader className='animate animate-spin text-secondary' />}>

                {isadd ? (
                    <AddProperty features={features} propertytypes={propertytypes} />
                ) : isedit ? (<p>tesst</p>) : (
                    <div className='overflow-hidden'>
                        <DataTable columns={columns} data={properties ?? []} searchColumn="name"/>
                    </div>
                )}



            </Suspense>

        </div>
    )
}

export default PageView