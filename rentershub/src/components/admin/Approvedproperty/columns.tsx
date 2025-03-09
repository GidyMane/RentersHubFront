import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import DataTableCheckBox from "@/components/globalcomponents/DataTableCheckBox";
import { DataTableRowActions } from "../ApprovedProperties/data-table-row-actions";
import { DataTableColumnHeader } from "../ApprovedProperties/data-table-column-header";
import { removefeature } from "@/actions/landlord";

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
  amenities: any[];
  water_charges: string;
  water_deposit: string;
  garbage_charges: string;
  security_charges: string;
  other_charges: string;
  posted_by: number;
  owners_contact: string;
  managed_by: string;
  space_types: any[];
  updated_at: string;
};

export const columns: ColumnDef<Property>[] = [
  {
    id: "select",
    header: ({ table }) => <DataTableCheckBox table={table} deletefunc={removefeature} />,
    cell: ({ row }) => <DataTableCheckBox row={row} deletefunc={removefeature} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Post Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="max-w-[500px] truncate font-medium">{row.getValue("title")}</span>
        {!row.original.is_available && <Badge variant="destructive">Hidden</Badge>} {/* Show "Hidden" badge */}
      </div>
    ),
  },
  {
    accessorKey: "propertytype.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="House Type" />,
    cell: ({ row }) => <span className="max-w-[500px] truncate font-medium">{row.original.propertytype.name || "N/A"}</span>,
  },
  {
    accessorKey: "postedby",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Posted By" />,
    cell: ({ row }) => <span className="max-w-[500px] truncate font-medium">{row.getValue("postedby")}</span>,
  },
  {
    accessorKey: "managed_by",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Managed By" />,
    cell: ({ row }) => <span className="max-w-[500px] truncate font-medium">{row.getValue("managed_by")}</span>,
  },
  {
    accessorKey: "address",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Location" />,
    cell: ({ row }) => <span className="max-w-[500px] truncate font-medium">{row.getValue("address")}</span>,
  },
  {
    accessorKey: "rent_price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rent Price" />,
    cell: ({ row }) => <span className="max-w-[500px] truncate font-medium">Ksh {row.getValue("rent_price")}</span>,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} page={"properties"} />,
  },
];
