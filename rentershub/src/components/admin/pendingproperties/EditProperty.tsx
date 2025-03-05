"use client"

import { updateProperty } from "@/actions/properties"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { clearEditData } from "@/store/slices/PropertySlice"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import {
  ArrowLeft,
  Building,
  Check,
  Home,
  ImageIcon,
  ListChecks,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useForm, type ControllerRenderProps } from "react-hook-form"
import { toast } from "react-hot-toast"
import * as z from "zod"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PropertyImage {
  id: string
  url: string
}

interface PropertyFeature {
  id: number
  name: string
  propertytype: string | null
}

// Form validation schema
const formSchema = z.object({
  id: z.number(),
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  propertytype: z.object({
    id: z.number(),
    name: z.string(),
  }),
  postedby: z.string().min(2, { message: "Posted by is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  rent_price: z.string().min(1, { message: "Rent price is required" }),
  managed_by: z.string().min(2, { message: "Managed by is required" }),
  water_charges: z.string().optional(),
  main_image_url: z.object({
    id: z.string(),
    url: z.string(),
  }),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
    }),
  ),
  property_features: z.array(
    z.object({
      id: z.number().optional(),
      name: z.string(),
      propertytype: z.string().nullable(),
    }),
  ),
})

type FormValues = z.infer<typeof formSchema>

const EditProperty = () => {
  const editdata = useAppSelector((state) => state.property.editdata)
  const dispatch = useAppDispatch()
  const [newFeature, setNewFeature] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      title: "",
      propertytype: { id: 0, name: "" },
      postedby: "",
      price: "",
      address: "",
      rent_price: "",
      managed_by: "",
      water_charges: "",
      main_image_url: { id: "", url: "" },
      images: [],
      property_features: [],
    },
  })

  // Update form when edit data changes
  useEffect(() => {
    if (editdata) {
      form.reset({
        id: editdata.id,
        title: editdata.title,
        propertytype: { id: editdata.propertytype.id, name: editdata.propertytype.name },
        postedby: editdata.postedby,
        price: editdata.price,
        address: editdata.address,
        rent_price: editdata.rent_price,
        managed_by: editdata.managed_by,
        water_charges: editdata.water_charges || "",
        main_image_url: editdata.main_image_url,
        images: editdata.images || [],
        property_features: editdata.property_features || [],
      })
    }
  }, [editdata, form])

  // Track form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      setHasUnsavedChanges(true)
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Handle form submission
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await updateProperty(values)
      return res
    },
    onSuccess(data) {
      if (data[1] === 200) {
        toast.success("Property updated successfully")
        setHasUnsavedChanges(false)
        dispatch(clearEditData())
      } else {
        toast.error("Something went wrong!")
      }
    },
    onError(error: Error) {
      toast.error(error.message)
    },
  })

  // Handle adding a new feature
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [
        ...form.getValues().property_features,
        {
          id: Math.floor(Math.random() * -1000), // Temporary negative ID for new features
          name: newFeature,
          propertytype: null,
        },
      ]
      form.setValue("property_features", updatedFeatures)
      setNewFeature("")
      setHasUnsavedChanges(true)
    }
  }

  // Handle removing a feature
  const handleRemoveFeature = (index: number) => {
    const features = [...form.getValues().property_features]
    features.splice(index, 1)
    form.setValue("property_features", features)
    setHasUnsavedChanges(true)
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl sm:text-2xl font-bold">Edit Property</CardTitle>
          <CardDescription>Update property information</CardDescription>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard changes?</AlertDialogTitle>
                <AlertDialogDescription>
                  You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => dispatch(clearEditData())}>Discard changes</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={form.handleSubmit((data) => mutation.mutateAsync(data))}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="details" className="flex-1">
              <div className="flex items-center justify-center gap-2">
                <Home className="h-4 w-4" />
                <span>Details</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex-1">
              <div className="flex items-center justify-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span>Images</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex-1">
              <div className="flex items-center justify-center gap-2">
                <ListChecks className="h-4 w-4" />
                <span>Features</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutateAsync(data))}>
              <TabsContent value="details" className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }: { field: ControllerRenderProps<FormValues, "title"> }) => (
                      <FormItem>
                        <FormLabel>Property Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter property title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propertytype.name"
                    render={({ field }: { field: ControllerRenderProps<FormValues, "propertytype.name"> }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2 h-10 w-full rounded-md border border-input bg-gray-100 px-3 py-2 text-sm">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span>{field.value}</span>
                          </div>
                        </FormControl>
                        <FormDescription>Property type cannot be changed</FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postedby"
                    render={({ field }: { field: ControllerRenderProps<FormValues, "postedby"> }) => (
                      <FormItem>
                        <FormLabel>Posted By</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="managed_by"
                    render={({ field }: { field: ControllerRenderProps<FormValues, "managed_by"> }) => (
                      <FormItem>
                        <FormLabel>Managed By</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter manager name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }: { field: ControllerRenderProps<FormValues, "address"> }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter property address"
                            className="resize-none min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }: { field: ControllerRenderProps<FormValues, "price"> }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rent_price"
                    render={({ field }: { field: ControllerRenderProps<FormValues, "rent_price"> }) => (
                      <FormItem>
                        <FormLabel>Rent Price</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter rent price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="water_charges"
                    render={({ field }: { field: ControllerRenderProps<FormValues, "water_charges"> }) => (
                      <FormItem>
                        <FormLabel>Water Charges</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter water charges" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

             
              <TabsContent value="images" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Main Image</h3>
                    {form.getValues().main_image_url?.url ? (
                      <div className="relative group rounded-lg overflow-hidden border border-border">
                        <img
                          src={form.getValues().main_image_url.url || "/placeholder.svg"}
                          alt="Main property image"
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="secondary" size="sm" className="mr-2">
                            <Pencil className="h-4 w-4 mr-1" />
                            Change
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-muted rounded-lg border border-dashed border-border">
                        <div className="text-center">
                          <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">No main image available</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Plus className="h-4 w-4 mr-1" />
                            Add Image
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">Additional Images</h3>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Image
                      </Button>
                    </div>

                    {form.getValues().images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {form.getValues().images.map((image, index) => (
                          <div
                            key={image.id}
                            className="relative group rounded-lg overflow-hidden border border-border"
                          >
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-32 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button variant="destructive" size="icon" className="h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-muted rounded-lg border border-dashed border-border">
                        <p className="text-sm text-muted-foreground">No additional images available</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4 pt-2">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Add a new feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddFeature()
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleAddFeature}
                      disabled={!newFeature.trim()}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Feature
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium mb-2">Property Features</h3>
                    {form.getValues().property_features.length > 0 ? (
                      <div className="border rounded-md divide-y">
                        {form.getValues().property_features.map((feature, index) => (
                          <div
                            key={feature.id || index}
                            className="flex items-center justify-between p-3 hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm">{feature.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFeature(index)}
                              className="h-8 w-8 rounded-full p-0"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remove {feature.name}</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-24 bg-muted rounded-lg border border-dashed border-border">
                        <p className="text-sm text-muted-foreground">
                          No features available. Add some features to highlight this property.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default EditProperty

