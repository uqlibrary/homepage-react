import { PERMISSIONS } from '../config/auth';

export const translateKeyToPermission = key =>
    key
        .split('_')
        .pop()
        .toLowerCase();

export const getUserPermissions = (privileges = {}) => {
    if (!!!privileges || typeof privileges !== 'object' || Object.keys(privileges).length === 0) {
        return PERMISSIONS.none;
    }
    const calculatedPermission = Object.keys(privileges).reduce((accumulated, current) => {
        console.log(privileges, current, privileges[current]);
        if (privileges[current] === 1) {
            const permissionLabel = translateKeyToPermission(current);
            return accumulated + PERMISSIONS[permissionLabel];
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
