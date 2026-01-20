import ReservationController from '@/actions/App/Http/Controllers/ReservationController';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PaginationType, Reservation } from '@/types';
import { Form } from '@inertiajs/react';
import { SetStateAction } from 'react';

interface DeleteReservationProps {
    reservation_id: string;
    isOpen: boolean;
    updateTable: (newReservation: PaginationType<Reservation[]>) => void;
    setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}


export const DeleteReservation = ({ reservation_id, isOpen, updateTable, setIsOpen }: DeleteReservationProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogTitle>Are you sure you want to delete this reservation?</DialogTitle>
                <DialogDescription>
                    Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password
                    to confirm you would like to permanently delete your account.
                </DialogDescription>

                <Form
                    {...ReservationController.destroy.form(reservation_id)}
                    options={{
                        preserveScroll: true,
                    }}
                    onSuccess={(page) => {
                        setIsOpen(false);
                        updateTable(page.props.reservations as PaginationType<Reservation[]> );
                    }}
                    onFinish={(page) => {
                        
                    }}
                    resetOnSuccess
                    className="space-y-6"
                >
                    {({ resetAndClearErrors, processing, errors }) => (
                        <>
                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button variant="secondary" onClick={() => resetAndClearErrors()}>
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button variant="destructive" disabled={processing} asChild>
                                    <button type="submit">Delete reservation</button>
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>

    );
}
