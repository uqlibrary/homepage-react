import React, { useEffect } from 'react';

import PropTypes from 'prop-types';

// import Grid from '@material-ui/core/Grid';
// import { makeStyles } from '@material-ui/styles';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { PromoPanelListGroupPanels } from './PromoPanelListGroupPanels';
import { PromoPanelListPanels } from './PromoPanelListPanels';
import { PromoPanelListActive } from './PromoPanelListActive';
// import SpotlightsListAsTable from 'modules/Pages/Admin/Spotlights/List/SpotlightsListAsTable';
import { PromoPanelUtilityArea } from 'modules/Pages/Admin/PromoPanel/PromoPanelUtilityArea';
import { default as locale } from 'modules/Pages/Admin/PromoPanel/promoPanelAdmin.locale';

// import moment from 'moment';
// import {
//     isPastSpotlight,
//     isScheduledSpotlight,
//     scrollToTopOfPage,
// } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
// import SpotlightViewHistory from './SpotlightViewHistory';

// const useStyles = makeStyles(
//     theme => ({
//         pageLayout: {
//             marginBottom: 24,
//             paddingLeft: 24,
//             paddingRight: 24,
//             minHeight: '10em',
//             minWidth: '80%',
//         },
//         mobileOnly: {
//             [theme.breakpoints.up('sm')]: {
//                 display: 'none',
//             },
//             '& p': {
//                 backgroundColor: theme.palette.warning.light,
//                 color: '#000',
//                 fontWeight: 'bold',
//                 padding: 6,
//                 textAlign: 'center',
//             },
//         },
//     }),
//     { withTheme: true },
// );
export const PromoPanelList = ({
    actions,
    promoPanelList,
    promoPanelUserTypeList,
    promoPanelListLoading,
    promoPanelUserTypesLoading,
    promoPanelActionError,
    history,

    // actions, spotlights, spotlightsLoading, spotlightsError, history
}) => {
    const [knownGroups, setKnownGroups] = React.useState([]);

    React.useEffect(() => {
        // do something with the promo Panel List and the user type here.
        if (promoPanelUserTypeList.length > 0) {
            const known = [];
            console.log('PANELUSERTYPELIST', promoPanelUserTypeList);
            promoPanelUserTypeList.map(
                item =>
                    !known.includes(item.user_group) &&
                    known.push({ group: item.user_group, name: item.user_group_name }),
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
    return (
        <StandardPage title="Promo panel management">
            <PromoPanelListActive
                isLoading={promoPanelUserTypesLoading}
                panelList={promoPanelUserTypeList}
                title="Currently shown panels"
            />
            <PromoPanelUtilityArea
                actions={actions}
                helpContent={locale.listPage.help}
                history={history}
                showAddButton
            />

            <PromoPanelListGroupPanels
                actions={actions}
                isLoading={promoPanelUserTypesLoading}
                panelList={promoPanelUserTypeList}
                history={history}
                // deletePanel={deletePanel}
                title="Current and scheduled panels"
                canEdit
                canClone
                canDelete
                knownGroups={knownGroups}
                panelError={(!!promoPanelActionError && promoPanelActionError.message) || null}
            />

            <PromoPanelListPanels
                actions={actions}
                isLoading={promoPanelListLoading}
                history={history}
                panelList={promoPanelList}
                // deletePanel={deletePanel}
                title="Panel List"
                canEdit
                canClone
                canDelete
                knownGroups={knownGroups}
                panelError={(!!promoPanelActionError && promoPanelActionError.message) || null}
            />
            <h1> Past Panels Coming soon</h1>
        </StandardPage>
    );
};

PromoPanelList.propTypes = {
    actions: PropTypes.any,
    promoPanelList: PropTypes.array,
    promoPanelUserTypeList: PropTypes.array,
    promoPanelStatus: PropTypes.string,
    promoPanelListError: PropTypes.string,
    promoPanelUserTypesError: PropTypes.object,
    promoPanelActionError: PropTypes.object,
    promoPanelListLoading: PropTypes.bool,
    promoPanelUserTypesLoading: PropTypes.bool,
    history: PropTypes.object,
};

export default React.memo(PromoPanelList);
