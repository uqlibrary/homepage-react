import { PERMISSIONS } from '../config/auth';

export const getUserPermissions = (privileges = {}) => {
    if (!!!privileges || typeof privileges !== 'object' || Object.keys(privileges).length === 0) {
        return PERMISSIONS.none;
    }
    const calculatedPermission = Object.keys(privileges).reduce((accumulated, current) => {
        if (privileges[current] === 1) {
            return accumulated + PERMISSIONS[current];
        }
        return null;
    }, PERMISSIONS.none);

    return calculatedPermission;
};

export const hasAccess = (userPrivilege = PERMISSIONS.none, requiredPermissions = [], inclusive = true) => {
    const shouldAllow = requiredPermissions.reduce((accumulated, current) => {
        if (inclusive) {
            if (accumulated !== false) return (userPrivilege & current) > 0;
            return accumulated;
        }
        if (accumulated !== true) return (userPrivilege & current) > 0;
        return accumulated;
    }, null);

    return shouldAllow ?? false;
};
