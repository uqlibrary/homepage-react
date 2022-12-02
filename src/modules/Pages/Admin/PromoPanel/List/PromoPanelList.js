import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { PromoPanelListGroupPanels } from './PromoPanelListGroupPanels';
import { PromoPanelListPanels } from './PromoPanelListPanels';
import { PromoPanelUtilityArea } from 'modules/Pages/Admin/PromoPanel/PromoPanelUtilityArea';
import { default as locale } from 'modules/Pages/Admin/PromoPanel/promoPanelAdmin.locale';

export const PromoPanelList = ({
    actions,
    promoPanelList,
    promoPanelUserTypeList,
    promoPanelListLoading,
    promoPanelUserTypesLoading,
    promoPanelActionError,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        // do something with the promo Panel List and the user type here.
        if (panelUpdated) {
            actions.loadPromoPanelList().then(actions.loadPromoPanelUserList());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [panelUpdated]);

    return (
        <StandardPage title="Promo panel management">
            {/* <PromoPanelListActive
                isLoading={promoPanelUserTypesLoading}
                panelList={promoPanelUserTypeList}
                title="Currently shown panels"
            /> */}
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
                title="Unallocated"
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
                title="Past Panels"
                canEdit
                canClone
                canDelete
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
    promoPanelActionError: PropTypes.object,
    promoPanelListLoading: PropTypes.bool,
    promoPanelUserTypesLoading: PropTypes.bool,
    promoPanelSaving: PropTypes.bool,
    history: PropTypes.object,
};

export default PromoPanelList;
