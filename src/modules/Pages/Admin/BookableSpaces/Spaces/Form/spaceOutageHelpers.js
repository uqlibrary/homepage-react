import moment from 'moment';

export const emptySpaceOutageDraft = {
    space_outage_start: '',
    space_outage_end: '',
    space_outage_reason: '',
    space_outage_show_time_public: true,
};

export const SPACE_OUTAGE_NOTICE_WINDOW_DAYS = 7;

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

// Returns a moment object or null
export const parseSpaceOutageDate = value => {
    if (!value) {
        return null;
    }
    const m = moment(
        String(value),
        [
            'YYYY-MM-DDTHH:mm',
            'YYYY-MM-DD HH:mm',
            'YYYY-MM-DDTHH:mm:ss',
            'YYYY-MM-DD HH:mm:ss'
        ],
        true
    );
    return m.isValid() ? m : null;
};

// Returns string for <input type="datetime-local">, e.g. '2026-04-20T08:00'
export const formatSpaceOutageDateTimeForInput = value => {
    const m = parseSpaceOutageDate(value);
    if (!m) {
        return '';
    }
    return m.format('YYYY-MM-DDTHH:mm');
};

// Accepts input from <input type="datetime-local"> and outputs 'YYYY-MM-DD HH:mm:ss'
export const formatSpaceOutageDateTimeForPayload = value => {
    if (!value) {
        return null;
    }
    // Accepts 'YYYY-MM-DDTHH:mm' or 'YYYY-MM-DD HH:mm' or with seconds
    const m = moment(
        String(value).replace('T', ' '),
        ['YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DDTHH:mm:ss', 'YYYY-MM-DDTHH:mm'],
        true,
    );
    return m.isValid() ? m.format('YYYY-MM-DD HH:mm:ss') : null;
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

export const formatSpaceOutageDateTimeForPublicNotice = value => {
    const parsedDate = parseSpaceOutageDate(value);
    if (!parsedDate) {
        return 'Not set';
    }

    return parsedDate.format('DD/MM/YYYY h:mma');
};

export const getSpaceOutageShowTimePublic = outage => {
    const rawValue = outage?.space_outage_show_time_public;

    if (rawValue === false || rawValue === 0) {
        return false;
    }
    if (typeof rawValue === 'string') {
        return !['0', 'false', 'n', 'no'].includes(rawValue.trim().toLowerCase());
    }

    // Default to true for backward compatibility with existing records.
    return true;
};

export const formatSpaceOutageRangeForPublicNotice = (startValue, endValue, showTimePublic = true) => {
    const startDate = parseSpaceOutageDate(startValue);
    const endDate = parseSpaceOutageDate(endValue);

    if (!startDate || !endDate) {
        return `${formatSpaceOutageDateTimeForPublicNotice(startValue)} to ${formatSpaceOutageDateTimeForPublicNotice(
            endValue,
        )}`;
    }

    const sameYear = startDate.isSame(endDate, 'year');

    if (!showTimePublic) {
        if (startDate.isSame(endDate, 'day')) {
            return startDate.format('D MMMM YYYY');
        }

        if (sameYear) {
            return `${startDate.format('D MMMM')} to ${endDate.format('D MMMM YYYY')}`;
        }

        return `${startDate.format('D MMMM YYYY')} to ${endDate.format('D MMMM YYYY')}`;
    }

    if (startDate.isSame(endDate, 'day')) {
        return `${startDate.format('h:mma')} to ${endDate.format('h:mma')} on ${startDate.format('D MMMM YYYY')}`;
    }

    if (sameYear) {
        return `${startDate.format('h:mma D MMMM')} to ${endDate.format('h:mma D MMMM YYYY')}`;
    }

    return `${startDate.format('h:mma D MMMM YYYY')} to ${endDate.format('h:mma D MMMM YYYY')}`;
};

export const formatSpaceOutageUntilForPublicNotice = (endValue, currentTime, showTimePublic = true) => {
    const endDate = parseSpaceOutageDate(endValue);
    if (!endDate) {
        return formatSpaceOutageDateTimeForPublicNotice(endValue);
    }

    if (!showTimePublic) {
        return endDate.format('D MMMM YYYY');
    }

    const now = currentTime ? moment(currentTime) : moment();
    if (endDate.isSame(now, 'day')) {
        return `${endDate.format('h:mma')} on ${endDate.format('D MMMM YYYY')}`;
    }

    return endDate.format('h:mma D MMMM YYYY');
};

export const getSpaceOutageStatus = (outage, currentTime) => {
    // Always use moment for all date logic
    const now = currentTime ? moment(currentTime) : moment();
    const startDate = parseSpaceOutageDate(outage?.space_outage_start);
    const endDate = parseSpaceOutageDate(outage?.space_outage_end);

    if (!startDate || !endDate) {
        return 'Invalid';
    }
    if (now.isSameOrAfter(startDate) && now.isBefore(endDate)) {
        return 'Current';
    }
    if (now.isBefore(startDate)) {
        return 'Upcoming';
    }
    return 'Past';
};

export const sortSpaceOutages = outages => {
    return [...normalizeSpaceOutageList(outages)].sort((leftOutage, rightOutage) => {
        const leftDate = parseSpaceOutageDate(leftOutage?.space_outage_start)?.valueOf() || 0;
        const rightDate = parseSpaceOutageDate(rightOutage?.space_outage_start)?.valueOf() || 0;
        return leftDate - rightDate;
    });
};

export const getVisibleSpaceOutage = (
    outages,
    currentTime,
    noticeWindowDays = SPACE_OUTAGE_NOTICE_WINDOW_DAYS,
) => {
    const now = currentTime ? moment(currentTime) : moment();
    const sortedOutages = sortSpaceOutages(outages);
    const currentOutage = sortedOutages.find(outage => getSpaceOutageStatus(outage, now) === 'Current');

    if (currentOutage) {
        return {
            status: 'Current',
            tone: 'error',
            outage: currentOutage,
            reason: currentOutage?.space_outage_reason?.trim() || '',
        };
    }

    const upcomingOutage = sortedOutages.find(outage => {
        if (getSpaceOutageStatus(outage, now) !== 'Upcoming') {
            return false;
        }

        const startDate = parseSpaceOutageDate(outage?.space_outage_start);
        return !!startDate && startDate.diff(now, 'days', true) <= noticeWindowDays;
    });

    if (!upcomingOutage) {
        return null;
    }

    return {
        status: 'Upcoming',
        tone: 'warning',
        outage: upcomingOutage,
        reason: upcomingOutage?.space_outage_reason?.trim() || '',
    };
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
    if (!draft?.space_outage_reason || !draft?.space_outage_reason.trim()) {
        errors.push({ field: 'space_outage_reason', message: 'A reason is required.' });
    }

    const overlappingOutages = getOverlappingSpaceOutages(draft, existingOutages, editingOutageId);
    if (overlappingOutages.length > 0) {
        warnings.push({
            field: 'space_outage_range',
            message: 'This closure overlaps another closure window already recorded for this space.',
        });
    }

    return { errors, warnings };
};

export const buildSpaceOutagePayload = ({ spaceId, draft }) => ({
    space_id: spaceId,
    space_outage_start: formatSpaceOutageDateTimeForPayload(draft?.space_outage_start),
    space_outage_end: formatSpaceOutageDateTimeForPayload(draft?.space_outage_end),
    space_outage_reason: draft?.space_outage_reason?.trim() || null,
    space_outage_show_time_public: !!draft?.space_outage_show_time_public,
});
