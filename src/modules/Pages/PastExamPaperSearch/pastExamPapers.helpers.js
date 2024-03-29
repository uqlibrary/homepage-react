import React from 'react';

export const noResultsFoundBlock = searchTerm => {
    const capitalisedSearchTerm = searchTerm.toUpperCase();
    return (
        <div>
            <p>We have not found any past exams for this course {capitalisedSearchTerm} because either:</p>
            <ul>
                <li>there are no past exams available for this course in the last five years</li>
                <li>{capitalisedSearchTerm || 'it'} is not a valid course code or course code prefix</li>
                <li>the system is not functioning correctly.</li>
            </ul>
            <p>
                Please check with your instructor, or report a problem via the <strong>AskUs</strong> button at the top
                of the page.
            </p>
        </div>
    );
};

export const MESSAGE_EXAMCODE_404 = 'No such exam';
