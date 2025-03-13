

import { updateProperty } from "@/actions/properties";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearEditData } from "@/store/slices/PropertySlice";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { ArrowLeft, Ellipsis } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import * as Yup from "yup";

const EditProperty = () => {
    const editdata = useAppSelector((state) => state.property.editdata);
    const dispatch = useAppDispatch();

    

    const formik = useFormik({
        initialValues: {
            id: 0,
            title: "",
            propertytype: { id: 0, name: "" },
            postedby: "",
            price: "",
            address: "",
            rent_price: "",
            managed_by: "",
            is_approved: "",
            is_available: true, // Default to true
        },
        validationSchema: Yup.object().shape({
            title: Yup.string().required(),
            propertytype: Yup.object().shape({ id: Yup.number(), name: Yup.string().required() }),            
            price: Yup.string().required(),
            address: Yup.string().required(),
            rent_price: Yup.string().required(),
            managed_by: Yup.string().required(),
        }),
        onSubmit(values) {
            console.log("Submitting values:", values);
            mutation.mutateAsync(values);
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: {
            id: number;
            title: string;
            propertytype: { id: number; name: string };
            postedby: string;
            managed_by: string;
            address: string;
            rent_price: string;
            is_available: boolean; // Send is_available
        }) => {
            console.log("Mutation function called with:", values);
            const res = await updateProperty(values);
            console.log(res, "response");
            return res;
        },
        onSuccess(data) {
            if (data[1] === 200) {
                toast.success("Property updated successfully");
                dispatch(clearEditData());
            } else {
                toast.error("Something went wrong!");
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
            is_approved: editdata.is_approved,
            is_available: editdata.is_available ?? true, // Load existing value or default to true
        });
    }, [editdata]);

    return (
        <div className="w-full flex flex-col">
            <div className="flex justify-end items-center gap-2">
                <Button
                    variant={"ghost"}
                    className="flex items-center justify-center font-semibold"
                    onClick={() => {
                        dispatch(clearEditData());
                    }}
                >
                    <ArrowLeft className="w-6 h-6" />
                    Back
                </Button>
            </div>
            <form className="grid grid-cols-1 gap-2" onSubmit={formik.handleSubmit}>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                    <input
                        type="text"
                        name="title"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.title}
                        className="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">House Type</label>
                    <input
                        type="text"
                        name="propertytype.name"
                        value={formik.values.propertytype.name}
                        readOnly
                        className="bg-gray-200 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Posted By</label>
                    <input
                        type="text"
                        name="postedby"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.postedby}
                        className="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Managed By</label>
                    <input
                        type="text"
                        name="managed_by"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.managed_by}
                        className="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Location</label>
                    <input
                        type="text"
                        name="address"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address}
                        className="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900">Rent Price</label>
                    <input
                        type="text"
                        name="rent_price"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.rent_price}
                        className="bg-gray-50 border border-gray-300 text-sm rounded-lg w-full p-2.5"
                        required
                    />
                </div>

                {/* Toggle for is_available (Hide Property) */}
                <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium text-gray-900">Hide Property</label>
                    <input
                        type="checkbox"
                        checked={!formik.values.is_available} // Hides property when unchecked
                        onChange={(e) => formik.setFieldValue("is_available", !e.target.checked)}
                        className="w-5 h-5"
                    />
                </div>

                <Button type="submit" disabled={mutation.isPending} className="w-full bg-primary text-white">
                    {mutation.isPending ? <Ellipsis className="animate-pulse" /> : "Update Property"}
                </Button>
            </form>
        </div>
    );
};

export default EditProperty;
