import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import PromoPanelHelpDrawer from '../../PromoPanelHelpDrawer';
import { default as locale } from 'locale/promopanel.locale';
import { useParams } from 'react-router';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { PromoPanelForm } from 'modules/Pages/Admin/PromoPanel/Form/PromoPanelForm';
import { getTimeMondayMidnightNext, getTimeSundayNextFormatted } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

export const PromoPanelClone = ({
    actions,
    promoPanelList,
    promoPanelListLoading,
    promoPanelUserTypesLoading,
    promoPanelUserTypeList,
    history,
    panelUpdated,
    queueLength,
    promoPanelListError,
    promoPanelUserTypesError,
    promoPanelActionError,
}) => {
    const { promopanelid } = useParams();
    const [userList, setUserList] = React.useState([]);
    const [knownGroups, setKnownGroups] = React.useState([]);
    const [currentPanel, setCurrentPanel] = React.useState(null);
    const [isDefault, setIsDefault] = React.useState(false);

    const [helpLightboxOpen, setHelpLightboxOpen] = React.useState(false);

    const openHelpLightbox = () => setHelpLightboxOpen(true);
    const closeHelpLightbox = () => setHelpLightboxOpen(false);

    const defaults = {
        id: null,
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
            const userlist = [];
            setCurrentPanel(...promoPanelList.filter(item => `${item.panel_id}` === `${promopanelid}`));
            promoPanelList.map(item => {
                if (`${item.panel_id}` === `${promopanelid}`) {
                    if (item.default_panels_for.length > 0) {
                        setIsDefault(true);
                        // item.default_panels_for.map(element => {
                        //     !userlist.includes(element.usergroup_group) && userlist.push(element.usergroup_group);
                        //     schedule.push({
                        //         id: element.panel_shedule_id,
                        //         startDate: element.panel_schedule_start_time,
                        //         endDate: element.panel_schedule_end_time,
                        //         groupNames: element.usergroup_group,
                        //         existing: true,
                        //     });
                        // });
                    } else {
                        setIsDefault(false);
                        // item.panel_schedule.map(element => {
                        //     !userlist.includes(element.usergroup_group_name) &&
                        //         userlist.push(element.usergroup_group_name);
                        //     element.user_group_schedule.map(panelSchedule => {
                        //         schedule.push({
                        //             id: panelSchedule.panel_shedule_id,
                        //             startDate: panelSchedule.panel_schedule_start_time,
                        //             endDate: panelSchedule.panel_schedule_end_time,
                        //             groupNames: element.usergroup_group,
                        //             existing: true,
                        //         });
                        //     });
                        // });
                    }
                }
                setUserList(userlist);
            });
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
        <StandardPage title="Promo panel management">
            <Button
                children="Help"
                style={{ float: 'right', margin: 20 }}
                color="secondary"
                data-testid="admin-promoPanel-help-button"
                id="admin-promoPanel-help-button"
                onClick={openHelpLightbox}
                variant="contained"
            />
            <PromoPanelHelpDrawer
                helpContent={locale.clonePage.help}
                closeHelpLightbox={closeHelpLightbox}
                open={helpLightboxOpen}
            />
            {(!!promoPanelListError || !!promoPanelUserTypesError || !!promoPanelActionError) && (
                <div
                    data-testid="promo-panel-error"
                    id="promo-panel-error"
                    style={{ backgroundColor: '#933', padding: 10, textAlign: 'center', color: 'white' }}
                >
                    <p>There was an error loading data from the server. Please refresh and try again.</p>
                    <p>{promoPanelListError || promoPanelUserTypesError}</p>
                </div>
            )}
            <section aria-live="assertive">
                {!!currentPanel && (
                    <PromoPanelForm
                        scheduledList={[]}
                        scheduledGroupNames={[]}
                        fullPromoPanelList={promoPanelList}
                        fullPromoPanelUserTypeList={promoPanelUserTypeList}
                        currentPanel={currentPanel}
                        knownGroups={knownGroups}
                        defaults={defaults}
                        actions={actions}
                        history={history}
                        isEdit={false}
                        isClone
                        isDefaultPanel={false}
                        panelUpdated={panelUpdated}
                        queueLength={queueLength}
                    />
                )}
            </section>
        </StandardPage>
    );
};

PromoPanelClone.propTypes = {
    actions: PropTypes.any,
    promoPanelListLoading: PropTypes.bool,
    promoPanelUserTypesLoading: PropTypes.bool,
    promoPanelList: PropTypes.array,
    promoPanelUserTypeList: PropTypes.array,
    history: PropTypes.object,
    panelUpdated: PropTypes.bool,
    queueLength: PropTypes.number,
    promoPanelListError: PropTypes.string,
    promoPanelUserTypesError: PropTypes.string,
    promoPanelActionError: PropTypes.string,
};

export default PromoPanelClone;
