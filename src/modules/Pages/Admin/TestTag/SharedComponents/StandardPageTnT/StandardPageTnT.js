import React from 'react';
import PropTypes from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { useSelector } from 'react-redux';

import { ContentLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import TestTagHeader from '../TestTagHeader/TestTagHeader';
import locale from '../../testTag.locale';

const StandardPageTnT = ({ title = '', withHeader = true, headerSubText = '', children = null, ...props } = {}) => {
    const { user } = useSelector(state => state.get('testTagUserReducer'));
    const defaultReject = !!!user || typeof user !== 'object' || Object.keys(user).length === 0 || false;
    const headerDepartmentText = React.useMemo(
        () =>
            user
                ? locale?.form?.pageSubtitle?.(
                      user?.department_display_name ??
                          /* istanbul ignore next */ user?.user_department ??
                          /* istanbul ignore next */ '',
                  )
                : /* istanbul ignore next */ '',
        [user],
    );

    return (
        <StandardPage title={title} {...props}>
            {defaultReject && <ContentLoader message="Checking" />}
            {!defaultReject && withHeader && (
                <TestTagHeader departmentText={headerDepartmentText} requiredText={headerSubText} />
            )}
            {!defaultReject && children}
        </StandardPage>
    );
};

StandardPageTnT.propTypes = {
    title: PropTypes.string,
    user: PropTypes.object,
    withHeader: PropTypes.bool,
    headerSubText: PropTypes.string,
    children: PropTypes.any,
};

export default React.memo(StandardPageTnT);
