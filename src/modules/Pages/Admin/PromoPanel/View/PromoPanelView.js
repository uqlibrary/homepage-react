import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
// import { useParams } from 'react-router';

// import Button from '@material-ui/core/Button';
// import FormControl from '@material-ui/core/FormControl';
// import Grid from '@material-ui/core/Grid';
// import InputLabel from '@material-ui/core/InputLabel';
// import Input from '@material-ui/core/Input';

// import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
// import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { PromoPanelUtilityArea } from 'modules/Pages/Admin/PromoPanel/PromoPanelUtilityArea';
import { default as locale } from 'locale/promopanel.locale';
// import { formatDate, scrollToTopOfPage } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

export const PromoPanelView = ({
    actions,
    // actions, spotlight, spotlightStatus, history
}) => {
    // const { spotlightid } = useParams();

    // React.useEffect(() => {
    //     /* istanbul ignore else */
    //     if (!!spotlightid) {
    //         actions.loadASpotlight(spotlightid);
    //         scrollToTopOfPage();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [spotlightid]);

    // if (spotlightStatus === 'loading') {
    //     return (
    //         <div style={{ minHeight: 600 }}>
    //             <InlineLoader message="Loading" />
    //         </div>
    //     );
    // }

    // const navigateToListPage = () => {
    //     actions.clearASpotlight(); // make the form clear for the next use

    //     history.push('/admin/spotlights');

    //     scrollToTopOfPage();
    // };

    /* istanbul ignore next */
    // const navigateToCloneForm = () => {
    //     history.push(`/admin/spotlights/clone/${spotlightid}`);

    //     scrollToTopOfPage();
    // };

    // function setDefaults() {
    //     const startDateDefault = spotlight?.start ? formatDate(spotlight.start, 'YYYY-MM-DDTHH:mm:ss') : '';
    //     const endDateDefault = spotlight?.end ? formatDate(spotlight.end, 'YYYY-MM-DDTHH:mm:ss') : '';
    //     return {
    //         id: spotlight?.id || '',
    //         startDateDefault: startDateDefault,
    //         endDateDefault: endDateDefault,
    //         title: spotlight?.title || '',
    //         url: spotlight?.url || '',
    //         // eslint-disable-next-line camelcase
    //         img_url: spotlight?.img_url || '',
    //         // eslint-disable-next-line camelcase
    //         img_alt: spotlight?.img_alt || '',
    //         weight: spotlight?.weight || 0,
    //         active: spotlight?.active || 0,
    //         type: 'edit',
    //         // eslint-disable-next-line camelcase
    //         admin_notes: spotlight?.admin_notes || '',
    //     };
    // }

    // const values = setDefaults();

    return (
        <Fragment>
            <StandardPage title="Promo Panel Management">
                <PromoPanelUtilityArea actions={actions} helpContent={locale.viewPage.help} history={history} />
                <h1>Promo Panel View</h1>
            </StandardPage>
        </Fragment>
    );
};

PromoPanelView.propTypes = {
    actions: PropTypes.any,
    spotlight: PropTypes.any,
    spotlightStatus: PropTypes.any,
    history: PropTypes.object,
};

export default PromoPanelView;
