import React from 'react';

export default {
    noBookingMessage: {
        title: 'No booking necessary',
        message: (
            <React.Fragment>
                Please use one of the locations available{' '}
                <a href="https://web.library.uq.edu.au/library-services/students/find-study-and-non-invigilated-exam-space">
                    around campus
                </a>
                .
            </React.Fragment>
        ),
    },
};
