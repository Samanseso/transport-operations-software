import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { SquarePen, Trash2, Eye, SlidersHorizontal, UserPen } from "lucide-react";
import { useEffect, useState } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import StatusTag from "./status-tag";
import { Copy } from "lucide-react";
import { Link, router } from "@inertiajs/react";

interface DataTableProps {
	columns: string[];
	data: any[][];
	searchInput: string;
	doDelete: (id: string) => void;
	viewLink: (id: string | number) => string;
}

export function DataTable({ columns, data, searchInput, doDelete, viewLink }: DataTableProps) {

	const [filteredData, setFilteredData] = useState(data);
	const [selectedData, setSelectedData] = useState<number[]>([]);

	useEffect(() => {
		const lowerSearchInput = searchInput.toLowerCase();
		const newFilteredData = data.filter(row => {
			return row.some(item =>
				item.toString().toLowerCase().includes(lowerSearchInput)
			);
		});
		setFilteredData(newFilteredData);
	}, [data, searchInput]);

	const updatedSelectedData = (index: number) => {
		if (selectedData.includes(index)) {
			setSelectedData(selectedData => selectedData.filter(data => data !== index));
		}
		else {
			setSelectedData([...selectedData, index]);
		}
	}

	const selectAllData = (checked: CheckedState) => {
		if (checked === true) {
			setSelectedData(Array.from({ length: filteredData.length }, (_, i) => filteredData[i][0]));
		}
		else {
			setSelectedData([]);
		}
	}

	return (
		<div className="table-fixed w-full overflow-x-auto h-full">
			<table className="w-full">
				<thead>
					<tr className="bg-muted">
						<th className="rounded-l-md px-2 pt-1">
							<Checkbox onCheckedChange={(checked) => selectAllData(checked)} />
						</th>
						{columns.map((col) => (
							<th key={col} className="px-4 py-2 text-left text-sm whitespace-nowrap">
								{col}
							</th>
						))}
						<th className="rounded-r-md">Actions</th>
					</tr>
				</thead>
				<tbody>
					{filteredData.map((row, idx) => {
						return (
							<tr key={idx} className="border-b border-gray-200 hover:bg-neutral-content dark:hover:bg-white/10 whitespace-nowrap">
								<td>
									<div className="flex items-center justify-center">
										<Checkbox checked={selectedData.includes(row[0])} onCheckedChange={() => updatedSelectedData(row[0])} />
									</div>
								</td>
								{row.map((item, idx2) => {

									let renderItem = item;

									if (idx2 == 0) {
										renderItem = (
											<div className="flex items-center gap-2">
												<span>{item.split("-")[0].concat("-").concat(item.split("-")[1]).concat("...")}</span>
												<Copy size={13} />
											</div>
										);
									}
									else if (columns[idx2] == "Status") {
										renderItem = <StatusTag text={item} />;
									}
									else if (columns[idx2] == "Pickup Address" || columns[idx2] == "Dropoff Address") {
										renderItem = item.split(",").at(-4);
									}

									return (
										<td data-label={columns[idx2]} key={idx2} className="px-4 py-2 text-sm cursor-pointer"
											onClick={() => router.visit(viewLink(row[0]))}>
											
												{renderItem}
										
										</td>
									)

								})}
								<td data-label="Actions" className="px-4 text-sm">
									<div className="flex items-center lg:justify-center space-x-1">
										<Button variant="ghost" size="sm" className="text-xs">
											<UserPen className="size-4" color="black" />
										</Button>
										<Button variant="ghost" size="icon" >
											<SquarePen className="size-4 text-sky-500" />
										</Button>
										<Button variant="ghost" size="icon" onClick={() => doDelete(row[0])}>
											<Trash2 className="size-4 text-rose-500" />

										</Button>
									</div>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	);
};


