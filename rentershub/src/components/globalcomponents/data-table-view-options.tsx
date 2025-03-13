"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
<<<<<<< HEAD
  DropdownMenuLabel,  
=======
  DropdownMenuLabel,
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Ellipsis } from "lucide-react"
<<<<<<< HEAD
import { baseUrl } from "@/lib/globalvariables"
import { RevalidatePath } from "./RevalidateCustomPath"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  deleteType: "propertytype" | "feature" | "property" | "blog" | "testimonial" | "company" | "requestuser" // API endpoint type
  pathname:string;
=======
import { RevalidatePath } from "./RevalidateCustomPath"
import { baseUrl } from "@/utils/constants"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useEdgeStore } from "@/lib/edgestore"




interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  deleteType: "approvedlandlords" | "pendinglandlords" | "approvedgroundagents" | "pendinggroundagents" | "testimonial" | "company" | "requestuser" | "blog" | "property"// API endpoint type
  pathname: string;
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
}

export function DataTableViewOptions<TData>({
  table,
  deleteType,
  pathname
}: DataTableViewOptionsProps<TData>) {

<<<<<<< HEAD
  // console.log("Base URL:", baseUrl); // Debug log
  // console.log("Delete Type:", deleteType); // Debug log

  // Mutation for handling deletion
  // const mutation = useMutation({
  //   mutationFn: async (ids: string[]) => {
  //     const promises = ids.map(async (id) => {
  //       const res = await fetch(`${baseUrl}${id}/${deleteType}`, {
  //         method: "DELETE",
  //       })
  //       if(res.status == 204){
  //         RevalidatePath(pathname)
  //       }
  //       return { id, status: res.status }
  //     })
  //     return Promise.all(promises)
  //   },
  //   onSuccess(data) {
  //     const failed = data.filter((result) => result.status !== 204)
  //     if (failed.length === 0) {
  //       toast.success("Data deleted successfully")
  //     } else {
  //       toast.error("Some items could not be deleted")
  //     }
  //   },
  //   onError() {
  //     toast.error("Something went wrong while deleting data")
  //   },
  // })

  // Handle delete button click
  // const handleDelete = () => {
  //   const selectedRows = table
  //     .getSelectedRowModel()
  //     .rows.map((row:any) => row.original.id) // Assuming each row has an `id`
  //   if (selectedRows.length > 0) {
  //     mutation.mutate(selectedRows)
  //   } else {
  //     toast.error("No items selected for deletion")
  //   }
  // }
=======
  const { data: session } = useSession()
  
const { edgestore } = useEdgeStore()

  


  const accessToken = session?.user?.accessToken;
  

  // Mutation for handling deletion
  const mutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(async (id) => {
        if (!session) {
          throw new Error("Not authorized");
        }
  
        let url = "";
        let deleteImages = false;
        let imageUrls: string[] = [];
  
        if (
          deleteType === "approvedlandlords" ||
          deleteType === "pendinglandlords" ||
          deleteType === "approvedgroundagents" ||
          deleteType === "pendinggroundagents"
        ) {
          url = baseUrl + `accounts/user/${id}/delete`;
        } else if (deleteType === "property") {
          url = baseUrl + `listing/property/${id}/`;
  
          // Fetch property details to get image URLs
          const propertyRes = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
  
          if (propertyRes.status === 200) {
            const property = propertyRes.data;
            imageUrls = [
              property.main_image_url?.url,
              ...property.images.map((img: { url: string }) => img.url),
            ].filter(Boolean);
            deleteImages = true;
          }
        }
  
        // Delete property or user
        const res = await axios.delete(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        // console.log(res, "delete");
  
        // Delete images if deleting a property
        if (deleteImages && res.status === 204) {
          await Promise.all(
            imageUrls.map((urlToDelete) =>
              edgestore.publicFiles.delete({ url: urlToDelete })
            )
          );
        }
  
        // Revalidate only if status is 200 or 204
        if (res.status === 200 || res.status === 204) {
          RevalidatePath(pathname);
        }
  
        return { id, status: res.status };
      });
  
      return Promise.all(promises);
    },
  
    onSuccess(data) {
      console.log(data);
  
      const hasError = data.some((item) => item.status !== 200 && item.status !== 204);
  
      if (hasError) {
        toast.error("Delete not successful");
      } else {
        const deletedProperty = data.some((item) => item.status === 204);
        const deletedUser = data.some((item) => item.status === 200);
  
        if (deletedProperty) {
          toast.success("Property was deleted successfully");
        }
        if (deletedUser) {
          toast.success("User was deleted successfully");
        }
      }
    },
  });
  
  

  // Handle delete button click
  const handleDelete = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row: any) => row.original.id) // Assuming each row has an `id`
    if (selectedRows.length > 0) {
      mutation.mutate(selectedRows)
    } else {
      toast.error("No items selected for deletion")
    }
  }
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6

  return (
    <div className="flex gap-2 items-center justify-center">
      {/* Delete Button */}
<<<<<<< HEAD
      {/* <Button
=======
      <Button
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
        onClick={handleDelete}
        disabled={
          (!table.getIsSomeRowsSelected() &&
            !table.getIsAllPageRowsSelected()) ||
          mutation.isPending
        }
        className="bg-red-700 cursor-pointer text-white"
      >
        {mutation.isPending ? (
          <Ellipsis className="animate animate-spin" />
        ) : (
          "Delete"
        )}
<<<<<<< HEAD
      </Button> */}
=======
      </Button>
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
