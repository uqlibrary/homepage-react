import React from 'react';
import { rtlRender, userEvent } from 'test-utils';

import DevilMountainLizard from './DevilMountainLizard';
import Kunawarritji from './Kunawarritji';
import PenuTjukurpa from './PenuTjukurpa';
import Pikkuw from './Pikkuw';
import SandHills from './SandHills';
import Tingari from './Tingari';
import Warual from './Warual';
import Whispers from './Whispers';

const expandablePageCases = [
    {
        name: 'SandHills',
        PageComponent: SandHills,
        detailsTextPattern: /Despite her reductive palette, Napangardi imbues these works with movement/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
    },
    {
        name: 'DevilMountainLizard',
        PageComponent: DevilMountainLizard,
        detailsTextPattern: /The artist's work demonstrates a deep connection with Country/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
    },
    {
        name: 'Kunawarritji',
        PageComponent: Kunawarritji,
        detailsTextPattern: /You can see the expressive brushstrokes within each of these works/i,
        infoButtonCount: 2,
        locationButtonCount: 2,
        uniqueDrawerCount: 3,
    },
    {
        name: 'PenuTjukurpa',
        PageComponent: PenuTjukurpa,
        detailsTextPattern: /For Anangu communities, the tree is a significant motif for ancestry and family\./i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
    },
    {
        name: 'Pikkuw',
        PageComponent: Pikkuw,
        detailsTextPattern: /The carving is of a male saltwater crocodile named Pikkuw/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
    },
    {
        name: 'Whispers',
        PageComponent: Whispers,
        detailsTextPattern: /Cope's recent practice is informed by her cultural relationships/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
    },
    {
        name: 'Warual',
        PageComponent: Warual,
        detailsTextPattern: /Brian is a multi-skilled contemporary artist and is internationally recognised/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
    },
    {
        name: 'Tingari',
        PageComponent: Tingari,
        detailsTextPattern: /This work considers migration and movements across long expanses of Country/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
    },
];

const setup = (PageComponent, { openDrawer = jest.fn(), ...props } = {}) => ({
    openDrawer,
    ...rtlRender(<PageComponent openDrawer={openDrawer} {...props} />),
});

describe('Artwork pages', () => {
    describe.each(expandablePageCases)(
        '$name',
        ({ PageComponent, detailsTextPattern, infoButtonCount, locationButtonCount, uniqueDrawerCount }) => {
            it('wires the artwork and location overlay buttons to openDrawer', async () => {
                const openDrawer = jest.fn();
                const { getAllByRole } = setup(PageComponent, { openDrawer });

                const infoButtons = getAllByRole('button', { name: 'More information about this artwork' });
                const locationButtons = getAllByRole('button', {
                    name: 'Location information about this artwork',
                });

                expect(infoButtons).toHaveLength(infoButtonCount);
                expect(locationButtons).toHaveLength(locationButtonCount);

                for (const button of infoButtons) {
                    await userEvent.click(button);
                }

                for (const button of locationButtons) {
                    await userEvent.click(button);
                }

                expect(openDrawer).toHaveBeenCalledTimes(infoButtonCount + locationButtonCount);
                for (const [DrawerContentComponent] of openDrawer.mock.calls) {
                    expect(DrawerContentComponent).toEqual(expect.any(Function));
                }
                expect(
                    new Set(openDrawer.mock.calls.map(([DrawerContentComponent]) => DrawerContentComponent)).size,
                ).toBe(uniqueDrawerCount);
            });

            it('renders the expected about-the-artwork disclosure content', async () => {
                const { getByRole, queryByRole, queryByText } = setup(PageComponent);

                if (PageComponent === Tingari) {
                    expect(queryByText(detailsTextPattern)).toBeInTheDocument();
                    expect(getByRole('heading', { name: 'About the artwork' })).toBeInTheDocument();
                    expect(queryByRole('button', { name: 'View more' })).not.toBeInTheDocument();
                    expect(queryByRole('button', { name: 'View less' })).not.toBeInTheDocument();
                    return;
                }

                expect(queryByText(detailsTextPattern)).not.toBeInTheDocument();

                await userEvent.click(getByRole('button', { name: 'View more' }));

                expect(queryByText(detailsTextPattern)).toBeInTheDocument();

                await userEvent.click(getByRole('button', { name: 'View less' }));

                expect(queryByText(detailsTextPattern)).not.toBeInTheDocument();
            });
        },
    );
});
