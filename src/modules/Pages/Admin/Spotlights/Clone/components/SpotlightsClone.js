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

export const SpotlightsClone = ({
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
    console.log('SpotlightsClone: spotlight =  ', spotlight);
    console.log('SpotlightsClone: spotlightStatus =  ', spotlightStatus);
    console.log('SpotlightsClone: spotlightError =  ', spotlightError);
    console.log('SpotlightsClone: publicFileUploading = ', publicFileUploading);
    console.log('SpotlightsClone: publicFileUploadError = ', publicFileUploadError);
    console.log('SpotlightsClone: publicFileUploadResult = ', publicFileUploadResult);

    const { spotlightid } = useParams();

    const [defaults, setDefaults] = React.useState({});

    React.useEffect(() => {
        /* istanbul ignore else */
        if (!!spotlightid) {
            actions.loadASpotlight(spotlightid);
            actions.loadAllSpotlights();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spotlightid]);

    React.useEffect(() => {
        console.log(
            '*** useeffect, spotlightid = ',
            spotlightid,
            '; spotlightStatus = ',
            spotlightStatus,
            '; spotlight?.id = ',
            spotlight?.id,
        );
        if (!!spotlightid && spotlight?.id === spotlightid) {
            console.log('load defaults:');
            setDefaults({
                id: spotlight?.id || /* istanbul ignore next */ '',
                startDateDefault: getTimeMondayMidnightNext(),
                endDateDefault: getTimeSundayNextFormatted(),
                title: spotlight?.title || /* istanbul ignore next */ '',
                url: spotlight?.url || /* istanbul ignore next */ '',
                // eslint-disable-next-line camelcase
                img_url: spotlight?.img_url || /* istanbul ignore next */ '',
                // eslint-disable-next-line camelcase
                img_alt: spotlight?.img_alt || /* istanbul ignore next */ '',
                weight: spotlight?.weight || 1000,
                active: spotlight?.active || 0,
                // minimumDate: getStartOfDayFormatted(),
                type: 'clone',
            });
        } else {
            console.log('SpotlightsClone: useffect did nothing');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [spotlight]);

    if (
        spotlightStatus === 'loading' ||
        spotlightStatus === null ||
        !!publicFileUploading ||
        !defaults ||
        !defaults.id
    ) {
        return (
            <div style={{ minHeight: 600 }}>
                <InlineLoader message="Loading" />
            </div>
        );
    }

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

SpotlightsClone.propTypes = {
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

export default SpotlightsClone;
