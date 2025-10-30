import React from 'react';
import { useDispatch } from 'react-redux';

import { loadUser } from 'data/actions';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { useAccountUser } from './hooks';

export const withUser = Component => props => {
    const dispatch = useDispatch();
    const { user, userLoading } = useAccountUser();

    const userLoaded = !userLoading && !!user;
    const userError = !userLoading && user === null;

    React.useEffect(() => {
        if (!userLoading && !userLoaded) {
            dispatch(loadUser());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLoading, userLoaded]);

    if (!!user?.user_uid) {
        return <Component {...props} />;
    }
    if (!!userError) {
        return <StandardPage standardPageId="authentication-required" {...locale.pages.general.accountRequired} />;
    }
    return <ContentLoader message={locale.pages.general.checkingAuth} />;
};
