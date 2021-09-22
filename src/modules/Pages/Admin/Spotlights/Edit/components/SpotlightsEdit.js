import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
import { SpotlightForm } from 'modules/Pages/Admin/Spotlights/SpotlightForm';
import { formatDate } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

// const useStyles = makeStyles(() => ({
//     previewWrapper: {
//         transition: 'visibility 0s, opacity 0.5s linear',
//     },
// }));

export const SpotlightsEdit = ({
    actions,
    spotlight,
    spotlightError,
    spotlightStatus,
    history,
    publicFileUploading,
    publicFileUploadError,
}) => {
    console.log('SpotlightsEdit: spotlight =  ', spotlight);
    console.log('SpotlightsEdit: spotlightStatus =  ', spotlightStatus);
    console.log('SpotlightsEdit: spotlightError =  ', spotlightError);
    console.log('SpotlightsEdit: publicFileUploading = ', publicFileUploading);
    console.log('SpotlightsEdit: publicFileUploadError = ', publicFileUploadError);
    // const classes = useStyles();
    const { spotlightid } = useParams();

    React.useEffect(() => {
        if (!!spotlightid) {
            actions.loadASpotlight(spotlightid);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spotlightid]);

    if (spotlightStatus === 'loading' || !!publicFileUploading) {
        return (
            <div style={{ minHeight: 600 }}>
                <InlineLoader message="Loading" />
            </div>
        );
    }

    const emptySpotlight = {
        id: spotlightid,
        startDateDefault: '',
        endDateDefault: '',
        title: '',
        url: '',
        // eslint-disable-next-line camelcase
        img_url: '',
        // eslint-disable-next-line camelcase
        img_alt: '',
        weight: 0,
        active: 0,
        type: 'edit',
    };

    function setDefaults() {
        const startDateDefault = spotlight?.start ? formatDate(spotlight.start, 'YYYY-MM-DDTHH:mm:ss') : '';
        const endDateDefault = spotlight?.end ? formatDate(spotlight.end, 'YYYY-MM-DDTHH:mm:ss') : '';
        if (spotlight?.id !== spotlightid) {
            // after the save returns we (possibly) reweight the other spotlights
            // they return into this page in the 'spotlight' variable
            // we dont want to display them
            return emptySpotlight;
        }
        return {
            id: spotlight?.id || '',
            startDateDefault: startDateDefault,
            endDateDefault: endDateDefault,
            title: spotlight?.title || '',
            url: spotlight?.url || '',
            // eslint-disable-next-line camelcase
            img_url: spotlight?.img_url || '',
            // eslint-disable-next-line camelcase
            img_alt: spotlight?.img_alt || '',
            weight: spotlight?.weight || 0,
            active: spotlight?.active || 0,
            type: 'edit',
        };
    }

    const defaults = setDefaults();

    return (
        <Fragment>
            <StandardPage title="Spotlights Management">
                <section aria-live="assertive">
                    <SpotlightsUtilityArea actions={actions} helpContent={locale.form.help} history={history} />
                    <StandardCard title="Edit spotlight">
                        <SpotlightForm
                            actions={actions}
                            spotlightResponse={spotlight}
                            spotlightError={spotlightError || publicFileUploadError}
                            spotlightStatus={spotlightStatus}
                            defaults={defaults}
                            history={history}
                        />
                    </StandardCard>
                </section>
            </StandardPage>
        </Fragment>
    );
};

SpotlightsEdit.propTypes = {
    actions: PropTypes.any,
    spotlight: PropTypes.any,
    spotlightError: PropTypes.any,
    spotlightStatus: PropTypes.any,
    history: PropTypes.object,
    publicFileUploading: PropTypes.any,
    publicFileUploadError: PropTypes.any,
};

export default SpotlightsEdit;
