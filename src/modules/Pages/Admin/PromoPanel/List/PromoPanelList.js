import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { PromoPanelListGroupPanels } from './PromoPanelListGroupPanels';
import { PromoPanelListPanels } from './PromoPanelListPanels';
import { PromoPanelListActive } from './PromoPanelListActive';
import { PromoPanelUtilityArea } from 'modules/Pages/Admin/PromoPanel/PromoPanelUtilityArea';
import { default as locale } from 'modules/Pages/Admin/PromoPanel/promopanel.locale';
import { scrollToTopOfPage } from 'helpers/general';

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

    function getApiErrorMessage() {
        /* istanbul ignore next */
        return promoPanelListError || promoPanelUserTypesError || promoPanelActiveListError || promoPanelActionError;
    }

    const hasError = () => {
        if (!!getApiErrorMessage()) {
            scrollToTopOfPage();
            return true;
        }
        return false;
    };

    return (
        <StandardPage title="Promo panel management">
            {hasError() && (
                <div
                    style={{ backgroundColor: '#933', padding: 10, textAlign: 'center', color: 'white' }}
                    data-testid="admin-promopanel-list-api-error"
                >
                    <p>There was an error loading data from the server. Please refresh and try again.</p>
                    <p>{getApiErrorMessage()}</p>
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
                showAddButton
            />

            {/* Panels by group */}
            <PromoPanelListGroupPanels
                actions={actions}
                isLoading={promoPanelUserTypesLoading}
                userPanelList={promoPanelUserTypeList}
                promoPanelList={promoPanelList}
                canEdit
                canClone
                canDelete
                promoPanelSaving={promoPanelSaving}
                knownGroups={knownGroups}
                panelError={
                    (!!promoPanelActionError && /* istanbul ignore next */ promoPanelActionError.message) || null
                }
            />
            {/* Unallocated Panels */}
            <PromoPanelListPanels
                actions={actions}
                isLoading={promoPanelListLoading}
                panelList={promoPanelList}
                title="Unallocated panels"
                canEdit
                canClone
                canDelete
                knownGroups={knownGroups}
                panelError={
                    (!!promoPanelActionError && /* istanbul ignore next */ promoPanelActionError.message) || null
                }
                showCurrent={false}
                showFilter={false}
                showPast
                hideAlloc
            />
            {/* Past Panels */}
            <PromoPanelListPanels
                actions={actions}
                isLoading={promoPanelListLoading}
                panelList={promoPanelList}
                title="Past panels"
                canClone
                isPastPanels
                knownGroups={knownGroups}
                panelError={
                    (!!promoPanelActionError && /* istanbul ignore next */ promoPanelActionError.message) || null
                }
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
};

export default PromoPanelList;
