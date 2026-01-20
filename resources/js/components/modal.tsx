
import { ModalType } from "@/types";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { useState, useEffect } from "react";
import { useModal } from "./context/modal-context";

interface ModalProps {
    content: ModalType | undefined;
}

export function Modal ({ content }: ModalProps) {
    const [open, setOpen] = useState(content?.open ?? false);

    useEffect(() => {
        setOpen(content?.open ?? false);
    }, [content?.open]);

    const { createModal } = useModal();

    const onModalClose = (open: boolean) => {
        if (!open) {
            createModal(undefined)
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={open => onModalClose(open)} modal={true}>
            <DialogContent>
                <DialogTitle>{content?.title}</DialogTitle>
                <DialogDescription>
                   {content?.message}
                </DialogDescription>
                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="default" onClick={() => onModalClose(false)} asChild>
                                <button>Okay</button>
                            </Button>
                        </DialogClose>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}