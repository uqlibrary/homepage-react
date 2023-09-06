export const PERMISSIONS = {
    none: 0,
    can_alter: 1,
    can_inspect: 2,
    can_see_reports: 4,
    can_admin: 8,
};

export const ROLES = {
    all: [PERMISSIONS.can_admin, PERMISSIONS.can_inspect, PERMISSIONS.can_alter, PERMISSIONS.can_see_reports],
    licensed: [PERMISSIONS.can_inspect, PERMISSIONS.can_alter, PERMISSIONS.can_see_reports],
    unlicensed: [PERMISSIONS.can_alter],
    manager: [PERMISSIONS.can_see_reports],
};
