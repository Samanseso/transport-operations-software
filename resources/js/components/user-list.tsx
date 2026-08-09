import { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { SlidersHorizontal, Plus } from "lucide-react";

import { Button } from "./ui/button";
import { DataTable } from "@/components/data-table";
import { ColumnsMenu } from "./columns-menu";
import { PaginationType } from "@/types";
import { type User } from "@/types";
import '../bootstrap';
import CreateUserModal from "./create-user-modal";
import UserViewModal from "./user-view-modal";
import { Input } from "./ui/input";
import { DeleteAccount } from "./delete-account";

const columns = [
    "ID",
    "Name",
    "Email",
    "Created At",
    "Updated At",
];

const defaultColumns = [0, 1, 2, 3, 4];

export default function UserList() {
    const { props } = usePage<{ users: PaginationType<User[]>; filters?: { q?: string } }>();


    const [users, setUsers] = useState<User[]>(props.users.data);
    const [open, setOpen] = useState(false);
    const [viewModalId, setViewModalId] = useState<string | number | null>(null);

    const sessionKey = "visibleUserColumns";
    const stored = JSON.parse(sessionStorage.getItem(sessionKey) || "[]");
    const initialVisible = Array.isArray(stored) && stored.length > 0 ? stored : defaultColumns;

    const [visibleColumns, setVisibleColumns] = useState<number[]>(initialVisible);

    const [searchInput, setSearchInput] = useState(props.filters?.q ?? "");

    useEffect(() => {
        setUsers(props.users.data);
    }, [props.users]);

    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

    const doDelete = (id: string) => {
        setIsOpenDeleteModal(true);
        setSelectedUserId(id);
    };

    const updateTable = (newUsers: PaginationType<User[]>) => {
        setUsers(newUsers.data);
    };

    useEffect(() => {
        sessionStorage.setItem(sessionKey, JSON.stringify(visibleColumns));
    }, [visibleColumns]);

    const applyFilters = (event: React.FormEvent) => {
        event.preventDefault();
        router.get(window.location.pathname, {
            q: searchInput || undefined,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchInput("");
        router.get(window.location.pathname, {}, { replace: true });
    };

    const tableData = users
        .map((u) => Object.values(u))
        .map((row) => row.filter((_, idx) => visibleColumns.includes(idx)))
        .map((row) => row.map((cell) => (cell === null ? "" : String(cell))));

    return (
        <div>
            <div className="justify-between flex items-center py-3 px-0 rounded-t-lg mb-1">
                <p className="font-bold text-sm"></p>
                <form onSubmit={applyFilters} className="flex items-end gap-2.5">
                    <div className="w-56">
                        <Input
                            type="text"
                            placeholder="Search name, email, id"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                    <div className="hidden md:block">
                        <ColumnsMenu
                            columns={columns}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />
                    </div>

                    <Button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="bg-sky-600 font-semibold text-white transition-all hover:bg-sky-700 active:scale-[0.98]"
                    >
                        <Plus className="h-4 w-4" />
                        New User
                    </Button>
                </form>
            </div>

            <DataTable
                columns={columns.filter((_, index) => visibleColumns.includes(index))}
                data={tableData}
                searchInput={searchInput}
                doDelete={doDelete}
                setViewModalId={setViewModalId}
            // viewLink={(id) => retrieveUser.url({ user_id: id })}
            />

            {/* <Pagination data={props.users} /> */}

            {viewModalId && <UserViewModal viewModalId={viewModalId} setViewModalId={setViewModalId} />}


            {open && <CreateUserModal setOpen={setOpen} />}
            <DeleteAccount
                user_id={selectedUserId}
                isOpen={isOpenDeleteModal}
                setIsOpen={setIsOpenDeleteModal}
                updateTable={updateTable}
            />
            
        </div>
    );
}
