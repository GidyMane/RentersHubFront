"use client"
import { DataTable } from '@/components/globalcomponents/data-table'
import { Button } from '@/components/ui/button'
import React, { Suspense } from 'react'
import { columns } from './columns'
import { Loader } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import AddFeature from './AddFeature'
import EditFeature from './EditFeature'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearEditData } from '@/store/slices/PropertySlice'


const PageView = ({ features }: { features: any }) => {
    const page = useAppSelector((state) => state.property.page)
    const isedit = useAppSelector((state) => state.property.isedit)
    const dispatch = useAppDispatch()
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-between my-4'>
                <h1 className="text-2xl font-bold mb-5">Manage Property Types</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button onClick={() => {
                            // if (isedit) {
                            //     dispatch(clearEditData())
                            // } else {
                            //     dispatch(setIsAdd())

                            // }
                        }} className='bg-primary500 text-white rounded-none' >
                            {/* {isadd || isedit ? "back" : "add property"} */}
                            Add Feature
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Feature Listing</DialogTitle>
                            <DialogDescription>
                                <AddFeature />
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>


                <Dialog open={page == "features" && isedit} onOpenChange={() => {
                    dispatch(clearEditData())
                }}>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Feature Listing</DialogTitle>
                            <DialogDescription>
                                <EditFeature />
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>


            </div>


            <div className='w-full'>
                <Suspense fallback={<Loader className='animate animate-spin text-secondary300' />}>
                    <DataTable columns={columns} data={features} />
                </Suspense>

            </div>


        </div>
    )
}

export default PageView