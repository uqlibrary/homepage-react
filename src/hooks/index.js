/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useCallback, useEffect } from 'react';
import { useRecordContext, useAccountContext } from 'context';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const userIsAdmin = () => {
    const { account } = useAccountContext();
    return !!account.is_administrator;
};

export const userIsAuthor = () => {
    const { account } = useAccountContext();
    const { record } = useRecordContext();

    return (
        account &&
        record.fez_record_search_key_author_id &&
        !!record.fez_record_search_key_author_id.some(authors => {
            return parseInt(authors.rek_author_id, 10) === parseInt(account.aut_id, 10);
        })
    );
};

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
