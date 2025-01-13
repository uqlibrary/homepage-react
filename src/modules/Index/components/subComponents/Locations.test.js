import React from 'react';
import Locations from './Locations';
import { rtlRender, WithRouter } from 'test-utils';
import { getByTestId } from '@testing-library/dom';
import { fireEvent } from '@testing-library/react';
import { ariaLabelForLocation, hasDepartments } from './Locations';

const validWhitty = {
    alt: 'Whitty building, Mater,',
    campus: 'Other',
    departments: [
        {
            hours: '6:30am - 10pm',
            name: 'Study space',
        },
    ],
    name: 'Whitty Mater',
    url: 'https://web.library.uq.edu.au/locations-hours',
    displayName: 'Whitty Mater',
};

function setup(testProps = {}, renderer = rtlRender) {
    return renderer(
        <WithRouter>
            <Locations {...testProps} />
        </WithRouter>,
    );
}

describe('Locations panel', () => {
    it('should render loading panel', () => {
        const props = {
            libHoursLoading: true,
            libHoursError: false,
            libHours: null,
            vemcountLoading: true,
            vemcountError: false,
            vemcount: null,
        };
        const { getByTestId } = setup({ ...props });
        expect(getByTestId('hours-loader')).toBeInTheDocument();
    });
    it('should render error panel', () => {
        const props = {
            libHoursLoading: false,
            libHoursError: true,
            libHours: null,
            vemcountLoading: false,
            vemcountError: true,
            vemcount: null,
        };
        const { getByTestId } = setup({ ...props });
        expect(getByTestId('locations-panel-content')).toBeInTheDocument();
    });

    const libhoursApi = {
        locations: [
            {
                lid: 3823,
                name: 'Architecture and Music',
                category: 'library',
                desc: '',
                url: 'https://web.library.uq.edu.au/locations-hours/architecture-music-library',
                contact: '',
                lat: '',
                long: '',
                color: '#1C6DBD',
                fn: '',
                day: 'Tuesday',
                times: {
                    status: 'not-set',
                },
                rendered: '',
                abbr: 'Arch Music',
                departments: [
                    {
                        lid: 10451,
                        name: 'Collections and space',
                        category: 'department',
                        desc: '',
                        url: '',
                        contact: '',
                        lat: '',
                        long: '',
                        color: '#000000',
                        parent_lid: 3823,
                        day: 'Tuesday',
                        times: {
                            status: 'open',
                            hours: [
                                {
                                    from: '7:31am',
                                    to: '7:30pm',
                                },
                                {
                                    from: '7:31am',
                                    to: '7:30pm',
                                },
                            ],
                            currently_open: true,
                        },
                        rendered: '7:31am - 7:30pm',
                        open: '07:30:00',
                        close: '19:30:00',
                    },
                    {
                        lid: 10779,
                        name: 'Collections and space',
                        category: 'department',
                        desc: '',
                        url: '',
                        contact: '',
                        lat: '',
                        long: '',
                        color: '#000000',
                        parent_lid: 3823,
                        day: 'Tuesday',
                        times: {
                            status: 'open',
                            hours: [
                                {
                                    from: '7:31am',
                                    to: '7:30pm',
                                },
                            ],
                        },
                        rendered: '7:31am - 7:30pm',
                        currently_open: true,
                        open: '07:30:00',
                        close: '19:30:00',
                    },
                ],
            },
            {
                lid: 4986,
                name: 'AskUs chat & phone assistance',
                category: 'library',
                desc: '',
                url: 'https://web.library.uq.edu.au/contact-us',
                contact: '',
                lat: '',
                long: '',
                color: '#000000',
                fn: '',
                day: 'Tuesday',
                times: {
                    status: 'not-set',
                },
                rendered: '',
                abbr: 'AskUs',
                departments: [
                    {
                        lid: 4987,
                        name: 'Chat',
                        category: 'department',
                        desc: '',
                        url: '',
                        contact: '',
                        lat: '',
                        long: '',
                        color: '#000000',
                        parent_lid: 4986,
                        day: 'Tuesday',
                        times: {
                            status: 'open',
                            hours: [
                                {
                                    from: '8am',
                                    to: '8pm',
                                },
                                {
                                    from: '8am',
                                    to: '8pm',
                                },
                            ],
                            currently_open: true,
                        },
                        rendered: '8am - 8pm',
                        open: '08:00:00',
                        close: '20:00:00',
                    },
                    {
                        lid: 10490,
                        name: 'Phone',
                        category: 'department',
                        desc: '',
                        url: '',
                        contact: '',
                        lat: '',
                        long: '',
                        color: '#000000',
                        parent_lid: 4986,
                        day: 'Tuesday',
                        times: {
                            status: 'open',
                            hours: [
                                {
                                    from: '8am',
                                    to: '8pm',
                                },
                            ],
                            currently_open: true,
                        },
                        rendered: '8am - 8pm',
                        open: '08:00:00',
                        close: '20:00:00',
                    },
                ],
            },
            {
                lid: 3966,
                name: 'Whitty building, Mater',
                category: 'library',
                desc: '',
                url: 'https://web.library.uq.edu.au/locations-hours',
                contact: '',
                lat: '',
                long: '',
                color: '#0E6E0E',
                fn: 'Access to Whitty Building is restricted to UQ Mater students on clinical placement.',
                day: 'Tuesday',
                times: {
                    status: 'not-set',
                },
                rendered: '',
                abbr: 'Whitty Mater',
            },
            {
                lid: null,
                name: 'Doesnt Exist, Whitty',
                category: 'library',
                desc: '',
                url: 'https://web.library.uq.edu.au/locations-hours',
                contact: '',
                lat: '',
                long: '',
                color: '#0E6E0E',
                fn: 'Access to Whitty Building is restricted to UQ Mater students on clinical placement.',
                day: 'Tuesday',
                times: {
                    status: 'not-set',
                },
                rendered: '',
                abbr: 'Whitty Mater',
            },
        ],
    };
    const vemcountApi = {
        data: {
            dateLoaded: '2024-10-31 10:00:21',
            locationList: [
                {
                    id: 7877,
                    headCount: 90,
                    capacity: 105,
                    name: 'Armus',
                },
                {
                    id: 7878,
                    headCount: 290,
                    capacity: 595,
                    name: 'BSL',
                },
            ],
        },
    };

    it('should handle display resize', () => {
        const props = {
            libHoursLoading: false,
            libHoursError: false,
            libHours: libhoursApi,
            vemcountLoading: false,
            vemcountError: false,
            vemcount: vemcountApi,
        };
        const { getByTestId, queryByTestId } = setup({ ...props });

        expect(getByTestId('hours-item-askus')).toBeInTheDocument();

        window.innerWidth = 400;
        fireEvent.resize(window, { target: { width: 400, height: 600 } });
        expect(queryByTestId('hours-item-askus')).toBeNull();
    });
});
describe('the departments are shown correctly', () => {
    it('should know a library has departments', () => {
        expect(hasDepartments(validWhitty)).toEqual(true);
    });
    it('should know a library has no displayable departments', () => {
        const testdata = {
            alt: 'Fryer',
            campus: 'St Lucia',
            departments: [
                {
                    hours: 'ByApp',
                    name: 'AskUs desk & collections', // <-- this name isnt in hoursLocale.departmentsMap
                },
            ],
            name: 'FW Robinson Reading Room',
            url: 'https://web.library.uq.edu.au/locations-hours/',
        };
        expect(hasDepartments(testdata)).toEqual(false);
    });
});
describe('name setting', () => {
    it('the aria label is correct', () => {
        expect(ariaLabelForLocation(validWhitty).trim()).toEqual(
            'The Whitty Mater Library study space is open 6:30am to 10pm.',
        );
    });
});
