"use client"
import { DataTable } from '@/components/globalcomponents/data-table'
import { Button } from '@/components/ui/button'
import React, { Suspense } from 'react'

import { Loader } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearEditData } from '@/store/slices/PropertySlice'
import EditLandlord from './EditLandlord'
import { columns } from './columns'



const PageView = ({ landlords }: { landlords: any }) => {
    const page = useAppSelector((state) => state.property.page)
    const isedit = useAppSelector((state) => state.property.isedit)
    const dispatch = useAppDispatch()


// console.log(landlords, "landlords")
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-between my-4'>
                <h1 className="text-2xl font-bold mb-5">Pending Ground Agents</h1>
                {/* <Dialog>
                    <DialogTrigger asChild>
                        <Button onClick={() => {
                            if (isedit) {
                                dispatch(clearEditData())
                            } else {
                                dispatch(setIsAdd())

                            }
                        }} className='bg-primary text-white rounded-none' >
                            {isadd || isedit ? "back" : "add property"}
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
                </Dialog> */}


                <Dialog open={page == "pendinggroundagents" && isedit} onOpenChange={() => {
                    dispatch(clearEditData())
                }}>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Agent</DialogTitle>
                            <DialogDescription>
                                <EditLandlord />
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>


            </div>


            <div className='w-full'>
                <Suspense fallback={<Loader className='animate animate-spin text-secondary300' />}>
                    <DataTable columns={columns} data={landlords} searchColumn={"email"}/>
                </Suspense>

            </div>


        </div>
    )
}

export default PageView