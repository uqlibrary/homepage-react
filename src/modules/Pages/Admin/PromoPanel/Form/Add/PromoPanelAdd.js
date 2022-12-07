import React from 'react';
import PropTypes from 'prop-types';
import { PromoPanelForm } from 'modules/Pages/Admin/PromoPanel/Form/PromoPanelForm';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { getTimeMondayMidnightNext, getTimeSundayNextFormatted } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

export const PromoPanelAdd = ({
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
    const defaults = {
        id: '',
        startDateDefault: getTimeMondayMidnightNext(),
        endDateDefault: getTimeSundayNextFormatted(),
        title: '',
        name: '',
        content: '',
        group: 'Public',
        admin_notes: '',
        isPreviewOpen: false,
        is_default_panel: 0,
        scheduleList: [],
        scheduledGroups: [],
    };
    const [knownGroups, setKnownGroups] = React.useState([]);

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
        // do something with the promo Panel List and the user type here.
        if (promoPanelUserTypeList.length > 0) {
            const known = [];
            promoPanelUserTypeList.map(item => {
                !known.some(e => e.group === item.usergroup_group) &&
                    known.push({ group: item.usergroup_group, name: item.usergroup_group_name });
            });
            setKnownGroups(known);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promoPanelList, promoPanelUserTypeList]);

    return (
        <StandardPage title="Promo Panel Management">
            {(!!promoPanelListError || !!promoPanelUserTypesError || !!promoPanelActionError) && (
                <div style={{ backgroundColor: '#933', padding: 10, textAlign: 'center', color: 'white' }}>
                    <p>There was an error loading data from the server. Please refresh and try again.</p>
                    <p>{promoPanelListError || promoPanelUserTypesError}</p>
                </div>
            )}
            <section aria-live="assertive">
                <PromoPanelForm
                    scheduledList={[]}
                    scheduledGroupNames={[]}
                    promoPanelSaving={promoPanelSaving}
                    fullPromoPanelList={promoPanelList}
                    fullPromoPanelUserTypeList={promoPanelUserTypeList}
                    defaults={defaults}
                    actions={actions}
                    history={history}
                    knownGroups={knownGroups}
                    panelUpdated={panelUpdated}
                    queueLength={queueLength}
                />
            </section>
        </StandardPage>
    );
};

PromoPanelAdd.propTypes = {
    panelUpdated: PropTypes.bool,
    actions: PropTypes.any,
    promoPanelSaving: PropTypes.bool,
    promoPanelList: PropTypes.array,
    promoPanelListLoading: PropTypes.bool,
    promoPanelUserTypesLoading: PropTypes.bool,
    promoPanelUserTypeList: PropTypes.array,
    history: PropTypes.object,
    queueLength: PropTypes.number,
    promoPanelListError: PropTypes.string,
    promoPanelUserTypesError: PropTypes.string,
    promoPanelActionError: PropTypes.string,
};

export default PromoPanelAdd;
