import React, { Fragment } from 'react';

export const courseResourcesLocale = {
    title: 'Course resources',
    userCourseTitle: 'Your courses',
    placeholder: 'Search by course code or title',
    noOptionsText: 'Enter a course code to find a course',
    unavailableText: 'Course Resource suggestions unavailable',
    noCourses: (
        <Fragment>
            <p>Your enrolled courses will appear here three weeks prior to the start of the semester.</p>
            <p>Search for course resources above.</p>
        </Fragment>
    ),
    autocompleteResultsTitle: 'Selection options',
};
