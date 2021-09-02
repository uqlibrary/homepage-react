import React from 'react';
import PropTypes from 'prop-types';

import { SpotlightsUtilityArea } from 'modules/Pages/Admin/Spotlights/SpotlightsUtilityArea';
import { SpotlightForm } from 'modules/Pages/Admin/Spotlights/SpotlightForm';
import { getStartOfDayFormatted, getTimeSundayNextFormatted } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';

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
}) => {
    const getUrlSearchParams = theUrl => {
        if (theUrl.search.startsWith('?')) {
            // prod and localhost
            return new URLSearchParams(theUrl.search);
        }
        /* istanbul ignore next */
        if (theUrl.hash.startsWith('#') && theUrl.hash.includes('?')) {
            // staging & feature branches have the search params inside the hash :(
            const search = theUrl.hash.split('?')[1];
            return new URLSearchParams('?' + search);
        }
        return new URLSearchParams(theUrl);
    };

    const url = new URL(document.location);
    const searchParams = getUrlSearchParams(url);
    const maxWeight = searchParams.get('maxWeight');
    console.log('maxWeight = ', maxWeight);

    const defaults = {
        id: '',
        startDateDefault: getStartOfDayFormatted(),
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
                        maxWeight={maxWeight}
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
};

export default SpotlightsAdd;
