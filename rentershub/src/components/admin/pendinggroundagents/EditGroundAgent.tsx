
import { updateUser } from '@/actions/landlord'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearEditData } from '@/store/slices/PropertySlice'
import { useMutation } from '@tanstack/react-query'
import { getRandomValues } from 'crypto'
import { useFormik } from 'formik'
import { ArrowLeft, Ellipsis } from 'lucide-react'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import * as Yup from "yup"

const EditGroundAgent = () => {
    const editdata = useAppSelector((state) => state.property.editdata)
    const dispatch = useAppDispatch()

    // console.log(editdata, "editing")

    const formik = useFormik({
        initialValues: {
            id: 0,
            first_name: '',
            last_name: '',
            email: '',
            contact: '',
            role_name: { role: '' }, // Read-only
            username: '',
            approval_status: '',
        },
        validationSchema: Yup.object().shape({
            first_name: Yup.string().required(),
            last_name: Yup.string().required(),
            email: Yup.string().email().required(),
            contact: Yup.string().required(),
            username: Yup.string().required(),
            approval_status: Yup.string().required(),
        }),
        onSubmit(values,) {
            mutation.mutateAsync({ ...values })
        },
    })

    // Mutation to handle feature submission
    const mutation = useMutation({
        mutationFn: async (values: { id :number; first_name: string; last_name: string; email: string; contact: string; username: string; approval_status: string }) => {
            const res = await updateUser(values)
            return res
        },
        onSuccess(data: any, variables, context) {
            if (data[1] == 200) {
                toast.success("Landlord updated successfully")
                dispatch(clearEditData())
            } else {
                toast.error("Something went wrong!")
            }
        },
        onError(error, variables, context) {
            toast.error(error.message)
        },
    })

    useEffect(() => {
        formik.setValues({
            id: editdata.id,
            first_name: editdata.first_name,
            last_name: editdata.last_name,
            email: editdata.email,
            contact: editdata.contact,
            role_name: { role: editdata.role_name.role }, // Read-only
            username: editdata.username,
            approval_status: editdata.status,
        })
    }, [editdata])

    return (
        <div className='w-full flex flex-col'>
            <h3 className='my-4'>Edit Ground agent</h3>
            <p className='text-muted-foreground my-4'>You can change the status of the ground agent or any other relevant field</p>
            <div className='flex justify-end items-center gap-2'>
         
                <Button variant={"ghost"} className='flex items-center justify-center font-semibold' onClick={()=>{
                    dispatch(clearEditData())
                }}>
                <ArrowLeft className='w-6 h-6'/>
                    Back</Button>
            </div>
            <form action="" className='grid grid-cols-1 gap-2' onSubmit={formik.handleSubmit}>

                {/* First Name */}
                <div>
                    <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                    <input type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='first_name'
                        defaultValue={formik.values.first_name}
                        id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300" placeholder="First Name" required />
                    {formik.errors.first_name && formik.touched.first_name && <div className="text-red-500">{formik.errors.first_name}</div>}
                </div>

                {/* Last Name */}
                <div>
                    <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                    <input type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='last_name'
                        defaultValue={formik.values.last_name}
                        id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300" placeholder="Last Name" required />
                    {formik.errors.last_name && formik.touched.last_name && <div className="text-red-500">{formik.errors.last_name}</div>}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='email'
                        defaultValue={formik.values.email}
                        id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300" placeholder="Email" required />
                    {formik.errors.email && formik.touched.email && <div className="text-red-500">{formik.errors.email}</div>}
                </div>

                {/* Contact */}
                <div>
                    <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact</label>
                    <input type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='contact'
                        defaultValue={formik.values.contact}
                        id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300" placeholder="Contact" required />
                    {formik.errors.contact && formik.touched.contact && <div className="text-red-500">{formik.errors.contact}</div>}
                </div>

                {/* Role Name (Read-Only) */}
                <div>
                    <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
                    <input type="text"
                        name='role_name'
                        defaultValue={formik.values.role_name.role}
                        readOnly
                        id="" className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5" />
                </div>

                {/* Username */}
                <div>
                    <label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name='username'
                        defaultValue={formik.values.username}
                        id="" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5" placeholder="Username" required />
                    {formik.errors.username && formik.touched.username && <div className="text-red-500">{formik.errors.username}</div>}
                </div>

                {/* Status */}

                <div>
                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Status
                    </label>
                    <select
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        name="approval_status"
                        value={formik.values.approval_status}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="APPROVED">Approved</option>
                        <option value="PENDING">Pending</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    {formik.errors.approval_status && formik.touched.approval_status && (
                        <div className="text-red-500">{formik.errors.approval_status}</div>
                    )}
                </div>


                <Button type="submit" disabled={mutation.isPending} className="w-full bg-primary text-white">
                    {mutation.isPending ? <Ellipsis className="animate-pulse" /> : "Update GroundAgent"}
                </Button>
            </form>
        </div>
    )
}

export default EditGroundAgent
