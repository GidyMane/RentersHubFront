"use client";

import React, { FormEvent, useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { patchPropertyData, updatePropertyImage } from "@/actions/property";
import toast from "react-hot-toast";
import Link from "next/link";
import { RevalidatePath } from "@/components/globalcomponents/RevalidateCustomPath";
import { useMutation } from "@tanstack/react-query";
import { FeatureBadges } from "./features";

interface PropertyImage {
  url: string;
  Image: File;
}

export default function EditProperty({
  features,
  propertytypes,
  propertyById,
}: {
  features: any;
  propertytypes: any;
  propertyById: any;
}) {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<PropertyImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  // const router = useRouter();

  const formattedImages = uploadedImages.map((image) => image.Image);

  const updatePropertyData = async (values: any) => {
    const updatedValues = {
      ...values,
      features: values.features.join(","),
    };
    console.log(updatedValues, "updatedValues----");

    const response = await patchPropertyData(updatedValues);
    console.log(response, response.status, "response------");

    if (response.status === 201) {
      toast.success("Successfully updated property data");
      console.log(response.data, "success: property data updated");
      return true;
    } else {
      toast.error("Error updating property data");
      console.log(response.data, "error: failed to update property data");
      return false;
    }
  };

  const updateImages = async (propertyId: number, images: File[]) => {
    if (images.length > 0) {
      const formData = new FormData();
      formData.append(
        "json",
        JSON.stringify({
          action: "delete",
          propertyId: propertyId,
        })
      );
      images.forEach((image, index) => {
        formData.append(`images`, image);
      });
      console.log(formData, "formData------");

      const imageUploadResponse = await updatePropertyImage(formData);
      if (imageUploadResponse.error) {
        toast.error("Error uploading images");
        console.log(
          imageUploadResponse.error,
          "error: failed to upload images"
        );
        return false;
      } else {
        toast.success("Successfully uploaded images");
        console.log(imageUploadResponse.data, "success: images uploaded");
        return true;
      }
    }
    return true;
  };

  const formik = useFormik({
    initialValues: {
      id: propertyById?.data?.property?.id || 0,
      name: propertyById?.data?.property?.name || "",
      description: propertyById?.data?.property?.description || "",
      street_address: propertyById?.data?.property?.streetAddress || "",
      city: propertyById?.data?.property?.city || "",
      saleType: propertyById?.data?.property?.saleType || "Sale",
      featured: propertyById?.data?.property?.featured || false,
      propertyType: propertyById?.data?.property?.propertyType.id || 0,
      size: propertyById?.data?.property?.size || "",
      distance: propertyById?.data?.property?.distance || "",
      price: propertyById?.data?.property?.price || 0,
      pricepermonth: propertyById?.data?.property?.pricePerMonth || 0,
      features: propertyById?.data?.property?.features || [],
      state: propertyById?.data?.property?.state || "",
      country: propertyById?.data?.property?.country || "",
      area: propertyById?.data?.property?.area || "",
      bedrooms: propertyById?.data?.property?.bedrooms || 0,
      // images: propertyById?.data?.images?.url,
      longitude: propertyById?.data?.property?.longitude || "",
      latitude: propertyById?.data?.property?.latitude || "",
      county: propertyById?.data?.property?.county || "",
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const propertyUpdated = await updatePropertyData(values);
        setIsLoading(false);
        if (propertyUpdated) {
          toast.success("Property data updated successfully");
        } else {
          toast.error("Failed to update property data");
        }
      } catch (error) {
        console.error("Error updating property:", error);
        setIsLoading(false);
        toast.error("Error updating property");
      }
    },
  });

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        url: URL.createObjectURL(file),
        Image: file,
      }));
      setUploadedImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleImageDelete = (
    index: number,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setFieldValue(
      "images",
      newImages.map((img) => img.url)
    );
  };

  const deleteImagefromCloud = async (
    publicid: string,
    action: "delete" | "new"
  ) => {
    const formData = new FormData();

    formData.append(
      "json",
      JSON.stringify({
        publicId: publicid,
        action: action,
        propertyId: formik.values.id,
      })
    );

    if (action == "new") {
      formattedImages.forEach((image, index) => {
        formData.append(`images`, image);
      });
    }

    const res = await updatePropertyImage(formData);
    if (res.status === 200) {
      toast.success("image deleting successfully");
      RevalidatePath(`/intime-admin/managelisting/${formik.values.id}`);
    } else {
      toast.error("Error deleting image");
    }
  };

  const handleImageUpdate = async () => {
    setIsLoading(true);
    const imagesUpdated = await updateImages(
      formik.values.id,
      uploadedImages.map((img) => img.Image)
    );
    setIsLoading(false);
    if (imagesUpdated) {
      toast.success("Images updated successfully");
    } else {
      toast.error("Failed to update images");
    }
  };
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const createNewImage = useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append(
        "json",
        JSON.stringify({
          action: "new",
          propertyId: formik.values.id,
        })
      );

      formattedImages.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const res = await updatePropertyImage(formData);
      return res;
    },
    onSuccess(data, variables, context) {
      if (data.status === 200) {
        toast.success("image deleting successfully");
        RevalidatePath(`/intime-admin/managelisting/${formik.values.id}`);
      } else {
        toast.error("Error deleting image");
      }
    },
    onError(error, variables, context) {},
  });
  

  return (
    <Card className="w- border-none shadow-none">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="flex">Edit property</CardTitle>
        <Link href="/intime-admin/managelisting" className="justify-end">
          <Button className="bg-primary500 text-white rounded-none" >Back</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === "details" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => handleTabChange("details")}
          >
            Property Details
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "images" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => handleTabChange("images")}
          >
            Images
          </button>
        </div>
        {activeTab === "details" && (
          <form
            className="md:grid gap-4 md:grid-cols-3 grid-cols-1"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Property title
              </label>
              <input
                onChange={(e) => formik.handleChange(e)}
                onBlur={formik.handleBlur}
                defaultValue={formik.values.name}
                name="name"
                type="text"
                id="name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="John"
                required
              />
              {/* {formik.errors.name && formik.touched.name && (
               <div className="text-red-500">{formik.errors.name}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="description"
                defaultValue={formik.values.description}
                id=""
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary300 focus:border-primary300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="Write your thoughts here..."
              ></textarea>

              {/* {formik.errors.description && formik.touched.description && (
               <div className="text-red-500">{formik.errors.description}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select a sale type
              </label>
              <select
                id=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="saleType"
                defaultValue={formik.values.saleType}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
              >
                <option disabled>Choose a sale type</option>
                <option value="Sale">Sale</option>
                <option value="Rent">Rental</option>
              </select>
              {/* {formik.errors.saleType && formik.touched.saleType && (
               <div className="text-red-500">{formik.errors.saleType}</div>
             )} */}
            </div>

            <hr className="my-4 md:col-span-3 col-span-1" />

            <div>
              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Property Location
              </label>
              {/* <select id="location"
                             defaultValue={formik.values.location}
 
                             name='location' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300">
                             <option selected>Choose a country</option>
                             <option value="US">United States</option>
                             <option value="CA">Canada</option>
                             <option value="FR">France</option>
                             <option value="DE">Germany</option>
                         </select> */}
              {/* <GooglePlacesAutocomplete
                             selectProps={{
                                 value,
                                 onChange: setValue,
                             }}
                             onLoadFailed={(error) => (
                                 console.error("Could not inject Google script", error)
                             )}
                             autocompletionRequest={{
                                 bounds: [
                                     { lat: 50, lng: 50 },
                                     { lat: 100, lng: 100 }
                                 ],
                                 componentRestrictions: {
                                     country: ['ke'],
                                 }
                             }}
                             apiKey='d8f480b55msh9b5c4d05232d6c8p1d2848jsn6f501098217d'
                         /> */}
              {/* {formik.errors.location && formik.touched.location && (
               <div className="text-red-500">{formik.errors.location}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Street Address
              </label>
              <input
                type="text"
                id=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="street_address"
                defaultValue={formik.values.street_address}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="234 street"
                required
              />
              {/* {formik.errors.street_address && formik.touched.street_address && (
               <div className="text-red-500">{formik.errors.street_address}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor="city"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                City
              </label>
              <input
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="city"
                defaultValue={formik.values.city}
                id=""
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="Nairobi"
                required
              />
              {/* {formik.errors.city && formik.touched.city && (
               <div className="text-red-500">{formik.errors.city}</div>
             )} */}
            </div>
            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                county
              </label>
              <input
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="county"
                defaultValue={formik.values.county}
                id=""
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="kiambu"
                required
              />
              {/* {formik.errors.county && formik.touched.county && (
               <div className="text-red-500">{formik.errors.county}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                State
              </label>
              <input
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="state"
                defaultValue={formik.values.state}
                id=""
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="kiambu"
                required
              />
              {/* {formik.errors.state && formik.touched.state && (
               <div className="text-red-500">{formik.errors.state}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor="country"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Country
              </label>
              <input
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="country"
                defaultValue={formik.values.country}
                id="country"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="Kenya"
                required
              />
              {/* {formik.errors.country && formik.touched.country && (
               <div className="text-red-500">{formik.errors.country}</div>
             )} */}
            </div>
            <div>
              <label
                htmlFor="long"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Longitude
              </label>
              {/* <select id="location"
                             defaultValue={formik.values.location}
 
                             name='location' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300">
                             <option selected>Choose a country</option>
                             <option value="US">United States</option>
                             <option value="CA">Canada</option>
                             <option value="FR">France</option>
                             <option value="DE">Germany</option>
                         </select> */}

              {/* {formik.errors.location && formik.touched.location && (
               <div className="text-red-500">{formik.errors.location}</div>
             )} */}
              <input
                type="text"
                id=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="longitude"
                defaultValue={formik.values.longitude}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder=""
                required
              />
              {/* {formik.errors.longitude && formik.touched.longitude && (
               <div className="text-red-500">{formik.errors.longitude}</div>
             )} */}
            </div>
            <div>
              <label
                htmlFor="lat"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Latitude
              </label>
              {/* <select id="location"
                             defaultValue={formik.values.location}
 
                             name='location' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300">
                             <option selected>Choose a country</option>
                             <option value="US">United States</option>
                             <option value="CA">Canada</option>
                             <option value="FR">France</option>
                             <option value="DE">Germany</option>
                         </select> */}

              {/* {formik.errors.location && formik.touched.location && (
               <div className="text-red-500">{formik.errors.location}</div>
             )} */}
              <input
                type="text"
                id=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="latitude"
                defaultValue={formik.values.latitude}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder=""
                required
              />
              {/* {formik.errors.latitude && formik.touched.latitude && (
               <div className="text-red-500">{formik.errors.latitude}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Area
              </label>
              <input
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                defaultValue={formik.values.area}
                name="area"
                id=""
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="runda"
                required
              />
              {/* {formik.errors.area && formik.touched.area && (
               <div className="text-red-500">{formik.errors.area}</div>
             )} */}
            </div>

            <hr className="my-4 col-span-3" />

            <div className="mt-6">
              <input
                id="default-checkbox"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="featured"
                defaultChecked={formik.values.featured}
                type="checkbox"
                value=""
                className="w-4 h-4  text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-primary300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-checkbox"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Featured
              </label>
            </div>

            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Select a property type
              </label>
              <select
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="propertyType"
                defaultValue={formik.values.propertyType}
                id="countries"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
              >
                <option disabled>Choose a property type</option>
                {propertytypes?.map(
                  (type: { name: string; id: number }, idx: number) => (
                    <option className="text-gray-900" value={type.id} key={idx}>
                      {type.name}
                    </option>
                  )
                )}
              </select>
              {/* {formik.errors.propertyType && formik.touched.propertyType && (
               <div className="text-red-500">{formik.errors.propertyType}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor="size"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Size
              </label>
              <input
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="size"
                defaultValue={formik.values.size}
                min={0}
                id=""
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="0"
                required
              />
              {/* {formik.errors.size && formik.touched.size && (
               <div className="text-red-500">{formik.errors.size}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor="distance"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Distance
              </label>
              <input
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="distance"
                defaultValue={formik.values.distance}
                id="distance"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="0"
                required
              />
              {/* {formik.errors.distance && formik.touched.distance && (
               <div className="text-red-500">{formik.errors.distance}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Price
              </label>
              <input
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="price"
                defaultValue={formik.values.price}
                id=""
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="0.00"
                required
              />
              {/* {formik.errors.price && formik.touched.price && (
               <div className="text-red-500">{formik.errors.price}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Price per month
              </label>
              <input
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="pricepermonth"
                defaultValue={formik.values.pricepermonth}
                id=""
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="0"
                required
              />
              {/* {formik.errors.pricepermonth && formik.touched.pricepermonth && (
               <div className="text-red-500">{formik.errors.pricepermonth}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Bedrooms
              </label>
              <input
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="bedrooms"
                defaultValue={formik.values.bedrooms}
                id=""
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                placeholder="0"
                required
              />
              {/* {formik.errors.bedrooms && formik.touched.bedrooms && (
               <div className="text-red-500">{formik.errors.bedrooms}</div>
             )} */}
            </div>

            <div>
              <label
                htmlFor=""
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Property features
              </label>

              <FeatureBadges
                features={features}
                selectedFeatures={formik.values.features}
                onFeatureToggle={function (feature: string): void {
                  if (
                    formik.values.features?.find((f: string) => f == feature)
                  ) {
                    formik.setFieldValue(
                      "features",
                      formik.values.features.filter(
                        (f: string) => f !== feature
                      )
                    );
                  } else {
                    formik.setFieldValue("features", [
                      ...formik.values.features,
                      feature,
                    ]);
                  }
                }}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Property Details"}
            </Button>
          </form>
        )}
        {activeTab === "images" && (
          <div className="space-y-4 mt-4">
            {/* Instructions for Deleting Images */}
            <div>
              <p className="text-sm text-muted-foreground my-6">
                <strong>Deleting Images:</strong> Below, you will find the
                current images associated with this property. To delete an
                image, click the &quot;Delete&ldquo; button on the image you want to
                remove. This action will permanently delete the image from the
                gallery.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {propertyById?.data?.images.map(
                  (
                    image: {
                      url: string;
                      publicId: string;
                    },
                    index: number
                  ) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-0 right-0 m-1"
                        onClick={() =>
                          deleteImagefromCloud(image.publicId, "delete")
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Instructions for Uploading Images */}
            <div>
              <p className="text-sm text-muted-foreground my-6">
                <strong>Uploading Images:</strong> Use the file input below to
                upload new images to the property gallery. You can select
                multiple files at once. After selecting the images, click the
                &quot;Update Images&ldquo; button to add them to the gallery.
              </p>
              <form
                action=""
                onSubmit={(e: FormEvent) => {
                  e.preventDefault();
                  createNewImage.mutateAsync();
                }}
                className="mt-2"
              >
                <input
                  id="images"
                  name="images"
                  type="file"
                  multiple
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary300 focus:border-primary300 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary300 dark:focus:border-primary300"
                  onChange={(event) =>
                    handleImageUpload(event, formik.setFieldValue)
                  }
                />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`Uploaded ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-0 right-0 m-1"
                        onClick={() =>
                          handleImageDelete(index, formik.setFieldValue)
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="submit"
                  className="w-full disabled:opacity-50 mt-6"
                  disabled={
                    (uploadedImages.length === 0 &&
                      formattedImages.length === 0) ||
                    createNewImage.isPending
                  }
                >
                  {createNewImage.isPending ? "Updating..." : "Update Images"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
