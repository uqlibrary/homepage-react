/* eslint-disable react-hooks/rules-of-hooks */
import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useConfirmationState = () => {
    const [isOpen, setIsOpen] = useState(false);

    const showConfirmation = useCallback(() => {
        setIsOpen(true);
    }, []);

    const hideConfirmation = useCallback(() => {
        setIsOpen(false);
    }, []);

    return [isOpen, showConfirmation, hideConfirmation];
};

export const useWidth = () => {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return (
        keys.reduce((output, key) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const matches = useMediaQuery(theme.breakpoints.up(key));
            return !output && matches ? key : output;
        }, null) || 'xs'
    );
};

export function useTitle(title) {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = title;
        return () => {
            document.title = prevTitle;
        };
    });
}

// from https://stackoverflow.com/a/34425083
export function useScript(params) {
    useEffect(() => {
        const { url, fileType } = params;
        const script = document.createElement('script');

        script.src = url;
        script.type = fileType;
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [params]);
}

export const useIsMobileView = () => {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.down('md')) || false;
};

export const withIsMobileView = () => Component => props => {
    const isMobileView = useIsMobileView();
    return <Component isMobileView={isMobileView} {...props} />;
};
