import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import { PromoPanelForm } from 'modules/Pages/Admin/PromoPanel/Form/PromoPanelForm';
import { getTimeMondayMidnightNext, getTimeSundayNextFormatted } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
import { remapScheduleList } from '../../promoPanelHelpers';

export const PromoPanelEdit = ({
    actions,
    promoPanelList,
    promoPanelListLoading,
    promoPanelUserTypesLoading,
    promoPanelUserTypeList,
    promoPanelSaving,
    history,
    panelUpdated,
    queueLength,
    promoPanelListError,
    promoPanelUserTypesError,
    promoPanelActionError,
}) => {
    const { promopanelid } = useParams();

    const [scheduleList, setScheduleList] = React.useState([]);
    const [userList, setUserList] = React.useState([]);
    const [knownGroups, setKnownGroups] = React.useState([]);
    const [currentPanel, setCurrentPanel] = React.useState(null);
    const [isDefault, setIsDefault] = React.useState(false);

    const defaults = {
        id: promopanelid,
        startDateDefault: getTimeMondayMidnightNext(),
        endDateDefault: getTimeSundayNextFormatted(),
        title: '',
        name: '',
        content: '',
        group: 'Public',
        admin_notes: '',
        isPreviewOpen: false,
        is_default_panel: isDefault,
        scheduledGroups: userList,
    };

    React.useEffect(() => {
        /* istanbul ignore else */
        if (
            !!!promoPanelListLoading &&
            !!!promoPanelUserTypesLoading &&
            (promoPanelList.length < 1 || promoPanelUserTypeList.length < 1)
        ) {
            actions.loadPromoPanelList();
            actions.loadPromoPanelUserList();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (promoPanelUserTypeList.length > 0) {
            const known = [];
            promoPanelUserTypeList.map(item => {
                !known.some(e => e.group === item.usergroup_group) &&
                    known.push({ group: item.usergroup_group, name: item.usergroup_group_name });
            });
            setKnownGroups(known);
        }

        if (promoPanelList.length > 0) {
            setCurrentPanel(...promoPanelList.filter(item => `${item.panel_id}` === `${promopanelid}`));

            const [userlist, schedulelist] = remapScheduleList(promoPanelList, promopanelid, setIsDefault);
            setUserList(userlist);
            setScheduleList(schedulelist);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promoPanelList, promoPanelUserTypeList]);

    React.useEffect(() => {
        /* istanbul ignore else */
        if (!!promoPanelList && promoPanelList.length > 0) {
            const activePanel = promoPanelList.filter(item => `${item.panel_id}` === `${promopanelid}`);
            defaults.id = activePanel.id;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promoPanelList]);
    return (
        <StandardPage title="Promo Panel Management">
            {(!!promoPanelListError || !!promoPanelUserTypesError || !!promoPanelActionError) && (
                <div style={{ backgroundColor: '#933', padding: 10, textAlign: 'center', color: 'white' }}>
                    <p>There was an error loading data from the server. Please refresh and try again.</p>
                    <p>{promoPanelListError || promoPanelUserTypesError}</p>
                </div>
            )}
            <section aria-live="assertive">
                {!!currentPanel && (
                    <PromoPanelForm
                        scheduledList={scheduleList}
                        scheduledGroupNames={userList}
                        fullPromoPanelList={promoPanelList}
                        fullPromoPanelUserTypeList={promoPanelUserTypeList}
                        currentPanel={currentPanel}
                        knownGroups={knownGroups}
                        defaults={defaults}
                        actions={actions}
                        history={history}
                        isEdit
                        promoPanelSaving={promoPanelSaving}
                        isDefaultPanel={isDefault}
                        panelUpdated={panelUpdated}
                        queueLength={queueLength}
                    />
                )}
            </section>
        </StandardPage>
    );
};

PromoPanelEdit.propTypes = {
    actions: PropTypes.any,
    promoPanelListLoading: PropTypes.bool,
    promoPanelUserTypesLoading: PropTypes.bool,
    promoPanelList: PropTypes.array,
    promoPanelUserTypeList: PropTypes.array,
    panelUpdated: PropTypes.bool,
    promoPanelSaving: PropTypes.bool,
    history: PropTypes.object,
    queueLength: PropTypes.number,
    promoPanelListError: PropTypes.string,
    promoPanelUserTypesError: PropTypes.string,
    promoPanelActionError: PropTypes.string,
};

export default PromoPanelEdit;
