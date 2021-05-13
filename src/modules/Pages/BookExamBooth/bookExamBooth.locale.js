import React from 'react';

export default {
    title: 'Book an exam booth in the Biological Sciences Library',
    intro: (
        <p>
            Please use this form to find an available booth in which to sit your exam at the{' '}
            <a
                href="https://use.mazemap.com/#v=1&config=uq&zlevel=1&center=153.013203,-27.497685&zoom=15.6&sharepoitype=poi&sharepoi=1000013772&campuses=uq&campusid=406"
                target="_blank"
                rel="noopener noreferrer"
            >
                Biological Sciences Library
            </a>
            .
        </p>
    ),
    displayDecider: {
        heading: 'Booking options',
        label: 'Are you booking this booth to sit a scheduled ProctorU exam?',
        yesText: 'Yes, I am sitting a ProctorU exam',
        noText: 'No, I am NOT sitting a ProctorU exam',
    },
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
    detailsSectionHeading: 'Booking details',
    examType: {
        label: 'Are you bringing your own computer?',
        yesText: 'Yes (each laptop booth has one power point)',
        noText: 'No, I need a UQ computer',
    },
    sessionLength: {
        label: 'What is the duration of your exam, as shown on your personal exam timetable?',
    },
    startDate: {
        label: 'What is the date of your exam, as shown on your personal exam timetable?',
    },
    startTimeHours: {
        aria: 'Select the nearest hour',
        label: 'What is your registered ProctorU appointment time? - Select the nearest possible time',
    },
    startTimeMinutes: {
        aria: 'Select the nearest minute value',
    },
    submissionInstructions: (
        <React.Fragment>
            <p>
                Submit this form to proceed to UQ Book It. Log in with your student ID and password. You will see a list
                of available exam booths based on your choices above, for example{' '}
                <strong>A01 - Exam Computer Booth - Building 94</strong>.
            </p>
            <ol>
                <li>
                    Select any booth. A booking form will appear.
                    <br />
                    <strong>Do not adjust the date or times</strong>, they have been prefilled for you and include
                    additional time for you to get setup.
                </li>
                <li>
                    Enter your course code in the <strong>Booking Title</strong>
                </li>
                <li>
                    Click <strong>Book</strong>
                </li>
            </ol>
            <p>You will receive a confirmation email.</p>
        </React.Fragment>
    ),
    submitButton: {
        aria:
            'You will be sent to UQ BookIt system to complete your booking. Select an exam booth but do not adjust the time or date. After you book, you will receive a confirmation mail',
        label: 'Submit and go to UQ BookIt',
    },
};
