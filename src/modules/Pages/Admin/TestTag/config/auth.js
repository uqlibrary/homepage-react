export const PERMISSIONS = {
    none: 0,
    alter: 1,
    inspect: 2,
    reports: 4,
    admin: 8,
};

export const ROLES = {
    all: [PERMISSIONS.admin, PERMISSIONS.inspect, PERMISSIONS.alter, PERMISSIONS.reports],
    licensed: [PERMISSIONS.inspect, PERMISSIONS.alter, PERMISSIONS.reports],
    unlicensed: [PERMISSIONS.alter],
    manager: [PERMISSIONS.reports],
};
