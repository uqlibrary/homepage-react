import { default as locale } from './spotlightsadmin.locale';
import { get } from 'repositories/generic';
import { SPOTLIGHTS_ALL_API } from 'repositories/routes';

const moment = require('moment');

export function formatDate(dateString, dateFormat = 'YYYY-MM-DD HH:mm:ss') {
    const newMoment = new moment(dateString);
    return newMoment.format(dateFormat);
}

// export function getTimeNowFormatted() {
//     return moment().format('YYYY-MM-DDTHH:mm');
// }

export function getStartOfDayFormatted() {
    return moment()
        .startOf('day')
        .add(1, 'minutes')
        .format('YYYY-MM-DDTHH:mm');
}

export function getTimeEndOfDayFormatted() {
    return moment()
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm');
}

// return the sunday after next monday
// (next monday is the default start date, this is the default end date)
export function getTimeSundayNextFormatted(baseDate = null) {
    const today = baseDate || moment();
    const monday = 1;
    return today
        .isoWeekday(monday)
        .add(13, 'days')
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm');
}

export function getTimeMondayComing(baseDate = null) {
    const today = baseDate || moment();
    const monday = 1;
    return today
        .isoWeekday(monday)
        .add(1, 'weeks')
        .hour(9); // 9am
}

export function getTimeMondayMidnightNext(baseDate = null) {
    const today = baseDate || moment();
    const monday = 1;
    return today
        .isoWeekday(monday)
        .add(1, 'weeks')
        .hour(0)
        .minute(1) // 1 minute past midnight
        .format('YYYY-MM-DDTHH:mm');
}

export const addConstantsToDisplayValues = (displayText, imageWidthIn = null, imageHeightIn = null, ratio = null) => {
    return displayText
        .replace('[WIDTH]', imageWidthIn || locale.form.upload.ideal.width)
        .replace('[HEIGHT]', imageHeightIn || locale.form.upload.ideal.height)
        .replace('[RATIO]', ratio || locale.form.upload.ideal.ratio)
        .replace('[MAXFILESIZE]', locale.form.upload.maxSize / 1000);
};

export function isPastSpotlight(spotlight) {
    return moment(spotlight.end).isBefore(moment());
}

export function isScheduledSpotlight(spotlight) {
    return moment(spotlight.start).isAfter(moment());
}

export function isCurrentSpotlight(spotlight) {
    return !isPastSpotlight(spotlight) && !isScheduledSpotlight(spotlight);
}

export const reweightSpotlights = saveSpotlightChange => {
    console.log('reweightSpotlights getting ', SPOTLIGHTS_ALL_API());
    // rather than use redux and reflow the entire page,
    // manually get the api and make the updates
    get(SPOTLIGHTS_ALL_API()).then(list0 => {
        console.log('reweightSpotlights response = ', list0);
        // used to get the complete list back when the user clears the filter field
        const listUnchanged = list0.map(s => s);
        console.log('reweightSpotlights listUnchanged = ', listUnchanged);
        const list = list0.map(s => s);
        // temp for early dev
        // if (window.location.hostname === 'localhost') {
        //     list = list0.filter(r => r.id !== '9eab3aa0-82c1-11eb-8896-eb36601837f5');
        // }
        list.map(s => {
            // sort current then scheduled and then past
            if (isPastSpotlight(s)) {
                s.spotlightType = 3; // past
            } else if (isScheduledSpotlight(s)) {
                // console.log('check scheduled', s.id, s.title.substr(0, 20), s.start, s.weight);
                s.spotlightType = 2; // scheduled
            } else {
                // console.log('check current', s.id, s.title.substr(0, 20), s.start, s.weight);
                s.spotlightType = 1; // current
            }
            return s;
        })
            .sort((a, b) => {
                // sort by type then start date
                const thisStartDate = formatDate(a.start, 'YYYYMMDDHHmmss');
                const prevStartDate = formatDate(b.start, 'YYYYMMDDHHmmss');
                const thisEndDate = formatDate(a.end, 'YYYYMMDDHHmmss');
                const prevEndDate = formatDate(b.end, 'YYYYMMDDHHmmss');
                if (isPastSpotlight(a)) {
                    return a.spotlightType - b.spotlightType || Number(thisEndDate) - Number(prevEndDate);
                } else if (isScheduledSpotlight(a)) {
                    return a.spotlightType - b.spotlightType || Number(thisStartDate) - Number(prevStartDate);
                } else {
                    return a.spotlightType - b.spotlightType || a.weight - b.weight;
                }
            })
            .map((s, index) => {
                let newWeight;
                if (isPastSpotlight(s)) {
                    newWeight = 0;
                } else {
                    newWeight = (Number(index) + 1) * 10;
                }
                // (!isPastSpotlight(s) || s.weight !== newWeight) &&
                //     console.log(
                //         'reWeightSpotlights updating ',
                //         index,
                //         // eslint-disable-next-line no-nested-ternary
                //         isPastSpotlight(s) ? 'past' : isScheduledSpotlight(s) ? 'scheduled' : 'current',
                //         s.id,
                //         s.title.substr(0, 20),
                //         s.start,
                //         ' from ',
                //         s.weight,
                //         ' to ',
                //         newWeight,
                //     );
                return {
                    ...s,
                    weight: newWeight,
                };
            })
            .forEach(s => {
                const currentRow = listUnchanged.map(t => t).find(r => r.id === s.id);
                const newValues = {
                    id: currentRow.id,
                    start: currentRow.start,
                    end: currentRow.end,
                    title: currentRow.title,
                    url: currentRow.url,
                    img_url: currentRow.img_url,
                    img_alt: currentRow.img_alt,
                    active: !!currentRow.active ? 1 : 0,
                    weight: s.weight,
                };

                (!isPastSpotlight(s) || s.weight !== currentRow.weight) &&
                    console.log(
                        'will',
                        s.weight === currentRow.weight ? 'NOT' : '',
                        'save',
                        newValues.id,
                        newValues.title.substr(0, 20),
                        'start: ',
                        newValues.start,
                        'weight: ',
                        newValues.weight,
                        ' (was ',
                        currentRow.weight,
                        ')',
                        // eslint-disable-next-line no-nested-ternary
                        isPastSpotlight(s) ? 'past' : isScheduledSpotlight(s) ? 'scheduled' : 'current',
                    );

                // save any changes to order
                s.weight !== currentRow.weight &&
                    saveSpotlightChange(newValues)
                        .then(() => {
                            console.log('reWeightSpotlights saved success ', newValues.weight, newValues);
                            console.log('look for ', `#spotlight-list-row-${newValues.id} .order`);
                        })
                        .catch(bad => {
                            console.log('reWeightSpotlights saved failed ', bad, newValues);
                        });

                // update the display of Order
                // only current spotlights display the order value
                if (!!isCurrentSpotlight(s)) {
                    const weightCell = document.querySelector(`#spotlight-list-row-${currentRow.id} .order`);
                    console.log('weightCell = ', weightCell);
                    !!weightCell && (weightCell.innerHTML = newValues.weight / 10);
                }
            });
        console.log('list = ', list);
    });

    // console.log('reweightSpotlights', tableType, ' len = ', userows.length, userows);
    // let counter = 1;
    // console.log('userows = ', userows);
    // const localRows = userows.map(s => {
    //     console.log('check weight', tableType,
    //     s.id, s.weight, 'counter = ', counter * 10, s.title.substr(0, 20));
    //     if (s.weight !== counter * 10) {
    //         console.log('weight mismatch', tableType, s.id, s.weight, counter, s.title.substr(0, 20));
    //         s.weight = counter * 10;
    //         persistRowReorder(s, userows);
    //     }
    //     counter++;
    //     return s;
    // });
    // console.log('localRows = ', localRows);
    // setUserows(localRows);
};
