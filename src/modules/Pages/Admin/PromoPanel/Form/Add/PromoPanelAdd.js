import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import PromoPanelHelpDrawer from '../../PromoPanelHelpDrawer';
import { default as locale } from 'modules/Pages/Admin/PromoPanel/promopanel.locale';
import { PromoPanelForm } from 'modules/Pages/Admin/PromoPanel/Form/PromoPanelForm';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { getTimeMondayMidnightNext, getTimeSundayNextFormatted } from 'modules/Pages/Admin/dateTimeHelper';

export const PromoPanelAdd = ({
    actions,
    promoPanelList,
    promoPanelListLoading,
    promoPanelUserTypesLoading,
    promoPanelUserTypeList,
    promoPanelSaving,
    panelUpdated,
    queueLength,
    promoPanelListError,
    promoPanelUserTypesError,
    promoPanelActionError,
}) => {
    const [helpLightboxOpen, setHelpLightboxOpen] = React.useState(false);

    const openHelpLightbox = () => setHelpLightboxOpen(true);
    const closeHelpLightbox = () => setHelpLightboxOpen(false);
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
        if (!!!promoPanelListLoading && promoPanelList.length < 1) {
            actions.loadPromoPanelList();
        }
        /* istanbul ignore else */
        if (!!!promoPanelUserTypesLoading && promoPanelUserTypeList.length < 1) {
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
    }, [promoPanelUserTypeList]);

    return (
        <StandardPage title="Promo panel management">
            <Button
                children="Help"
                style={{ float: 'right', margin: 20 }}
                color="secondary"
                data-testid="admin-promoPanel-help-button"
                id="admin-spotlights-help-button"
                onClick={openHelpLightbox}
                variant="contained"
            />
            <PromoPanelHelpDrawer
                helpContent={locale.addPage.help}
                closeHelpLightbox={closeHelpLightbox}
                open={helpLightboxOpen}
            />
            {(!!promoPanelListError || !!promoPanelUserTypesError || !!promoPanelActionError) && (
                <div
                    data-testid="Promopanel-Error"
                    style={{ backgroundColor: '#933', padding: 10, textAlign: 'center', color: 'white' }}
                >
                    <p>There was an error loading data from the server. Please refresh and try again.</p>
                    <p>{promoPanelListError || promoPanelUserTypesError}</p>
                </div>
            )}
            {!!!promoPanelListError && !!!promoPanelUserTypesError && !!!promoPanelActionError && (
                <section aria-live="assertive">
                    <PromoPanelForm
                        scheduledList={[]}
                        scheduledGroupNames={[]}
                        promoPanelSaving={promoPanelSaving}
                        fullPromoPanelList={promoPanelList}
                        fullPromoPanelUserTypeList={promoPanelUserTypeList}
                        defaults={defaults}
                        actions={actions}
                        knownGroups={knownGroups}
                        panelUpdated={panelUpdated}
                        queueLength={queueLength}
                    />
                </section>
            )}
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
    queueLength: PropTypes.number,
    promoPanelListError: PropTypes.string,
    promoPanelUserTypesError: PropTypes.string,
    promoPanelActionError: PropTypes.string,
};

export default PromoPanelAdd;
