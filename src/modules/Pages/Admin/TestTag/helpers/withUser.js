import React from 'react';
import { loadUser } from 'data/actions';
import { useDispatch, useSelector } from 'react-redux';
import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import locale from '../testTag.locale';

export const withUser = Component => props => {
    const dispatch = useDispatch();
    const { userLoading, userLoaded, userError, user } = useSelector(state => state.get('testTagUserReducer'));

    React.useEffect(() => {
        if (!userLoading && !userLoaded && !userError) {
            dispatch(loadUser());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLoading, userLoaded, userError]);

    if (!!user?.user_uid) return <Component {...props} />;
    else {
        if (userLoaded || !!userError) {
            return <StandardPage standardPageId="authentication-required" {...locale.pages.general.accountRequired} />;
        } else return <ContentLoader message={locale.pages.general.checkingAuth} />;
    }
};
