"use client"

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { MixerHorizontalIcon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Ellipsis } from "lucide-react"
import { RevalidatePath } from "./RevalidateCustomPath"
import { baseUrl } from "@/utils/constants"
import axios from "axios"
import { useSession } from "next-auth/react"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  deleteType: "approvedlandlords" | "pendinglandlords" | "approvedgroundagents" | "pendinggroundagents" | "testimonial" | "company" | "requestuser" | "blog" | "property"// API endpoint type
  pathname: string;
}

export function DataTableViewOptions<TData>({
  table,
  deleteType,
  pathname
}: DataTableViewOptionsProps<TData>) {

  const { data: session } = useSession()

  

  let url = ""

  const accessToken = session?.user?.accessToken;
  

  // Mutation for handling deletion
  const mutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(async (id) => {
        if (session) {
          if (deleteType === "approvedlandlords" || deleteType === "pendinglandlords" || deleteType === "approvedgroundagents" || deleteType === "pendinggroundagents" ) {
            url = baseUrl + `accounts/user/${id}/delete`
          }

            else if (deleteType === "property") {
              url = baseUrl + `listing/property/${id}/`; 
          
          } else if (pathname === "/intime-admin/managelisting") {
            deleteType = "property"
          } else if (pathname === "/intime-admin/blogs") {
            deleteType = "blog"
          } else if (pathname === "/intime-admin/users") {
            deleteType = "company"
          } else if (pathname === "/intime-admin/requestaccess") {
            deleteType = "requestuser"
          } else if (pathname === "/intime-admin/testimonials") {
            deleteType = "testimonial"
          }
          const res = await axios.delete(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
           
            }
          })
          console.log(res, "delete")
          if (res.status == 200) {
            RevalidatePath(pathname)
          }
          return { id, status: res.status }
        }else{
          throw new Error("Not authorized")
        }

      })
      return Promise.all(promises)
    },

    onSuccess(data) {
      console.log(data);
    
      // Check if any item in the array has status !== 200
      const hasError = data.some((item) => item.status !== 200);
    
      if (hasError) {
        toast.error("Delete not successful");
      } else {
        toast.success("Data deleted successfully");
      }
    }
    
    
   
  })

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

  return (
    <div className="flex gap-2 items-center justify-center">
      {/* Delete Button */}
      <Button
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
      </Button>

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
