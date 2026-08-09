
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
        setOpen(Boolean(content?.open && content?.status));
    }, [content]);

    const { createModal } = useModal();

    const onModalClose = (isOpen: boolean) => {
        if (!isOpen) {
            createModal(undefined);
            setOpen(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onModalClose} modal={true}>
            <DialogContent>
                <DialogTitle>{content?.title}</DialogTitle>
                <DialogDescription>
                   {content?.message}
                </DialogDescription>
                <DialogFooter className="gap-2">
                    <Button type="button" variant="default" onClick={() => onModalClose(false)}>
                        Okay
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}