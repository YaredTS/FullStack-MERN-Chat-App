import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

export const useGlobalErrorHandler = () => {
    const { error: chatError } = useChatStore();
    const { error: authError } = useAuthStore();

    useEffect(() => {
        if (chatError) {
            toast.error(chatError);
        }
        if (authError) {
            toast.error(authError);
        }
    }, [chatError, authError]);
};
