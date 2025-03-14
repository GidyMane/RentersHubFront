import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import DataTableCheckBox from "@/components/globalcomponents/DataTableCheckBox"
import { DataTableRowActions } from "../ApprovedProperties/data-table-row-actions"
import { DataTableColumnHeader } from "../ApprovedProperties/data-table-column-header"
import { ApproveUser, removefeature } from "@/actions/landlord"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"






export type Landlords = {

    id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact: string;
    role_name: { role: string; };
    username: string;
    status: string;
    terms_and_conditions: string;


}





export const columns: ColumnDef<Landlords>[] = [
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
    // {
    //     accessorKey: "pk",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Landlord ID" />
    //     ),
    //     cell: ({ row }) => <div className="w-[80px]">{row.getValue("pk")}</div>,
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        accessorKey: "first_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="First Name" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {row.getValue("first_name")}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "last_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Name" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {row.getValue("last_name")}
                    </span>
                </div>
            );
        },
    },
    // {
    //     accessorKey: "email",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Email" />
    //     ),
    //     cell: ({ row }) => {
    //         return (
    //             <div className="flex space-x-2">
    //                 <span className="max-w-[500px] truncate font-medium">
    //                     {row.getValue("email")}
    //                 </span>
    //             </div>
    //         );
    //     },
    // },
    {
        accessorKey: "contact",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="contact" />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">
                        {row.getValue("contact")}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Status" />
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
                            {row.getValue("status")}
                        </Badge>
                    </span>
                </div>
            )
        },
    },
    // {
    //     accessorKey: "description",
    //     header: ({ column }) => (
    //         <DataTableColumnHeader column={column} title="Description" />
    //     ),
    //     cell: ({ row }) => {
    //         return (
    //             <div className="flex space-x-2">
    //                 <span className="max-w-[500px] truncate font-medium">
    //                     {row.getValue("description")}
    //                 </span>
    //             </div>
    //         )
    //     },
    // },
    {
        id: "approval",
        cell: ({ row }) => {
            return (
               <>
               <ApproveButton row={row}/>
               </>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <DataTableRowActions row={row} page={"pendinglandlords"} />,
    },

]


function ApproveButton({ row }: { row: any }) {

    const approvemutation = useMutation({
        mutationFn: async (values: { id: number; approval_status: string }) => {
            const res = await ApproveUser(values)
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
                approval_status: "APPROVED"
            })



        }} className="group">
            <Button variant="outline" className="group-hover:bg-primary group-hover:cursor-pointer">{approvemutation.isPending ? <Loader className="animate animate-spin" /> : "Approve User"}</Button>

        </div>
    )
}