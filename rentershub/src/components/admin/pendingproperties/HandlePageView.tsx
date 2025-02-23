"use client"
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import React, { Suspense } from 'react'


import { DataTable } from '@/components/globalcomponents/data-table'
import { Loader } from 'lucide-react'
import { columns } from './columns'
import EditProperty from './EditProperty'

const HandlePageView = ({ landlords }: { landlords: any }) => {
    const page = useAppSelector((state) => state.property.page)
    const isedit = useAppSelector((state) => state.property.isedit)
    const dispatch = useAppDispatch()

    return (
        <div className='flex flex-col gap-4'>
                <h1 className="text-2xl font-bold mb-5">Properties Pending Approval</h1>

                {isedit ? (
                    <EditProperty />
                ) : (
                    <div className='w-full'>
                        <Suspense fallback={<Loader className='animate animate-spin text-secondary300' />}>
                            <DataTable columns={columns} data={landlords} searchColumn={"managed_by"}/>
                        </Suspense>

                    </div>
                )}
        </div>
    )
}

export default HandlePageView