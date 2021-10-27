import React from 'react';
import PropTypes from 'prop-types';

import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
import { SpotlightForm } from 'modules/Pages/Admin/Spotlights/SpotlightForm';
import {
    getStartOfDayFormatted,
    getTimeMondayMidnightNext,
    getTimeSundayNextFormatted,
} from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

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
    spotlightsReweightingStatus,
}) => {
    const defaults = {
        id: '',
        startDateDefault: getTimeMondayMidnightNext(),
        endDateDefault: getTimeSundayNextFormatted(),
        title: '',
        url: '',
        img_url: '',
        img_alt: '',
        weight: 0,
        active: 0,
        type: 'add',
        minimumDate: getStartOfDayFormatted(),
    };
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

SpotlightsAdd.propTypes = {
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

export default SpotlightsAdd;
