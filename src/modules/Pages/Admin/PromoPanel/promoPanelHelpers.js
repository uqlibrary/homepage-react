export const filterPanelList = (panels, groups = []) => {
    const filtered = [];
    panels.map(panel => {
        let found = false;
        if (!!panel.user_groups && panel.user_groups.length > 0) {
            panel.user_groups.map(panelGroup => {
                if (groups.includes(panelGroup.user_group)) {
                    found = true;
                }
            });
        }
        if (found) filtered.push(panel);
    });
    if (filtered.length < 1 && groups.length < 1) {
        return panels;
    } else {
        return filtered;
    }
};
