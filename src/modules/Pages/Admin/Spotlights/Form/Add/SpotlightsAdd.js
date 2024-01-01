import React from 'react';
import PropTypes from 'prop-types';

import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
import { SpotlightForm } from 'modules/Pages/Admin/Spotlights/Form/SpotlightForm';
import {
    getStartOfDayFormatted,
    getTimeMondayMidnightNext,
    getTimeSundayNextFormatted,
} from 'modules/Pages/Admin/dateTimeHelper';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';

export const SpotlightsAdd = ({
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
    const defaults = {
        id: '',
        startDateDefault: getTimeMondayMidnightNext(),
        endDateDefault: getTimeSundayNextFormatted(),
        title: '',
        url: '',
        img_url: '',
        img_alt: '',
        weight: 1000,
        active: 0,
        type: 'add',
        minimumDate: getStartOfDayFormatted(),
        admin_notes: '',
    };

    React.useEffect(() => {
        /* istanbul ignore else */
        if (!spotlightsLoading && !spotlights) {
            actions.loadAllSpotlights();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <StandardPage title="Spotlights Management">
            <section aria-live="assertive">
                <SpotlightsUtilityArea actions={actions} history={history} helpContent={locale.form.help} />
                <StandardCard title="Create a new spotlight">
                    <SpotlightForm
                        actions={actions}
                        spotlightResponse={spotlight}
                        spotlightError={spotlightError}
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

SpotlightsAdd.propTypes = {
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

export default SpotlightsAdd;
