"use client" // Add this to enable client-side rendering

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { usePathname } from "next/navigation" // Import usePathname for accessing the current path

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchColumn?: string
}

export function DataTableToolbar<TData>({
  table,
  searchColumn,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const pathname = usePathname() // Access the current path

  // Determine the correct deleteType based on the current path
  let deleteType: "propertytype" | "feature" | "property" | "company" | "testimonial" |"requestuser" | "blog" = "propertytype" // Default value

  if (pathname === "/intime-admin/manage-property-types") {
    deleteType = "propertytype"
  } else if (pathname === "/intime-admin/managefeatures") {
    deleteType = "feature"
  } else if (pathname === "/intime-admin/managelisting") {
    deleteType = "property"
  }else if (pathname === "/intime-admin/blogs") {
    deleteType = "blog"
  }else if(pathname === "/intime-admin/users"){
    deleteType = "company"
  }else if(pathname === "/intime-admin/requestaccess"){
    deleteType = "requestuser"
  }else if(pathname === "/intime-admin/testimonials"){
    deleteType = "testimonial"
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchColumn && (
          <Input
            placeholder={`Search ${searchColumn}...`}
            value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Pass the correct deleteType dynamically */}
      <DataTableViewOptions table={table} deleteType={deleteType} pathname={pathname} />
    </div>
  )
}
