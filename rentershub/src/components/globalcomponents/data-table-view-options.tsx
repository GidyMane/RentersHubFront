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
import { baseUrl } from "@/lib/globalvariables"
import { RevalidatePath } from "./RevalidateCustomPath"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  deleteType: "propertytype" | "feature" | "property" | "blog" | "testimonial" | "company" | "requestuser" // API endpoint type
  pathname:string;
}

export function DataTableViewOptions<TData>({
  table,
  deleteType,
  pathname
}: DataTableViewOptionsProps<TData>) {

  // console.log("Base URL:", baseUrl); // Debug log
  // console.log("Delete Type:", deleteType); // Debug log

  // Mutation for handling deletion
  const mutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map(async (id) => {
        const res = await fetch(`${baseUrl}${id}/${deleteType}`, {
          method: "DELETE",
        })
        if(res.status == 204){
          RevalidatePath(pathname)
        }
        return { id, status: res.status }
      })
      return Promise.all(promises)
    },
    onSuccess(data) {
      const failed = data.filter((result) => result.status !== 204)
      if (failed.length === 0) {
        toast.success("Data deleted successfully")
      } else {
        toast.error("Some items could not be deleted")
      }
    },
    onError() {
      toast.error("Something went wrong while deleting data")
    },
  })

  // Handle delete button click
  const handleDelete = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row:any) => row.original.id) // Assuming each row has an `id`
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
