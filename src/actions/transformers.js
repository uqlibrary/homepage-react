/* getRecordSubjectSearchKey - returns subjects for record request
 * @param {array} of objects in format {rek_value: {key: id, value: value}, rek_order}
 * @returns {Object} formatted {fez_record_search_key_subject} for record request
 */
export const getRecordSubjectSearchKey = subject => {
    if (!subject || subject.length === 0) return {};

    return {
        fez_record_search_key_subject: subject.map(item => ({
            rek_subject: item.rek_value.key,
            rek_subject_order: item.rek_order,
        })),
    };
};
