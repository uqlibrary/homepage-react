import React, { Fragment } from 'react';

export default {
    title: 'Learning resources',
    search: {
        title: 'Course search',
        autocompleteResultsTitle: 'Matching courses',
        noOptionsText: 'Enter a course code to find a course',
        noResultsText: 'No matching courses found',
        placeholder: 'Search by course code or keyword',
        unavailableText: 'Learning Resource suggestions unavailable',
    },
    searchResultsTitle: 'Search results',
    notesTrimLength: 90,
    externalSubjectLocation: 'External Instruction',
    homepagePanel: {
        title: 'Learning resources and past exam papers',
        userCourseTitle: 'Your current courses',
        noCourses: (
            <Fragment>
                <p>Your enrolled courses will appear here three weeks prior to the start of the semester.</p>
                <p>Search for learning resources above.</p>
            </Fragment>
        ),
    },
};
