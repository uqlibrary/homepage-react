import { locale } from 'locale';
import { dateTimeYear } from 'config/validation';

import {
    PUBLICATION_TYPE_DATA_COLLECTION,
    PUBLICATION_TYPE_CONFERENCE_PAPER,
    PUBLICATION_TYPE_AUDIO_DOCUMENT,
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_BOOK_CHAPTER,
    PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS,
    PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT,
    PUBLICATION_TYPE_DIGILIB_IMAGE,
    PUBLICATION_TYPE_IMAGE,
    PUBLICATION_TYPE_JOURNAL_ARTICLE,
    PUBLICATION_TYPE_JOURNAL,
    PUBLICATION_TYPE_MANUSCRIPT,
    PUBLICATION_TYPE_NEWSPAPER_ARTICLE,
    PUBLICATION_TYPE_PATENT,
    PUBLICATION_TYPE_PREPRINT,
    PUBLICATION_TYPE_RESEARCH_REPORT,
    PUBLICATION_TYPE_SEMINAR_PAPER,
    PUBLICATION_TYPE_THESIS,
    PUBLICATION_TYPE_VIDEO_DOCUMENT,
    PUBLICATION_TYPE_WORKING_PAPER,
    PUBLICATION_TYPE_CREATIVE_WORK,
    PUBLICATION_TYPE_DESIGN,
} from 'config/general';
import {
    validateAudioDocument,
    validateBook,
    validateBookChapter,
    validateConferencePaper,
    validateConferenceProceedings,
    validateDataCollection,
    validateDepartmentTechnicalReport,
    validateDesign,
    validateDigilibImage,
    validateImage,
    validateJournalArticle,
    validateJournal,
    validateManuscript,
    validateNewspaperArticle,
    validatePatent,
    validatePreprint,
    validateResearchReport,
    validateSeminarPaper,
    validateThesis,
    validateVideo,
    validateWorkingPaper,
    validateCreativeWork,
} from './fields';

import deepmerge from 'deepmerge';

export default values => {
    const data = values.toJS();
    const summary = locale.validationErrorsSummary;
    let errors = {
        bibliographicSection: {},
        additionalInformationSection: {},
    };

    !(data.bibliographicSection || {}).rek_title && (errors.bibliographicSection.rek_title = summary.rek_title);

    !(data.bibliographicSection || {}).rek_date && (errors.bibliographicSection.rek_date = summary.rek_date);

    dateTimeYear(((data.bibliographicSection || {}).fez_record_search_key_date_available || {}).rek_date_available) &&
        (errors.bibliographicSection.fez_record_search_key_date_available = {
            rek_date_available: summary.rek_date_available,
        });

    !((data.additionalInformationSection || {}).collections || []).length > 0 &&
        (errors.additionalInformationSection.collections = summary.collections);

    (data.additionalInformationSection || {}).hasOwnProperty('rek_subtype') &&
        !data.additionalInformationSection.rek_subtype &&
        (errors.additionalInformationSection.rek_subtype = summary.rek_subtype);

    switch (data.rek_display_type) {
        case PUBLICATION_TYPE_AUDIO_DOCUMENT:
            const audioDocumentErrors = validateAudioDocument(data, locale);
            errors = deepmerge(errors, audioDocumentErrors);
            break;
        case PUBLICATION_TYPE_BOOK:
            const bookErrors = validateBook(data, locale);
            errors = deepmerge(errors, bookErrors);
            break;
        case PUBLICATION_TYPE_BOOK_CHAPTER:
            const bookChapterErrors = validateBookChapter(data, locale);
            errors = deepmerge(errors, bookChapterErrors);
            break;
        case PUBLICATION_TYPE_CONFERENCE_PAPER:
            const conferencePaperErrors = validateConferencePaper(data, locale);
            errors = deepmerge(errors, conferencePaperErrors);
            break;
        case PUBLICATION_TYPE_CONFERENCE_PROCEEDINGS:
            const conferenceProceedingsErrors = validateConferenceProceedings(data, locale);
            errors = deepmerge(errors, conferenceProceedingsErrors);
            break;
        case PUBLICATION_TYPE_CREATIVE_WORK:
            const creativeWorkErrors = validateCreativeWork(data, locale);
            errors = deepmerge(errors, creativeWorkErrors);
            break;
        case PUBLICATION_TYPE_DATA_COLLECTION:
            const dataCollectionErrors = validateDataCollection(data, locale);
            errors = deepmerge(errors, dataCollectionErrors);
            break;
        case PUBLICATION_TYPE_DEPARTMENT_TECHNICAL_REPORT:
            const departmentTechnicalReportErrors = validateDepartmentTechnicalReport(data, locale);
            errors = deepmerge(errors, departmentTechnicalReportErrors);
            break;
        case PUBLICATION_TYPE_DESIGN:
            const designErrors = validateDesign(data, locale);
            errors = deepmerge(errors, designErrors);
            break;
        case PUBLICATION_TYPE_DIGILIB_IMAGE:
            const digilibImageErrors = validateDigilibImage(data, locale);
            errors = deepmerge(errors, digilibImageErrors);
            break;
        case PUBLICATION_TYPE_IMAGE:
            const imageErrors = validateImage(data, locale);
            errors = deepmerge(errors, imageErrors);
            break;
        case PUBLICATION_TYPE_JOURNAL_ARTICLE:
            const journalArticleErrors = validateJournalArticle(data, locale);
            errors = deepmerge(errors, journalArticleErrors);
            break;
        case PUBLICATION_TYPE_JOURNAL:
            const journalErrors = validateJournal(data, locale);
            errors = deepmerge(errors, journalErrors);
            break;
        case PUBLICATION_TYPE_MANUSCRIPT:
            const manuscriptErrors = validateManuscript(data, locale);
            errors = deepmerge(errors, manuscriptErrors);
            break;
        case PUBLICATION_TYPE_NEWSPAPER_ARTICLE:
            const newspaperArticleErrors = validateNewspaperArticle(data, locale);
            errors = deepmerge(errors, newspaperArticleErrors);
            break;
        case PUBLICATION_TYPE_PATENT:
            const patentErrors = validatePatent(data, locale);
            errors = deepmerge(errors, patentErrors);
            break;
        case PUBLICATION_TYPE_PREPRINT:
            const preprintErrors = validatePreprint(data, locale);
            errors = deepmerge(errors, preprintErrors);
            break;
        case PUBLICATION_TYPE_RESEARCH_REPORT:
            const researchReportErrors = validateResearchReport(data, locale);
            errors = deepmerge(errors, researchReportErrors);
            break;
        case PUBLICATION_TYPE_SEMINAR_PAPER:
            const seminarPaperErrors = validateSeminarPaper(data, locale);
            errors = deepmerge(errors, seminarPaperErrors);
            break;
        case PUBLICATION_TYPE_THESIS:
            const thesisErrors = validateThesis(data, locale);
            errors = deepmerge(errors, thesisErrors);
            break;
        case PUBLICATION_TYPE_VIDEO_DOCUMENT:
            const videoErrors = validateVideo(data, locale);
            errors = deepmerge(errors, videoErrors);
            break;
        case PUBLICATION_TYPE_WORKING_PAPER:
            const workingPaperErrors = validateWorkingPaper(data, locale);
            errors = deepmerge(errors, workingPaperErrors);
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
