"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpDown,
  LayoutGrid,
  LayoutList,
  ChevronLeft,
  ChevronRight,
  SearchIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Maximize2, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInView } from "react-intersection-observer";
import { PropertyCarousel } from "./Cards";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormik } from "formik";

export default function ViewListing({ properties, numberofpages, propertytypes }: { properties: any[]; numberofpages: number; propertytypes: any[] }) {
  const [isGridView, setIsGridView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [budgetRange, setBudgetRange] = useState([0, 100000000]);
  const [bedrooms, setBedrooms] = useState("");
  const [propertyType, setPropertyType] = useState("");


  // acces the searchparams
  const searchparams = useSearchParams()


  const url = new URLSearchParams(searchparams)
  const limit = url.get("limit")
  const page = url.get("page")

  const router = useRouter();

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };


  useEffect(() => {
    if (budgetRange) {
      formik.setFieldValue("from", budgetRange[0])
      formik.setFieldValue("to", budgetRange[1])
    }
  }, [budgetRange])


  // formik setup for filters
  // formik to handle search
  const formik = useFormik({
    initialValues: {
      saleType: "",
      location: {
        city: "",
        state: "",
        area: ""
      },
      bedrooms: "3",
      budget: "0",
      from: "",
      to: "",
      propertyTypeId: ""
    },
    // validationSchema: Yup.object().shape({
    //   saleType: Yup.string().required(),
    //   location: Yup.object().shape({
    //     area:Yup.string().required()
    //   }),
    //   bedrooms: Yup.string().required(),
    //   budget: Yup.string().required(),
    //   propertyTypeId:Yup.string().required()
    // }),
    onSubmit(values, formikHelpers) {
      // console.log(values, "dsjf;lj")
      url.set('limit', '10');
      url.set('page', '0');
      url.set('filters', JSON.stringify({
        saleType: values.saleType.charAt(0).toUpperCase() + values.saleType.slice(1),
        propertyTypeId: values.propertyTypeId,
        location: {
          area: values.location.area
        },
        bedrooms: values.bedrooms,
        budget: values.from + "-" + values.to,
      }));


      router.replace(`/listing?${url}`)



    },
  })



  const handlePageChange = (page: number) => {
    setCurrentPage(page);



    url.set("limit", "5"),

    

      url.set("page", page.toString())



    router.replace(`/listing?${url}`)

  };

  const filteredProperties = properties.filter(
    (property) =>
      property.price >= budgetRange[0] &&
      property.price <= budgetRange[1] &&
      (bedrooms === "" || property.bedrooms === parseInt(bedrooms)) &&
      (propertyType === "" || property.propertyType.name === propertyType)
  );

  return (
    <div className="container max-w-full  relative px-4 py-8 flex lg:flex-row flex-col lg:gap-10 gap-2">
      <div className="mb-8 p-6 bg-card h-fit w-[100] lg:sticky top-20 flex flex-col  rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>


        {/* Search Form */}
        <form onSubmit={formik.handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="w-full p-2 flex flex-col gap-2"
          >

            <div className="grid md:grid-cols-2 gap-2 w-full">
              <div className="col-span-1">
                <Select onValueChange={(value) => {
                  formik.setFieldValue("propertyTypeId", value)
                }} name="propertyTypeId" defaultValue={formik.values.propertyTypeId}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Looking For?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Select property type</SelectItem>
                    {propertytypes[0]?.map((p: {
                      id: number;
                      name: string;
                    }) => (
                      <SelectItem key={p.id} value={p.id.toString()} className="font-semibold cursor-pointer">{p.name}</SelectItem>
                    ))}

                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                {" "}
                <Select onValueChange={(value) => {
                  formik.setFieldValue("saleType", value)
                }} name="saleType" defaultValue={formik.values.saleType}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="For Rent/For Sale" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="font-semibold" value="rent">For Rent</SelectItem>
                    <SelectItem className="font-semibold" value="sale">For Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Select onValueChange={(value) => {
                  formik.setFieldValue("bedrooms", value)
                }} name="bedrooms" defaultValue={formik.values.bedrooms}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3 Bedrooms</SelectItem>
                    <SelectItem value="4">4+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Select onValueChange={(value) => {
                  formik.setFieldValue("location.area", value)
                }} name="location.area" defaultValue={formik.values.location.area}>
                  <SelectTrigger className="">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Runda">Runda</SelectItem>
                    <SelectItem value="Westlands">Westlands</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* <p className="my-2 text-black tracking-tight text-md text-left">
            Filter By Budget
          </p>

          <div className="w-full flex flex-1 flex-row gap-2">
            <div className="border text-center p-2 text-sm border-secondary300  hover:bg-white hover:text-secondary300 duration-300 transition-all cursor-pointer text-black tracking-tight">
              0 - 500k
            </div>
            <div className="border text-center p-2 text-sm border-secondary300  hover:bg-white hover:text-secondary300 duration-300 transition-all cursor-pointer text-black tracking-tight">
              0 - 500k
            </div>
            <div className="border text-center p-2 text-sm border-secondary300  hover:bg-white hover:text-secondary300 duration-300 transition-all cursor-pointer text-black tracking-tight">
              0 - 500k
            </div>
            <div className="border text-center p-2 text-sm border-secondary300  hover:bg-white hover:text-secondary300 duration-300 transition-all cursor-pointer text-black tracking-tight">
              0 - 500k
            </div>
          </div>
          <div className="relative w-full border border-secondary400">
            <Input
              type="text"
              placeholder="Search property by type or location"
              className="w-full h-full py-4 pl-8 tracking-tight leading-tight focus:outline-none outline-none rounded-none bg-transparent border-none text-black placeholder:text-black/40"
            />
            <SearchIcon className="absolute w-6 h-6 left-0 top-4 px-1 text-gray-400" />
          </div> */}

            <div className="flex gap-2 flex-row items-center justify-center">
              <div className="bg-secondary300 h-1 w-full"></div>
              <p className="text-md font-semibold">Or</p>
              <div className="bg-secondary300 h-1 w-full"></div>
            </div>

            <div>
              <Label htmlFor="budget-range">Custom Budget Range (Kshs)</Label>
              <Slider
                id="budget-range"
                min={0}
                max={100000000}

                step={1000000}
                value={budgetRange}
                onValueChange={setBudgetRange}
                className="mt-2"
              />
              <div className="flex justify-between mt-2">
                <Input
                  type="number"
                  value={budgetRange[0]}
                  onChange={(e) =>
                    setBudgetRange([parseInt(e.target.value), budgetRange[1]])
                  }
                  className="w-[45%]"
                />
                <Input
                  type="number"
                  value={budgetRange[1]}
                  onChange={(e) =>
                    setBudgetRange([budgetRange[0], parseInt(e.target.value)])
                  }
                  className="w-[45%]"
                />
              </div>
            </div>

            <Button type="submit" className="bg-primary400 rounded-none text-white hover:bg-[#D5C361] px-8">
              Search
            </Button>
            <Button onClick={() => {
              formik.resetForm()
              // clear search params
              url.forEach((u) => {
                url.delete(u)
              })

              url.set('limit', '200')
              url.set('page', '0')

              router.replace(`/listing?${url}`)

            }} type="button" className="text-primary400 rounded-none  bg-white/30 border hover:bg-gray-400 hover:text-white border-primary400 px-8">
              Clear filter
            </Button>

          </motion.div>
        </form>
        {/* <Filter /> */}
      </div>

      <div className="flex flex-col gap-2 w-full relative ">
        <div className="grid grid-cols-2">
          <h1 className="text-2xl font-medium">
            {properties.length} Properties
          </h1>
          <div className=" col-span-1 flex w-full items-center gap-2 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ArrowUpDown className="h-4 w-4" />
                  Default Order
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Price: Low to High</DropdownMenuItem>
                <DropdownMenuItem>Price: High to Low</DropdownMenuItem>
                <DropdownMenuItem>Newest First</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex gap-1">
              <Button
                variant={isGridView ? "secondary" : "outline"}
                size="icon"
                onClick={() => setIsGridView(true)}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={!isGridView ? "secondary" : "outline"}
                size="icon"
                onClick={() => setIsGridView(false)}
              >
                <LayoutList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
          className={`grid gap-6 w-full ${isGridView
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
            }`}
        >
          {properties.map((property) => (
            <motion.div
              key={property.id}
              variants={itemVariants}
              onClick={() => {
                // router.push(`/listing/${property.id}`)
              }}
            >
              <Card className="overflow-hidden shadow-none border-none">
                <div className="relative">
                  <PropertyCarousel
                    images={property.images.map(
                      (image: { url: any }) => image.url
                    )} // Extract URLs from images
                    propertyId={property.id}
                  />{" "}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {property.featured && (
                      <Badge className="bg-green-500">FEATURED</Badge>
                    )}
                    <Badge variant="secondary">{property.saleType}</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <div className="text-white font-bold text-xl">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "KES",
                      }).format(property.price)}{" "}
                    </div>
                  </div>
                </div>
                <Link href={`/listing/${property.id}`}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{property.name}</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.area}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {property.bedrooms && (
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          {property.bedrooms}
                        </div>
                      )}
                      {property.size && (
                        <div className="flex items-center">
                          <Maximize2 className="w-4 h-4 mr-1" />
                          {property.size}
                        </div>
                      )}
                    </div>
                    {property.propertyType && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-muted-foreground">
                          {property.propertyType.name}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(parseInt(url.get('page') as string) - 1)}
            disabled={parseInt(url.get('page') as string) === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: numberofpages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={parseInt(url.get('page') as string) === page ? "default" : "outline"}
              onClick={() => handlePageChange(page)}
              className="w-8 h-8 p-0"
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(parseInt(url.get('page') as string) + 1)}
            disabled={parseInt(url.get('page') as string) === numberofpages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
