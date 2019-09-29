import { locale } from 'locale';
import { PUBLICATION_TYPE_DATA_COLLECTION, PUBLICATION_TYPE_CONFERENCE_PAPER } from 'config/general';
import { validateConferencePaper } from './fields/conferencePaperFields';
import { validateDataCollection } from './fields/dataCollectionFields';

import deepmerge from 'deepmerge';

export default values => {
    const data = values.toJS();

    let errors = {
        bibliographicSection: {},
        additionalInformationSection: {},
        filesSection: {},
    };

    !(data.bibliographicSection || {}).rek_title &&
        (errors.bibliographicSection.rek_title = locale.validationErrorsSummary.rek_title);

    !(data.bibliographicSection || {}).rek_date &&
        (errors.bibliographicSection.rek_date = locale.validationErrorsSummary.rek_date);

    !((data.additionalInformationSection || {}).collections || []).length > 0 &&
        (errors.additionalInformationSection.collections = locale.validationErrorsSummary.collections);

    (data.additionalInformationSection || {}).hasOwnProperty('rek_subtype') &&
        !data.additionalInformationSection.rek_subtype &&
        (errors.additionalInformationSection.rek_subtype = locale.validationErrorsSummary.rek_subtype);

    switch (data.rek_display_type) {
        case PUBLICATION_TYPE_CONFERENCE_PAPER:
            const conferencePaperErrors = validateConferencePaper(data, locale);
            errors = deepmerge(errors, conferencePaperErrors);
            break;
        case PUBLICATION_TYPE_DATA_COLLECTION:
            const dataCollectionErrors = validateDataCollection(data, locale);
            errors = deepmerge(errors, dataCollectionErrors);
            break;
        default:
            break;
    }

    errors = Object.entries(errors).reduce(
        (result, [key, value]) => (Object.values(value).length !== 0 && { ...result, [key]: value }) || { ...result },
        {},
    );

    return errors;
};
