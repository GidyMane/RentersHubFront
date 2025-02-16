"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import InputField from "./InputField";
import SelectField from "./SelectField";
import CheckboxGroup from "./CheckboxGroup";
import FileUpload from "./FileUpload";
import { features, houseTypes, PropertyFormData } from "@/types/property";

const KENYAN_COUNTIES = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Nyeri", "Machakos", "Thika", "Meru", 
  "Kitale", "Kericho", "Naivasha", "Kakamega", "Malindi", "Garissa", "Isiolo", "Lamu", "Marsabit", 
  "Migori", "Narok", "Nyandarua", "Samburu", "Siaya", "Taita Taveta", "Tana River", "Turkana",
];

const AddPropertyForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<PropertyFormData>({ mode: "onChange" });

  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const onSubmit: SubmitHandler<PropertyFormData> = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form data:", { ...data, photos: files });
      setSubmitStatus("success");
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);

    const fileNames = uploadedFiles.map((file) => file.name); 
    setValue("photos", fileNames);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="col-span-full text-2xl font-bold mb-6 text-center text-green-600">
        Add New Property
      </h2>

      {/* Basic Details */}
      <div className="col-span-full">
        <InputField
          label="Post Title"
          name="postTitle"
          register={register}
          required
          placeholder="e.g., Two Bedroom Apartments to Let in Karatina Town"
          error={errors.postTitle}
        />
      </div>
   
      <SelectField
        label="House Type"
        name="houseType"
        options={houseTypes}
        register={register}
        required
        error={errors.houseType}
      />
      <InputField
        label="Location"
        name="location"
        register={register}
        required
        placeholder="e.g., Kabiria, Dagoretti near Fremo Hospital, Nairobi"
        error={errors.location}
      />

      <SelectField
        label="Location County"
        name="locationCounty"
        options={KENYAN_COUNTIES}
        register={register}
        required
        error={errors.locationCounty}
      />

      <InputField
        label="Managed By"
        name="managedBy"
        register={register}
        required
        placeholder="e.g., Landlord's Name or Agency's Name"
        error={errors.managedBy}
      />

      <InputField
        label="Phone Number"
        name="phoneNumber"
        register={register}
        required
        placeholder="+254"
        error={errors.phoneNumber}
      />

      {/* Pricing Details */}
      <InputField
        label="Rent Price Per Month"
        name="rentPrice"
        register={register}
        required
        type="number"
        error={errors.rentPrice}
      />
      <InputField
        label="Deposit Amount"
        name="depositAmount"
        register={register}
        required
        type="number"
        error={errors.depositAmount}
      />
      <InputField
        label="Garbage Fees"
        name="garbageFees"
        register={register}
        type="number"
      />
      <InputField
        label="Security Fees"
        name="securityFees"
        register={register}
        type="number"
      />
      <InputField
        label="Water Charges/Unit/PM"
        name="waterCharges"
        register={register}
        type="number"
      />
      <InputField
        label="Water Deposit"
        name="waterDeposit"
        register={register}
        type="number"
      />

      {/* Description */}
      <div className="col-span-full">
        <label htmlFor="propertyDescription" className="block text-sm font-medium text-gray-700 mb-1">
          Property Description
        </label>
        <textarea
          id="propertyDescription"
          {...register("propertyDescription", { required: true })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.propertyDescription ? "border-red-500" : "border-gray-300"
          }`}
          rows={5}
        ></textarea>
        {errors.propertyDescription && (
          <p className="mt-1 text-xs text-red-500">Property description is required</p>
        )}
      </div>

      {/* Features */}
      <div className="col-span-full">
        <CheckboxGroup label="Features" name="features" options={features} register={register} />
      </div>

      {/* Upload Section */}
      <div className="col-span-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photos</label>
        <FileUpload onFileUpload={handleFileUpload} files={files} />
      </div>

      {/* Submit Button */}
      <div className="col-span-full text-center">
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            !isValid || isSubmitting
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Property"}
        </button>
      </div>

      {submitStatus === "success" && (
        <p className="col-span-full mt-4 text-center text-green-600">Property submitted successfully!</p>
      )}
      {submitStatus === "error" && (
        <p className="col-span-full mt-4 text-center text-red-600">Error submitting property. Please try again.</p>
      )}
    </form>
  );
};

export default AddPropertyForm;
