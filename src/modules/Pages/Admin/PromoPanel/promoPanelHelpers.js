export const filterPanelList = (panels, groups = [], filterByGroup = false) => {
    const filtered = [];
    panels.map(panel => {
        let found = false;
        if (filterByGroup) {
            console.log('CHECKING');
        }
        if (panel.default_panels_for && panel.default_panels_for.length > 0) {
            console.log('It should be filtering');
            panel.default_panels_for.map(defaultPanel => {
                console.log("Here's the loop", groups, defaultPanel);
                if (groups.includes(defaultPanel.usergroup_group)) {
                    found = true;
                }
            });
        } else {
            if (panel.panel_schedule && panel.panel_schedule.length > 0) {
                // console.log('Checking Scheduled');
                panel.panel_schedule.map(item => {
                    if (groups.includes(item.usergroup_group)) {
                        found = true;
                    }
                });
            }
        }

        // if (!!panel.user_groups && panel.user_groups.length > 0) {
        //     panel.user_groups.map(panelGroup => {
        //         if (groups.includes(panelGroup.user_group)) {
        //             found = true;
        //         }
        //     });
        // }

        if (found) filtered.push(panel);
    });
    if (filtered.length < 1 && groups.length < 1) {
        return panels;
    } else {
        return filtered;
    }
};
