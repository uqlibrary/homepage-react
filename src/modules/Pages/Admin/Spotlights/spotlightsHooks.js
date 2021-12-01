/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useCallback } from 'react';

export const useViewByHistoryLightboxState = () => {
    const [isViewByHistoryLightboxOpen, setViewByHistoryLightboxOpen] = useState(false);

    const handleViewByHistoryLightboxOpen = useCallback(() => {
        setViewByHistoryLightboxOpen(true);
    }, []);

    const handleViewByHistoryLightboxClose = useCallback(() => {
        setViewByHistoryLightboxOpen(false);
    }, []);

    return [isViewByHistoryLightboxOpen, handleViewByHistoryLightboxOpen, handleViewByHistoryLightboxClose];
};
