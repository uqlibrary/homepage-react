import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { PromoPanelListGroupPanels } from './PromoPanelListGroupPanels';
import { PromoPanelListPanels } from './PromoPanelListPanels';
import { PromoPanelListActive } from './PromoPanelListActive';
import { PromoPanelUtilityArea } from 'modules/Pages/Admin/PromoPanel/PromoPanelUtilityArea';
import { default as locale } from 'locale/promopanel.locale';
import { scrollToTopOfPage } from '../../Alerts/alerthelpers';

export const PromoPanelList = ({
    actions,
    promoPanelList,
    promoPanelUserTypeList,
    promoPanelActiveList,
    promoPanelListLoading,
    promoPanelUserTypesLoading,
    promoPanelActionError,
    promoPanelListError,
    promoPanelUserTypesError,
    promoPanelActiveListError,
    promoPanelActivePanelsLoading,
    history,
    panelUpdated,
    promoPanelSaving,
}) => {
    const [knownGroups, setKnownGroups] = React.useState([]);

    React.useEffect(() => {
        // do something with the promo Panel List and the user type here.
        if (promoPanelUserTypeList.length > 0) {
            const known = [];
            promoPanelUserTypeList.map(item =>
                known.push({ group: item.usergroup_group, name: item.usergroup_group_name }),
            );
            setKnownGroups(known);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [promoPanelUserTypeList]);

    useEffect(() => {
        /* istanbul ignore else */
        if (!promoPanelList || promoPanelList.length < 1) {
            actions.loadPromoPanelList();
        }
        /* istanbul ignore else */
        if (!promoPanelUserTypeList || promoPanelUserTypeList.length < 1) {
            actions.loadPromoPanelUserList();
        }
        /* istanbul ignore else */
        if (!promoPanelActiveList || promoPanelActiveList.length < 1) {
            actions.loadActivePanelList();
            // actions.getAssignedPromoPanel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        // do something with the promo Panel List and the user type here.
        /* istanbul ignore else */
        if (panelUpdated) {
            actions.loadPromoPanelList().then(actions.loadPromoPanelUserList().then(actions.loadActivePanelList()));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [panelUpdated]);

    const hasError = () => {
        /* istanbul ignore else */
        if (
            !!promoPanelListError ||
            !!promoPanelUserTypesError ||
            !!promoPanelActiveListError ||
            !!promoPanelActionError
        ) {
            scrollToTopOfPage();
            return true;
        }
        return false;
    };

    return (
        <StandardPage title="Promo panel management">
            {hasError() && (
                <div style={{ backgroundColor: '#933', padding: 10, textAlign: 'center', color: 'white' }}>
                    <p>There was an error loading data from the server. Please refresh and try again.</p>
                    <p>
                        {promoPanelListError ||
                            promoPanelUserTypesError ||
                            promoPanelActiveListError ||
                            promoPanelActionError}
                    </p>
                </div>
            )}
            <PromoPanelListActive
                isLoading={promoPanelActivePanelsLoading}
                panelList={promoPanelActiveList}
                title="Currently shown panels"
            />
            <PromoPanelUtilityArea
                actions={actions}
                helpContent={locale.listPage.help}
                history={history}
                showAddButton
            />

            {/* Panels by group */}
            <PromoPanelListGroupPanels
                actions={actions}
                isLoading={promoPanelUserTypesLoading}
                userPanelList={promoPanelUserTypeList}
                promoPanelList={promoPanelList}
                history={history}
                canEdit
                canClone
                canDelete
                promoPanelSaving={promoPanelSaving}
                knownGroups={knownGroups}
                panelError={(!!promoPanelActionError && promoPanelActionError.message) || null}
            />
            {/* Unallocated Panels */}
            <PromoPanelListPanels
                actions={actions}
                isLoading={promoPanelListLoading}
                history={history}
                panelList={promoPanelList}
                title="Unallocated panels"
                canEdit
                canClone
                canDelete
                knownGroups={knownGroups}
                panelError={(!!promoPanelActionError && promoPanelActionError.message) || null}
                showCurrent={false}
                showFilter={false}
                showPast
                hideAlloc
            />
            {/* Past Panels */}
            <PromoPanelListPanels
                actions={actions}
                isLoading={promoPanelListLoading}
                history={history}
                panelList={promoPanelList}
                title="Past panels"
                canClone
                isPastPanels
                knownGroups={knownGroups}
                panelError={(!!promoPanelActionError && promoPanelActionError.message) || null}
                showCurrent={false}
                showFilter={false}
                showPast
            />
        </StandardPage>
    );
};

PromoPanelList.propTypes = {
    actions: PropTypes.any,
    panelUpdated: PropTypes.bool,
    promoPanelList: PropTypes.array,
    promoPanelUserTypeList: PropTypes.array,
    promoPanelActiveList: PropTypes.array,
    promoPanelActionError: PropTypes.any,
    promoPanelActiveListError: PropTypes.string,
    promoPanelListLoading: PropTypes.bool,
    promoPanelUserTypesLoading: PropTypes.bool,
    promoPanelListError: PropTypes.string,
    promoPanelActivePanelsLoading: PropTypes.bool,
    promoPanelUserTypesError: PropTypes.string,
    promoPanelSaving: PropTypes.bool,
    history: PropTypes.object,
};

export default PromoPanelList;
