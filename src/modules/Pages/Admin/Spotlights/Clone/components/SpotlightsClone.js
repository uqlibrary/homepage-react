import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
import { SpotlightForm } from 'modules/Pages/Admin/Spotlights/SpotlightForm';
import { getTimeMondayMidnightNext, getTimeSundayNextFormatted } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

// const useStyles = makeStyles(() => ({
//     previewWrapper: {
//         transition: 'visibility 0s, opacity 0.5s linear',
//     },
// }));

export const SpotlightsClone = ({
    actions,
    spotlight,
    spotlightError,
    spotlightStatus,
    history,
    publicFileUploading,
    publicFileUploadError,
    publicFileUploadResult,
    spotlightsReweightingStatus,
}) => {
    console.log('SpotlightsClone: spotlight =  ', spotlight);
    console.log('SpotlightsClone: spotlightStatus =  ', spotlightStatus);
    console.log('SpotlightsClone: spotlightError =  ', spotlightError);
    console.log('SpotlightsClone: publicFileUploading = ', publicFileUploading);
    console.log('SpotlightsClone: publicFileUploadError = ', publicFileUploadError);
    console.log('SpotlightsClone: publicFileUploadResult = ', publicFileUploadResult);
    console.log('SpotlightsClone: spotlightsReweightingStatus = ', spotlightsReweightingStatus);

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
        type: 'clone',
    };

    function setDefaults() {
        const startDateDefault = getTimeMondayMidnightNext();
        const endDateDefault = getTimeSundayNextFormatted();
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
            type: 'clone',
        };
    }

    const defaults = setDefaults();

    return (
        <StandardPage title="Spotlights Management">
            <section aria-live="assertive">
                <SpotlightsUtilityArea actions={actions} helpContent={locale.form.help} history={history} />
                <StandardCard title="Clone spotlight">
                    <SpotlightForm
                        actions={actions}
                        spotlightResponse={spotlight}
                        spotlightError={spotlightError || publicFileUploadError}
                        spotlightStatus={spotlightStatus}
                        history={history}
                        defaults={defaults}
                        publicFileUploading={publicFileUploading}
                        publicFileUploadError={publicFileUploadError}
                        publicFileUploadResult={publicFileUploadResult}
                        spotlightsReweightingStatus={spotlightsReweightingStatus}
                    />
                </StandardCard>
            </section>
        </StandardPage>
    );
};

SpotlightsClone.propTypes = {
    actions: PropTypes.any,
    spotlight: PropTypes.any,
    spotlightError: PropTypes.any,
    spotlightStatus: PropTypes.any,
    history: PropTypes.object,
    publicFileUploading: PropTypes.any,
    publicFileUploadError: PropTypes.any,
    publicFileUploadResult: PropTypes.any,
    spotlightsReweightingStatus: PropTypes.string,
};

export default SpotlightsClone;
