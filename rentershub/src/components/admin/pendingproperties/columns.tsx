import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import DataTableCheckBox from "@/components/globalcomponents/DataTableCheckBox"
import { DataTableRowActions } from "../ApprovedProperties/data-table-row-actions"
import { DataTableColumnHeader } from "../ApprovedProperties/data-table-column-header"
import { removefeature } from "@/actions/landlord"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { ApproveProperty } from "@/actions/properties"






export type Property = {


    id: number;
    title: string;
    propertytype: {
        id: number;
        name: string;
    };
    postedby: string;
    price: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    address: string;
    location: string; // SRID-based format
    location_coords: [number, number]; // [longitude, latitude]
    size: number;
    bedrooms: number;
    bathrooms: number;
    parking_spaces: number;
    is_available: boolean;
    is_approved: boolean;
    featured: boolean;
    rent_price: string;
    deposit_amount: string;
    main_image_url: {
        id: string;
        url: string;
    };
    images: {
        id: string;
        url: string;
    }[];
    features: {
        id: number;
        name: string;
        propertytype: string | null;
    }[];
    amenities: any[]; // Adjust if amenities have a known structure
    water_charges: string;
    water_deposit: string;
    garbage_charges: string;
    security_charges: string;
    other_charges: string;
    posted_by: number;
    owners_contact: string;
    managed_by: string;
    space_types: any[]; // Adjust if space_types have a known structure
    updated_at: string; // ISO timestamp
}


export const columns: ColumnDef<Property>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <DataTableCheckBox table={table} deletefunc={removefeature} />
        ),
        cell: ({ row }) => (
            <DataTableCheckBox row={row} deletefunc={removefeature} />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Post Name" />
        ),
        cell: ({ row }) => (
            <span className="max-w-[500px] truncate font-medium">
                {row.getValue("title")}
            </span>
        ),
    },
    {
        accessorKey: "propertytype.name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="House Type" />
        ),
        cell: ({ row }) => (
            <span className="max-w-[500px] truncate font-medium">
                {row.original.propertytype.name || "N/A"}
            </span>
        ),
    },
    {
        accessorKey: "postedby",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Posted By" />
        ),
        cell: ({ row }) => (
            <span className="max-w-[500px] truncate font-medium">
                {row.getValue("postedby")}
            </span>
        ),
    },
    {
        accessorKey: "managed_by",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Managed By" />
        ),
        cell: ({ row }) => (
            <span className="max-w-[500px] truncate font-medium">
                {row.getValue("managed_by")}
            </span>
        ),
    },
    {
        accessorKey: "address",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Location" />
        ),
        cell: ({ row }) => (
            <span className="max-w-[500px] truncate font-medium">
                {row.getValue("address")}
            </span>
        ),
    },
    {
        accessorKey: "rent_price",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Rent Price" />
        ),
        cell: ({ row }) => (
            <span className="max-w-[500px] truncate font-medium">
                Ksh {row.getValue("rent_price")}
            </span>
        ),
    },
    {
        id: "approval",
        cell: ({ row }) => {
            return (
                <>
                    <ApproveButton row={row} />
                </>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} page={"properties"} />,
    },
];



function ApproveButton({ row }: { row: any }) {

    const approvemutation = useMutation({
        mutationFn: async (values: { id: number; is_approved: boolean }) => {
            const res = await ApproveProperty(values)
            return res
        },
        onSuccess(data, variables, context) {
            if (data[1] == 200) {
                toast.success("Approved Successfully")

            } else {
                toast.error("Something went wrong try again")
            }
        },
    })

    return (
        <div onClick={async () => {
            approvemutation.mutateAsync({
                id: row.original.id as number,
                is_approved: true
            })



        }} className="group">
            <Button variant="outline" className="group-hover:bg-primary group-hover:cursor-pointer">{approvemutation.isPending ? <Loader className="animate animate-spin" /> : "Approve User"}</Button>

        </div>
    )
}