const moment = require('moment');

export const filterPanelList = (panels, groups = [], filterByGroup = false) => {
    const filtered = [];
    console.log('filterByGroup', filterByGroup);
    panels.map(panel => {
        let found = false;
        if (filterByGroup) {
            console.log('CHECK', groups, panel.usergroup_group);
            if (groups.includes(panel.usergroup_group)) {
                found = true;
                console.log('found', groups, panel.usergroup_group_name);
            }
        } else {
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
        }

        if (found) filtered.push(panel);
    });
    if (filtered.length < 1 && groups.length < 1) {
        return panels;
    } else {
        return filtered;
    }
};

export const addSchedule = (
    displayList,
    fullPromoPanelUserTypeList,
    selectorGroupNames,
    values,
    setConfirmationMessage,
    locale,
    mode,
    actions,
) => {
    let isValid = true;
    const allocatedList = [...displayList];
    selectorGroupNames.map(item => {
        if (!!!values.is_default_panel && !!mode.validate) {
            console.log('Full Promo Panel User Type List', fullPromoPanelUserTypeList);
            fullPromoPanelUserTypeList.map(schedules => {
                if (schedules.usergroup_group === item) {
                    schedules.scheduled_panels &&
                        schedules.scheduled_panels.map(schedule => {
                            if (
                                (moment(values.start).isSameOrAfter(moment(schedule.panel_schedule_start_time)) &&
                                    moment(values.start).isSameOrBefore(moment(schedule.panel_schedule_end_time))) ||
                                (moment(schedule.panel_schedule_start_time).isSameOrAfter(moment(values.start)) &&
                                    moment(schedule.panel_schedule_start_time).isSameOrBefore(moment(values.end)))
                            ) {
                                console.log('A CONFLICT WAS FOUND');
                                setConfirmationMessage(
                                    locale.form.scheduleConflict.alert(
                                        item,
                                        schedule.panel_title,
                                        schedule.panel_schedule_start_time,
                                        schedule.panel_schedule_end_time,
                                    ),
                                );
                                isValid = false;
                            } else console.log('A CONFLICT WAS NOT FOUND');
                        });
                }
            });
        }
        if (isValid) {
            let push = true;
            if (values.is_default_panel && allocatedList.length > 0) {
                allocatedList.map(alloc => {
                    if (alloc.groupNames === item) {
                        push = false;
                    }
                });
            }
            console.log('Allocated List', allocatedList);
            if (!values.is_default_panel && allocatedList.length > 0) {
                allocatedList.map(alloc => {
                    if (
                        alloc.groupNames === item &&
                        moment(values.start).isSame(moment(alloc.startDate)) &&
                        moment(values.end).isSame(moment(alloc.endDate))
                    ) {
                        push = false;
                    } else {
                        console.log('They dont match', values.start, alloc.startDate);
                    }
                });
            }
            if (push) {
                allocatedList.push({
                    startDate: values.is_default_panel ? null : moment(values.start).format('YYYY-MM-DD HH:mm:ss'),
                    endDate: values.is_default_panel ? null : moment(values.end).format('YYYY-MM-DD HH:mm:ss'),
                    groupNames: item,
                });

                // This is where we'll add the new functionality of update per row.
                if (values.is_default_panel) {
                    if (window.confirm('are you sure?')) {
                        actions.saveDefaultUserTypePanel({ id: values.id, usergroup: item });
                    }
                    // sent to API to add default
                } else {
                    // sent to API to add schedule.
                }
            }
        }
    });
    return [isValid, allocatedList];
};
