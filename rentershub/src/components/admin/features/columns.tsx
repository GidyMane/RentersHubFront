import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "../../../components/admin/property/data-table-column-header"
import DataTableCheckBox from "@/components/globalcomponents/DataTableCheckBox"
import { removefeature } from "@/actions/feature"
import { DataTableRowActions } from "../property/data-table-row-actions"





export type Feature = {

    id: number;
    name: string;
    description: string;

}





export const columns: ColumnDef<Feature>[] = [
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
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Property ID" />
        ),
        cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        <Badge

                            variant="outline"
                            className={`cursor-pointer transition-colorsbg-background
                                `}
                        >
                            {row.getValue("name")}
                        </Badge>
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {row.getValue("description")}
                    </span>
                </div>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} page={"features"} />,
    },

]


