import React from 'react';
import PropTypes from 'prop-types';

import { hasAccess } from '../../helpers/auth';
import { useAccountUser } from '../../helpers/hooks';

const AuthWrapper = ({ requiredPermissions = [], inclusive = false, fallback, children }) => {
    const { privilege } = useAccountUser();
    const shouldHaveAccess = hasAccess(privilege, requiredPermissions, inclusive);
    return shouldHaveAccess ? children : fallback ?? /* istanbul ignore next */ <></>;
};

AuthWrapper.propTypes = {
    requiredPermissions: PropTypes.array,
    fallback: PropTypes.node,
    inclusive: PropTypes.bool,
    children: PropTypes.any,
};

export default React.memo(AuthWrapper);
