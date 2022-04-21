import React from "react";
import create from "zustand";

interface Store {
    dialogs: ({id: string, dialog: React.ReactElement})[],
    addDialog: (id: string, dialog: React.ReactElement) => void,
    removeDialog: (id: string) => void,

    isLoading: boolean,
    setIsLoading: (isLoading: boolean) => void,
}

const useStore = create<Store>((set) => ({
    dialogs: [],
    addDialog: (id: string, dialog: React.ReactElement) => {
        set(state => ({
            dialogs: [...state.dialogs, {id, dialog}],
        }));
    },
    removeDialog: (id: string) => {
        set(state => ({
            dialogs: state.dialogs.filter(dialog => dialog.id !== id),
        }));
    },

    isLoading: false,
    setIsLoading: (isLoading: boolean) => {
        set({
            isLoading,
        });
    }
}));

export default useStore;