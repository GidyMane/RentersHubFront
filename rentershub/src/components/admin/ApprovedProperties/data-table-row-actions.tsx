"use client";

import { Loader2 } from "lucide-react"; // Import Loader Icon
import { Row } from "@tanstack/react-table";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAppDispatch } from "@/store/hooks";
import { setEditData } from "@/store/slices/PropertySlice";
import { Property } from "@/app/admin/approvedproperties/columns";
import { RevalidatePath } from "@/components/globalcomponents/RevalidateCustomPath";
import { usePathname } from "next/navigation"; 
import { updateProperty } from "@/actions/properties";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  page: string;
}

export function DataTableRowActions<TData>({ row, page }: DataTableRowActionsProps<TData>) {
  const property = row.original as Property;
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  // Determine the button label dynamically
  const isCurrentlyAvailable = property.is_available;
  const actionLabel = isCurrentlyAvailable ? "Hide" : "Unhide"; // Set button text dynamically

  // Mutation function to toggle property availability
  const togglePropertyAvailability = useMutation({
    mutationFn: async () => {
      const res = await updateProperty({
        id: property.id,
        title: property.title,
        propertytype: { id: property.propertytype.id, name: property.propertytype.name },
        postedby: property.postedby,
        managed_by: property.managed_by,
        address: property.address,
        rent_price: property.rent_price,
        is_available: !isCurrentlyAvailable, // Toggle availability
      });

      console.log(res, "update property");
      return res;
    },
    onSuccess(data) {
      if (data[1] === 200) {
        toast.success(`Property ${isCurrentlyAvailable ? "hidden" : "unhidden"} successfully`);
        RevalidatePath(pathname); // Refresh UI
      } else {
        toast.error("Failed to update property status");
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {/* Edit Button */}
        <DropdownMenuItem
          onClick={() => {
            dispatch(setEditData({ data: property, page }));
          }}
          className="text-center bg-primary flex items-center justify-center text-white"
        >
          Edit
        </DropdownMenuItem>

        {/* Hide / Unhide Button with Loader (Only on /admin/approvedproperty) */}
        {pathname === "/admin/approvedproperty" && (
          <DropdownMenuItem
            onClick={() => togglePropertyAvailability.mutate()}
            className="text-center bg-orange-500 text-white flex items-center justify-center"
            disabled={togglePropertyAvailability.isPending} // Disable button while loading
          >
            {togglePropertyAvailability.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" /> // Loader icon
            ) : (
              actionLabel // "Hide" or "Unhide"
            )}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
