import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';

import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
import { SpotlightForm } from 'modules/Pages/Admin/Spotlights/SpotlightForm';
import { formatDate } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

export const SpotlightsEdit = ({
    actions,
    spotlight,
    spotlightError,
    spotlightStatus,
    history,
    publicFileUploading,
    publicFileUploadError,
    publicFileUploadResult,
    spotlights,
    spotlightsLoading,
}) => {
    const { spotlightid } = useParams();

    React.useEffect(() => {
        /* istanbul ignore else */
        if (!!spotlightid) {
            actions.loadASpotlight(spotlightid);
            actions.loadAllSpotlights();
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
            id: spotlight?.id || /* istanbul ignore next */ '',
            startDateDefault: startDateDefault,
            endDateDefault: endDateDefault,
            title: spotlight?.title || /* istanbul ignore next */ '',
            url: spotlight?.url || /* istanbul ignore next */ '',
            // eslint-disable-next-line camelcase
            img_url: spotlight?.img_url || /* istanbul ignore next */ '',
            // eslint-disable-next-line camelcase
            img_alt: spotlight?.img_alt || /* istanbul ignore next */ '',
            weight: spotlight?.weight || 0,
            active: spotlight?.active || /* istanbul ignore next */ 0,
            type: 'edit',
        };
    }

    const defaults = setDefaults();

    return (
        <StandardPage title="Spotlights Management">
            <section aria-live="assertive">
                <SpotlightsUtilityArea actions={actions} helpContent={locale.form.help} history={history} />
                <StandardCard title="Edit spotlight">
                    <SpotlightForm
                        actions={actions}
                        spotlightResponse={spotlight}
                        spotlightError={spotlightError || publicFileUploadError}
                        spotlightStatus={spotlightStatus}
                        spotlights={spotlights}
                        spotlightsLoading={spotlightsLoading}
                        history={history}
                        defaults={defaults}
                        publicFileUploading={publicFileUploading}
                        publicFileUploadError={publicFileUploadError}
                        publicFileUploadResult={publicFileUploadResult}
                    />
                </StandardCard>
            </section>
        </StandardPage>
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
    publicFileUploadResult: PropTypes.any,
    spotlights: PropTypes.any,
    spotlightsLoading: PropTypes.any,
};

export default SpotlightsEdit;
