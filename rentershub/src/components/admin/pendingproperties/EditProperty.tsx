
import { updateProperty } from '@/actions/properties';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearEditData } from '@/store/slices/PropertySlice';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { ArrowLeft, Ellipsis } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
interface PropertyImage {
    id: string;
    url: string;
}

interface PropertyFeature {
    id: number;
    name: string;
    propertytype: string | null;
}

const EditProperty = () => {
    const editdata = useAppSelector((state) => state.property.editdata);
    const dispatch = useAppDispatch();

    console.log(editdata, 'editing');

    const formik = useFormik({
        initialValues: {
            id: 0,
            title: '',
            propertytype: { id: 0, name: '' },
            postedby: '',
            price: '',
            address: '',
            rent_price: '',
            managed_by: '',
            water_charges:'',           
            main_image_url: { id: '', url: '' },
            images: [] as PropertyImage[],
            property_features: [] as PropertyFeature[]
        },
        validationSchema: Yup.object().shape({
            title: Yup.string().required(),
            propertytype: Yup.object().shape({ id: Yup.number(), name: Yup.string().required() }),
            postedby: Yup.string().required(),
            price: Yup.string().required(),
            address: Yup.string().required(),
            rent_price: Yup.string().required(),
            managed_by: Yup.string().required(),
        }),
        onSubmit(values) {
            mutation.mutateAsync({ ...values });
        },
    });

    const mutation = useMutation({
        mutationFn: async (values:{ id: number;
            title: string;
            propertytype: { id: number; name: string };
            postedby: string;
            managed_by: string;
            address: string;
            rent_price: string;}) => {
            const res = await updateProperty(values);
            return res;
        },
        onSuccess(data) {
            if (data[1] === 200) {
                toast.success('Property updated successfully');
                dispatch(clearEditData());
            } else {
                toast.error('Something went wrong!');
            }
        },
        onError(error) {
            toast.error(error.message);
        },
    });

    useEffect(() => {
         
        formik.setValues({
            id: editdata.id,
            title: editdata.title,
            propertytype: { id: editdata.propertytype.id, name: editdata.propertytype.name },
            postedby: editdata.postedby,
            price: editdata.price,
            address: editdata.address,
            rent_price: editdata.rent_price,
            managed_by: editdata.managed_by,
            water_charges: editdata.water_charges,
            main_image_url: editdata.main_image_url,
            images: editdata.images || [],
            property_features: editdata.property_features || []
        });
    }, [editdata]);

    return (
        <div className='w-full flex flex-col'>
            <div className='flex justify-end items-center gap-2'>
                <Button variant={'ghost'} className='flex items-center justify-center font-semibold' onClick={() => {
                    dispatch(clearEditData());
                }}>
                    <ArrowLeft className='w-6 h-6' />
                    Back
                </Button>
            </div>
            <form className='grid grid-cols-1 gap-2' onSubmit={formik.handleSubmit}>
                <div>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>Title</label>
                    <input type='text' name='title' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.title} className='bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5' required />
                </div>

                <div>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>House Type</label>
                    <input type='text' name='propertytype.name' value={formik.values.propertytype.name} readOnly className='bg-gray-200 border border-gray-300 text-sm rounded-lg w-full p-2.5' />
                </div>

                <div>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>Posted By</label>
                    <input type='text' name='postedby' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.postedby} className='bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5' required />
                </div>

                <div>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>Managed By</label>
                    <input type='text' name='managed_by' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.managed_by} className='bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5' required />
                </div>

                <div>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>Location</label>
                    <input type='text' name='address' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.address} className='bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5' required />
                </div>

                <div>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>Rent Price</label>
                    <input type='text' name='rent_price' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.rent_price} className='bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5' required />
                </div>
                <div>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>Water Charges</label>
                    <input type='text' name='water_charges' onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.water_charges} className='bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5' required />
                </div>
                <form className='grid grid-cols-1 gap-2' onSubmit={formik.handleSubmit}>
                <div>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>Main Image</label>
                    {formik.values.main_image_url?.url && <img src={formik.values.main_image_url.url} alt='Main' className='w-full h-40 object-cover rounded' />}
                </div>

                <div>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>Additional Images</label>
                    <div className='grid grid-cols-3 gap-2'>
                        {formik.values.images.map((image) => (
                            <img key={image.id} src={image.url} alt='Property' className='w-full h-24 object-cover rounded' />
                        ))}
                    </div>
                </div>

                <div>
    <label className='block mb-2 text-sm font-medium text-gray-900'>Features</label>
    {formik.values.property_features.length > 0 ? (
        <ul className='list-disc pl-5'>
            {formik.values.property_features.map((feature, index) => (
                <li key={feature?.id || index}>
                    {feature?.name ? feature.name : `Feature ${index + 1}`}
                </li>
            ))}
        </ul>
    ) : (
        <p className='text-gray-500'>No features available.</p>
    )}
</div>


                </form>

                <Button type='submit' disabled={mutation.isPending} className='w-full bg-primary text-white'>
                    {mutation.isPending ? <Ellipsis className='animate-pulse' /> : 'Update Property'}
                </Button>
            </form>
        </div>
    );
};

export default EditProperty;
