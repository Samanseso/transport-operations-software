import { ModalType } from '@/types';
import React, { createContext, useState, useContext, SetStateAction } from 'react';


interface ModalContextProps {
    content: ModalType | undefined;
    createModal: (data: ModalType | undefined) => void;
    
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [content, setContent] = useState<ModalType | undefined>(undefined);

    const createModal = (data: ModalType | undefined) => {
        setContent(data);
    }

    return (
        <ModalContext.Provider value={{ content: content, createModal: createModal}}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be within Modal Provider');
    return context;
}