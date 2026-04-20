const pad = value => String(value).padStart(2, '0');

export const emptySpaceOutageDraft = {
    space_outage_start: '',
    space_outage_end: '',
    space_outage_reason: '',
};

export const normalizeSpaceOutageList = value => {
    if (Array.isArray(value)) {
        return value;
    }
    if (Array.isArray(value?.data)) {
        return value.data;
    }
    if (Array.isArray(value?.data?.space_outages)) {
        return value.data.space_outages;
    }
    if (Array.isArray(value?.space_outages)) {
        return value.space_outages;
    }
    return [];
};

export const parseSpaceOutageDate = value => {
    if (!value) {
        return null;
    }

    const normalisedValue = String(value).replace(' ', 'T');
    const parsedDate = new Date(normalisedValue);

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const formatSpaceOutageDateTimeForInput = value => {
    const parsedDate = parseSpaceOutageDate(value);
    if (!parsedDate) {
        return '';
    }

    return [
        parsedDate.getFullYear(),
        pad(parsedDate.getMonth() + 1),
        pad(parsedDate.getDate()),
    ].join('-') + `T${pad(parsedDate.getHours())}:${pad(parsedDate.getMinutes())}`;
};

export const formatSpaceOutageDateTimeForPayload = value => {
    if (!value) {
        return null;
    }

    const normalisedValue = String(value).trim().replace('T', ' ');
    if (normalisedValue.length === 16) {
        return `${normalisedValue}:00`;
    }
    return normalisedValue;
};

export const formatSpaceOutageDateTimeForDisplay = value => {
    const parsedDate = parseSpaceOutageDate(value);
    if (!parsedDate) {
        return 'Not set';
    }

    return new Intl.DateTimeFormat('en-AU', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(parsedDate);
};

export const getSpaceOutageStatus = (outage, currentTime = new Date()) => {
    const startDate = parseSpaceOutageDate(outage?.space_outage_start);
    const endDate = parseSpaceOutageDate(outage?.space_outage_end);

    if (!startDate || !endDate) {
        return 'Invalid';
    }
    if (currentTime >= startDate && currentTime < endDate) {
        return 'Current';
    }
    if (currentTime < startDate) {
        return 'Upcoming';
    }
    return 'Past';
};

export const sortSpaceOutages = outages => {
    return [...normalizeSpaceOutageList(outages)].sort((leftOutage, rightOutage) => {
        const leftDate = parseSpaceOutageDate(leftOutage?.space_outage_start)?.getTime() || 0;
        const rightDate = parseSpaceOutageDate(rightOutage?.space_outage_start)?.getTime() || 0;
        return leftDate - rightDate;
    });
};

export const getOverlappingSpaceOutages = (draft, existingOutages = [], editingOutageId = null) => {
    const draftStart = parseSpaceOutageDate(draft?.space_outage_start);
    const draftEnd = parseSpaceOutageDate(draft?.space_outage_end);

    if (!draftStart || !draftEnd || draftEnd <= draftStart) {
        return [];
    }

    return normalizeSpaceOutageList(existingOutages).filter(existingOutage => {
        if (editingOutageId && String(existingOutage?.space_outage_id) === String(editingOutageId)) {
            return false;
        }

        const existingStart = parseSpaceOutageDate(existingOutage?.space_outage_start);
        const existingEnd = parseSpaceOutageDate(existingOutage?.space_outage_end);
        if (!existingStart || !existingEnd) {
            return false;
        }

        return draftStart < existingEnd && draftEnd > existingStart;
    });
};

export const validateSpaceOutageDraft = (draft, existingOutages = [], editingOutageId = null) => {
    const errors = [];
    const warnings = [];
    const draftStart = parseSpaceOutageDate(draft?.space_outage_start);
    const draftEnd = parseSpaceOutageDate(draft?.space_outage_end);

    if (!draft?.space_outage_start) {
        errors.push({ field: 'space_outage_start', message: 'A start date and time is required.' });
    }
    if (!draft?.space_outage_end) {
        errors.push({ field: 'space_outage_end', message: 'An end date and time is required.' });
    }
    if (!!draft?.space_outage_start && !draftStart) {
        errors.push({ field: 'space_outage_start', message: 'The start date and time is invalid.' });
    }
    if (!!draft?.space_outage_end && !draftEnd) {
        errors.push({ field: 'space_outage_end', message: 'The end date and time is invalid.' });
    }
    if (!!draftStart && !!draftEnd && draftEnd <= draftStart) {
        errors.push({ field: 'space_outage_end', message: 'The end date and time must be after the start.' });
    }

    const overlappingOutages = getOverlappingSpaceOutages(draft, existingOutages, editingOutageId);
    if (overlappingOutages.length > 0) {
        warnings.push({
            field: 'space_outage_range',
            message: 'This unavailability overlaps another outage window already recorded for this space.',
        });
    }

    return { errors, warnings };
};

export const buildSpaceOutagePayload = ({ spaceId, draft }) => ({
    space_id: spaceId,
    space_outage_start: formatSpaceOutageDateTimeForPayload(draft?.space_outage_start),
    space_outage_end: formatSpaceOutageDateTimeForPayload(draft?.space_outage_end),
    space_outage_reason: draft?.space_outage_reason?.trim() || null,
});
