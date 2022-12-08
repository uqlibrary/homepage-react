const moment = require('moment');

export const initLists = (
    scheduledList,
    scheduledGroupNames,
    values,
    isDefaultPanel,
    setValues,
    setDisplayList,
    setSelectorGroupNames,
) => {
    if (scheduledList.length > 0) {
        setValues({
            ...values,
            scheduledList: isDefaultPanel ? [] : scheduledList,
            defaultList: isDefaultPanel ? scheduledList : [],
        });
        setDisplayList(scheduledList);
    }
    if (scheduledGroupNames.length > 0) {
        setValues({
            ...values,
            scheduledGroups: scheduledGroupNames,
        });
        setSelectorGroupNames(scheduledGroupNames);

        setSelectorGroupNames([]);
    } else {
        setSelectorGroupNames([]);
    }
};

export const filterPanelList = (panels, groups = [], filterByGroup = false) => {
    const filtered = [];
    panels.map(panel => {
        let found = false;
        if (filterByGroup) {
            if (groups.includes(panel.usergroup_group)) {
                /* istanbul ignore else */
                found = true;
            }
        } else {
            if (panel.default_panels_for && panel.default_panels_for.length > 0) {
                panel.default_panels_for.map(defaultPanel => {
                    if (groups.includes(defaultPanel.usergroup_group)) {
                        /* istanbul ignore else */
                        found = true;
                    }
                });
            } else {
                if (panel.panel_schedule && panel.panel_schedule.length > 0) {
                    /* istanbul ignore else */
                    panel.panel_schedule.map(item => {
                        if (groups.includes(item.usergroup_group)) {
                            /* istanbul ignore else */
                            found = true;
                        }
                    });
                }
            }
        }

        if (found) /* istanbul ignore else */ filtered.push(panel);
    });
    if (filtered.length < 1 || !groups || groups.length < 1) {
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
            /* istanbul ignore else */
            fullPromoPanelUserTypeList.map(schedules => {
                if (schedules.usergroup_group === item) {
                    /* istanbul ignore else */
                    schedules.scheduled_panels &&
                        schedules.scheduled_panels.map(schedule => {
                            if (
                                /* istanbul ignore else */
                                (moment(values.start).isSameOrAfter(moment(schedule.panel_schedule_start_time)) &&
                                    moment(values.start).isBefore(moment(schedule.panel_schedule_end_time))) ||
                                (moment(schedule.panel_schedule_start_time).isSameOrAfter(moment(values.start)) &&
                                    moment(schedule.panel_schedule_start_time).isBefore(moment(values.end)))
                            ) {
                                console.log(
                                    'Collision',
                                    schedule.panel_schedule_start_time,
                                    schedule.panel_schedule_end_time,
                                );
                                setConfirmationMessage(
                                    locale.form.scheduleConflict.alert(
                                        item,
                                        schedule.panel_title,
                                        schedule.panel_schedule_start_time,
                                        schedule.panel_schedule_end_time,
                                    ),
                                );
                                isValid = false;
                            }
                        });
                }
            });
        }
        if (isValid) {
            /* istanbul ignore else */
            let push = true;
            if (values.is_default_panel && allocatedList.length > 0) {
                /* istanbul ignore else */
                allocatedList.map(alloc => {
                    if (alloc.groupNames === item) {
                        /* istanbul ignore else */
                        push = false;
                    }
                });
            }
            if (!values.is_default_panel && allocatedList.length > 0) {
                /* istanbul ignore else */
                allocatedList.map(alloc => {
                    if (
                        /* istanbul ignore else */
                        alloc.groupNames === item &&
                        moment(values.start).isSame(moment(alloc.startDate)) &&
                        moment(values.end).isSame(moment(alloc.endDate))
                    ) {
                        push = false;
                    }
                });
            }
            if (push) {
                /* istanbul ignore else */
                allocatedList.push({
                    startDate: values.is_default_panel ? null : moment(values.start).format('YYYY-MM-DD HH:mm:ss'),
                    endDate: values.is_default_panel ? null : moment(values.end).format('YYYY-MM-DD HH:mm:ss'),
                    groupNames: item,
                });

                actions.updateScheduleQueuelength(
                    allocatedList.filter(filter => !!!filter.existing || !!filter.dateChanged).length,
                );
            }
        }
    });
    return [isValid, allocatedList];
};

export const saveGroupDate = (idx, dateRange, displayList, setDisplayList, setIsEditingDate, actions) => {
    const newDisplayList = [...displayList];

    newDisplayList[idx].startDate = dateRange.start;
    newDisplayList[idx].endDate = dateRange.end;
    newDisplayList[idx].dateChanged = true;
    setDisplayList(newDisplayList);
    actions.updateScheduleQueuelength(
        newDisplayList.filter(filter => !!!filter.existing || !!filter.dateChanged).length,
    );
    setIsEditingDate(false);
};

export const remapScheduleList = (scheduleList, promopanelid, setIsDefault) => {
    const schedule = [];
    const userlist = [];
    scheduleList.map(item => {
        if (`${item.panel_id}` === `${promopanelid}`) {
            if (item.default_panels_for.length > 0) {
                setIsDefault(true);
                item.default_panels_for.map(element => {
                    !userlist.includes(element.usergroup_group) && userlist.push(element.usergroup_group);
                    schedule.push({
                        startDate: element.panel_schedule_start_time,
                        endDate: element.panel_schedule_end_time,
                        groupNames: element.usergroup_group,
                        existing: true,
                        dateChanged: false,
                    });
                });
            } else {
                setIsDefault(false);
                item.panel_schedule.map(element => {
                    !userlist.includes(element.usergroup_group_name) && userlist.push(element.usergroup_group_name);
                    element.user_group_schedule.map(panelSchedule => {
                        schedule.push({
                            id: panelSchedule.panel_schedule_id,
                            startDate: panelSchedule.panel_schedule_start_time,
                            endDate: panelSchedule.panel_schedule_end_time,
                            groupNames: element.usergroup_group,
                            existing: true,
                            dateChanged: false,
                        });
                    });
                });
            }
        }
    });
    return [userlist, schedule];
};
