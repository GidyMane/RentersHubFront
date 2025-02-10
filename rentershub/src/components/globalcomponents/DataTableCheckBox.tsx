import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Table, Row } from "@tanstack/react-table";
import { useAppDispatch } from "@/store/hooks";
import { clearDelete, setDeleteData } from "@/store/slices/DataTableSlice";
import { useMutation } from "@tanstack/react-query";

type DataTableCheckBoxProps<T> = {
    table?: Table<T>;
    row?: Row<T>;
    deletefunc?:any;
};

const DataTableCheckBox = <T,>({ table, row, deletefunc }: DataTableCheckBoxProps<T>) => {
    
    const dispatch = useAppDispatch()
    let selecteddata = table?.getSelectedRowModel().rows.flatMap((row: any) => {
        return row.original?.id
    })

    const handleDelete = () => {
        if (table?.getIsAllPageRowsSelected() || table?.getIsSomeRowsSelected()) {
            dispatch(setDeleteData({
                deletedata:selecteddata,
                deletefunc
            }))
        } else {
            dispatch(clearDelete())
        }
    }

    
    return (
        <>
            {table ? (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value)
                        handleDelete()

                    }}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ) : row ? (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value)
                        handleDelete()
                    
                    }}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ) : null}
        </>
    );
};

export default DataTableCheckBox;
