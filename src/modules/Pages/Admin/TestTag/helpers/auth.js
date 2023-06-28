import { PERMISSIONS } from '../config/auth';

export const getUserPermissions = (privileges = {}) => {
    if (!!!privileges || typeof privileges !== 'object' || Object.keys(privileges).length === 0) {
        return PERMISSIONS.none;
    }
    const calculatedPermission = Object.keys(privileges).reduce((accumulated, current) => {
        if (privileges[current] === 1) {
            return accumulated + PERMISSIONS[current];
        }
        return accumulated;
    }, PERMISSIONS.none);

    return calculatedPermission;
};

export const hasAccess = (userPrivilege = PERMISSIONS.none, requiredPermissions = [], inclusive = true) => {
    const shouldAllow = inclusive
        ? requiredPermissions.every(current => {
              return (userPrivilege & current) > 0;
          })
        : requiredPermissions.some(current => {
              return (userPrivilege & current) > 0;
          });
    return shouldAllow ?? false;
};
