import { MenuItem } from "@headlessui/react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { CheckboxItem } from "@radix-ui/react-dropdown-menu";
import { Label } from '@/components/ui/label';
import React from "react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronsUpDown } from "lucide-react";


interface ColumnsMenuProps {
    columns: string[];
    visibleColumns: number[];
    setVisibleColumns: React.Dispatch<React.SetStateAction<number[]>>;
}

export function ColumnsMenu({ columns, visibleColumns, setVisibleColumns }: ColumnsMenuProps) {

    return (

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' className="text-xs">
                    Columns
                    <ChevronsUpDown className="size-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-45 mt-1 p-2 rounded-xl border border-slate-200 bg-white p-3 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                align='start'
            >
                {columns.map((column, index) => {
                    return (
                        <div key={index} className="flex items-center space-x-2 my-2.5">
                            <Checkbox
                                disabled={index <= 0}
                                id={column}
                                name={column}
                                defaultChecked={visibleColumns.includes(index)}
                                onClick={() => {
                                    setVisibleColumns((prev) => {
                                        if (prev.includes(index)) {
                                            return prev.filter(colIndex => colIndex !== index);
                                        } else {
                                            return [...prev, index];
                                        }
                                    });
                                }}
                            />
                            <Label htmlFor={column} className="text-nowrap text-xs text-slate-700 dark:text-slate-200 cursor-pointer">{column}</Label>
                        </div>

                    )

                })}

            </DropdownMenuContent>
        </DropdownMenu >

    );
} 