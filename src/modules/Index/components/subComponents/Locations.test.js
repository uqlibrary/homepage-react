import React from 'react';
import Locations from './Locations';
import { rtlRender, WithRouter } from 'test-utils';
import { getByTestId } from '@testing-library/dom';
import { fireEvent } from '@testing-library/react';

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
                display_name: 'Architecture and Music',
                name: 'Architecture and Music',
                url: 'https://web.library.uq.edu.au/locations-hours/architecture-music-library',
                departments: [
                    {
                        lid: 10451,
                        name: 'Collections & space',
                        times: {
                            currently_open: true,
                        },
                        rendered: '7:31am - 7:30pm',
                    },
                    {
                        lid: 10779,
                        name: 'something else',
                        times: {
                            currently_open: true,
                        },
                        rendered: '7:31am - 7:30pm',
                    },
                ],
            },
            {
                lid: 4986,
                display_name: 'AskUs chat & phone assistance',
                name: 'AskUs chat & phone assistance',
                url: 'https://web.library.uq.edu.au/contact-us',
                times: {
                    status: 'not-set',
                },
                rendered: '',
                departments: [
                    {
                        lid: 4987,
                        name: 'Chat',
                        times: {
                            currently_open: true,
                        },
                        rendered: '8am - 8pm',
                    },
                    {
                        lid: 10490,
                        name: 'Phone',
                        times: {
                            currently_open: true,
                        },
                        rendered: '8am - 8pm',
                    },
                ],
            },
            {
                lid: 3966,
                display_name: 'Whitty building, Mater',
                name: 'Whitty building, Mater',
                url: 'https://web.library.uq.edu.au/locations-hours',
                times: {
                    status: 'not-set',
                },
                rendered: '',
            },
            {
                lid: null,
                display_name: 'Doesnt Exist',
                name: 'Doesnt Exist',
                url: 'https://example.com',
                times: {
                    status: 'not-set',
                },
                rendered: '',
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
