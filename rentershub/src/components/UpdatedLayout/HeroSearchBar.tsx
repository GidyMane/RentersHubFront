"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useFormik } from "formik"
import { useState } from "react"
import { toast } from "react-hot-toast"

const houseTypes = [
  { id: "1", name: "Bedsitters" },
  { id: "2", name: "One Bedroom apartments" },
  { id: "3", name: "Two Bedroom apartments" },
  { id: "4", name: "Three Bedroom apartments" },
  { id: "5", name: "Four Bedroom apartments" },
  { id: "6", name: "Five Bedroom apartments" },
  { id: "7", name: "2BR Own Compound" },
  { id: "8", name: "3BR Own Compound" },
  { id: "9", name: "4BR Own Compound" },
  { id: "10", name: "5+BR Own Compound" },
  { id: "11", name: "Singles" },
  { id: "12", name: "Doubles" },
  { id: "13", name: "Shops" },
  { id: "14", name: "Offices" },
]

const HeroSearchBar = () => {
  const [budgetType, setBudgetType] = useState("")
  const router = useRouter()
  const searchparams = useSearchParams()
  const search = new URLSearchParams(searchparams)

  const formik = useFormik({
    initialValues: {
      propertyTypeId: "",
      location: "",
      bedrooms: "3",
      budget: "0",
      from: "",
      to: "",
      specialCondition: "",
    },
    onSubmit(values) {
      const houseExists = houseTypes.some((h) => h.id === values.propertyTypeId)

      if (!houseExists) {
        toast.error(
          "Hello. Landlords and Property Agents are yet to post such a house in that location. Please go back and search another house or a different location or contact our office for further assistance.",
        )
        return
      }

      search.set("limit", "10")
      search.set("page", "0")
      search.set(
        "filters",
        JSON.stringify({
          propertyTypeId: values.propertyTypeId,
          location: values.location,
          bedrooms: values.bedrooms,
          budget: values.from + "-" + values.to,
          specialCondition: values.specialCondition,
        }),
      )
      router.push(`/s?${search}`)
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex flex-col lg:flex-row items-end gap-4 p-4"
      >
        {/* Select House Type */}
        <div className="w-full lg:w-1/6">
          <label className="block text-sm font-semibold mb-1">House Type</label>
          <Select
            onValueChange={(value) => formik.setFieldValue("propertyTypeId", value)}
            defaultValue={formik.values.propertyTypeId}
          >
            <SelectTrigger className="w-full border border-secondary300">
              <SelectValue placeholder="Select House Type" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {houseTypes.map((house) => (
                <SelectItem key={house.id} value={house.id}>
                  {house.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Enter Location */}
        <div className="w-full lg:w-1/6">
          <label className="block text-sm font-semibold mb-1">Location</label>
          <Input
            type="text"
            placeholder="e.g. Westlands, Nairobi"
            name="location"
            value={formik.values.location}
            onChange={formik.handleChange}
            className="w-full border border-secondary300"
          />
        </div>

        {/* Max Rent Budget */}
        <div className="w-full lg:w-1/6">
          <label className="block text-sm font-semibold mb-1">Max Rent Budget</label>
          <Select onValueChange={(value) => setBudgetType(value)} defaultValue={budgetType}>
            <SelectTrigger className="w-full border border-secondary300">
              <SelectValue placeholder="Select Budget Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed Budget</SelectItem>
              <SelectItem value="dynamic">Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Budget Input Fields */}
        {budgetType === "fixed" ? (
          <div className="w-full lg:w-1/6">
            <label className="block text-sm font-semibold mb-1">Budget</label>
            <Input
              type="number"
              placeholder="Enter Amount"
              name="from"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-secondary300"
            />
          </div>
        ) : (
          budgetType === "dynamic" && (
            <>
              <div className="w-full lg:w-1/12">
                <label className="block text-sm font-semibold mb-1">From</label>
                <Input
                  type="number"
                  placeholder="Min Price"
                  name="from"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-secondary300"
                />
              </div>
              <div className="w-full lg:w-1/12">
                <label className="block text-sm font-semibold mb-1">To</label>
                <Input
                  type="number"
                  placeholder="Max Price"
                  name="to"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full border border-secondary300"
                />
              </div>
            </>
          )
        )}

        {/* Special Condition */}
        <div className="w-full lg:w-1/6">
          <label className="block text-sm font-semibold mb-1">Special Condition</label>
          <Input
            type="text"
            placeholder="e.g. With Balcony, Pet Friendly"
            name="specialCondition"
            value={formik.values.specialCondition}
            onChange={formik.handleChange}
            className="w-full border border-secondary300"
          />
        </div>

        {/* Find House Button */}
        <div className="w-full lg:w-auto">
          <Button
            type="submit"
            className="w-full lg:w-auto bg-secondary300 text-black hover:bg-primary400 rounded-md px-8 py-2"
          >
            Find House
          </Button>
        </div>
      </motion.div>
    </form>
  )
}

export default HeroSearchBar

