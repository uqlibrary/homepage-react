// Generates mock dashboard site usage data for use ONLY in local testing environments. can provide a start and end date for data.

const groups = [
    'ALUMNI',
    'ATH',
    'COMMU',
    'CWPG',
    'FRYVISITOR',
    'HON',
    'HOSP',
    'ICTE',
    'LIBRARYSTAFFB',
    'REMRHD',
    'REMUG',
    'RHD',
    'STAFF',
    'UG',
    'public',
];
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function generateDashboardSiteUsageMockData(startDate, endDate) {
    const data = [];
    const current = new Date(startDate);
    while (current <= endDate) {
        const dateStr = current.toISOString().slice(0, 10);
        // 60% chance of zero usage, 20% public only, 10% public + 1 group, 10% 1 group only
        let viewersByGroup = [];
        const roll = Math.random();
        if (roll < 0.6) {
            // Zero usage
            data.push({ activity_date: dateStr, totalViews: 0, viewersByGroup: [] });
        } else if (roll < 0.8) {
            // Only public
            viewersByGroup = [{ user_group: 'public', total: randomInt(1, 15) }];
        } else if (roll < 0.9) {
            // Public + 1 group
            const group = groups[randomInt(0, groups.length - 2)];
            viewersByGroup = [
                { user_group: 'public', total: randomInt(1, 10) },
                { user_group: group, total: randomInt(1, 8) },
            ];
        } else {
            // Only 1 group
            const group = groups[randomInt(0, groups.length - 2)];
            viewersByGroup = [{ user_group: group, total: randomInt(1, 12) }];
        }
        if (viewersByGroup.length) {
            const totalViews = viewersByGroup.reduce((sum, g) => sum + g.total, 0);
            data.push({ activity_date: dateStr, totalViews, viewersByGroup });
        }
        current.setDate(current.getDate() + 1);
    }
    return data;
}
