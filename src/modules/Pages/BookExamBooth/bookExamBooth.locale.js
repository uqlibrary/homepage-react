import React from 'react';

export default {
    title: 'Book an exam booth - Library - The University of Queensland',
    pageTitle: 'Book an exam booth in the Library',
    intro: (
        <p>
            Please use this form to find an available Library booth in which to sit your online invigilated exam. e.g.
            ProctorU, Zoom or Inspera Exam Portal invigilated exams.
        </p>
    ),
    locationDecider: {
        heading: 'Where would you like to sit your exam?',
        locations: [
            {
                value: 'central',
                label: 'Central Library',
                mapLink: 'https://maps.uq.edu.au/?campusId=406&zLevel=-1&zoom=18&identifier=archibus_0100121N115',
                needsComputerBookitLink:
                    'f30fe4d2-bb58-4426-9c38-843c40b2cd3c?group=9fe30583-ab0a-468a-9108-d9c873e93a58',
                BYODBookitLink: 'ae12d42e-faae-4553-8c6a-be2fcddb4b26?group=2adb60f6-ef8e-4862-90ef-23912e496995',
                needsDefiniteArticle: false, // does it need a 'the' in front to make a sensible sentence? (for help)
            },
            {
                value: 'gatton',
                label: 'Gatton',
                mapLink: 'https://maps.uq.edu.au/?zoom=18&campusId=467&poiId=1000335081&zLevel=1',
                needsComputerBookitLink:
                    'f30fe4d2-bb58-4426-9c38-843c40b2cd3c?group=67ffb237-c138-4adf-b714-ab60d751b77a',
                BYODBookitLink: 'ae12d42e-faae-4553-8c6a-be2fcddb4b26?group=c8f374e1-9dfe-48c1-906f-bea82f9d0a95',
                needsDefiniteArticle: false,
            },
        ],
    },
    /*
    byod: https://uqbookit.uq.edu.au/#/app/booking-types/ae12d42e-faae-4553-8c6a-be2fcddb4b26?group=2adb60f6-ef8e-4862-90ef-23912e496995&firstDay=2024-03-19&fromTime=07%3A45&toTime=09%3A15
    needs computer: https://uqbookit.uq.edu.au/#/app/booking-types/f30fe4d2-bb58-4426-9c38-843c40b2cd3c?group=9fe30583-ab0a-468a-9108-d9c873e93a58&firstDay=2024-03-19&fromTime=07%3A45&toTime=09%3A15
     */
    displayDecider: {
        heading: 'Booking options',
        label: 'Are you booking this booth to sit a scheduled online invigilated exam?',
        yesText: 'Yes, I am sitting an online invigilated exam',
        noText: 'No, I am NOT sitting an online invigilated exam',
    },
    noBookingMessage: {
        title: 'Find or book a quiet space',
        message: (
            <React.Fragment>
                <a href="https://uqbookit.uq.edu.au/app/booking-types/77b52dde-d704-4b6d-917e-e820f7df07cb">
                    Book a library room (UQ login required)
                </a>{' '}
                or find a quiet location on-campus to sit your exam.
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
        aria: 'Select Exam Duration',
    },
    startDate: {
        label: 'What is the date of your exam, as shown on your personal exam timetable?',
    },
    startTimeHours: {
        aria: 'Select the nearest hour',
        label: 'What is your registered exam appointment time? Select the nearest possible time.',
        name: 'Select registered exam time',
    },
    startTimeMinutes: {
        aria: 'Select the nearest minute value',
    },
    submissionInstructions: (
        <React.Fragment>
            <p>
                Submit this form to proceed to UQ Book It. Log in with your student ID and password. You will see a list
                of available exam booths based on your choices above, for example{' '}
                <strong>Central Library - Exam Booth - 12-N115-99</strong>.
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
