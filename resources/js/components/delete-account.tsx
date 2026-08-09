import UserController from '@/actions/App/Http/Controllers/UserController';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { destroy } from '@/routes/users';
import { PaginationType, User } from '@/types';
import { Form, Link, router } from '@inertiajs/react';
import { SetStateAction } from 'react';

interface DeleteAccountProps {
    user_id: string;
    isOpen: boolean;
    updateTable: (newUsers: PaginationType<User[]>) => void;
    setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}


export const DeleteAccount = ({ user_id, isOpen, updateTable, setIsOpen }: DeleteAccountProps) => {
    const handleDelete = () => {
        if (!user_id) return;
        router.delete(`/users/${user_id}`, {
            onSuccess: (page) => {
                setIsOpen(false);
                if (page.props.users) {
                    updateTable(page.props.users as PaginationType<User[]>);
                }
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
                <DialogDescription>
                    Once this account is deleted, all of its associated resources and data will be permanently removed.
                </DialogDescription>

                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button type="button" variant="destructive" onClick={handleDelete}>
                        Delete User
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
