import React from 'react';
import { rtlRender, userEvent } from 'test-utils';

import ContinueJourney from './ContinueJourney';
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
        artDrawerTextPatterns: [/Lily Kelly Napangardi.*Sand Hills.*2007/i],
        locationDrawerTextPattern: /Where: Level 1, Duhig Tower \(Building 2\), St Lucia campus/i,
    },
    {
        name: 'DevilMountainLizard',
        PageComponent: DevilMountainLizard,
        detailsTextPattern: /The artist's work demonstrates a deep connection with Country/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
        artDrawerTextPatterns: [/Gloria Tamerre Petyarre.*Devil Mountain Lizard Dreaming.*1997/i],
        locationDrawerTextPattern: /Where: Level 1, Duhig Tower \(Building 2\), St Lucia campus/i,
    },
    {
        name: 'Kunawarritji',
        PageComponent: Kunawarritji,
        detailsTextPattern: /You can see the expressive brushstrokes within each of these works/i,
        infoButtonCount: 2,
        locationButtonCount: 2,
        uniqueDrawerCount: 3,
        artDrawerTextPatterns: [
            /Nora Wompi Nungurrayi.*Kunawarritji 1.*2012/i,
            /Nora Wompi Nungurrayi.*Kunawarritji 2.*2012/i,
        ],
        locationDrawerTextPattern: /Where: Level 2, Duhig Tower \(Building 2\), St Lucia campus/i,
    },
    {
        name: 'PenuTjukurpa',
        PageComponent: PenuTjukurpa,
        detailsTextPattern: /For Anangu communities, the tree is a significant motif for ancestry and family\./i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
        artDrawerTextPatterns: [/Hector Tjupuru Burton.*Punu Tjukurpa.*2013/i],
        locationDrawerTextPattern: /Where: Level 1, Duhig Tower \(Building 2\), St Lucia campus/i,
    },
    {
        name: 'Pikkuw',
        PageComponent: Pikkuw,
        detailsTextPattern: /The carving is of a male saltwater crocodile named Pikkuw/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
        artDrawerTextPatterns: [/Craig Koomeeta.*Pikkuw \(Saltwater crocodile\).*2008/i],
        locationDrawerTextPattern: /Near the AskUs desk on Level 1, Central Library \(Building 12\), St Lucia campus/i,
    },
    {
        name: 'Whispers',
        PageComponent: Whispers,
        detailsTextPattern: /Cope's recent practice is informed by her cultural relationships/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
        artDrawerTextPatterns: [/Megan Cope.*Whispers \(Poles\).*2023/i],
        locationDrawerTextPattern: /On Level 1, Central Library \(Building 12\), St Lucia campus.*near the AskUs desk/i,
    },
    {
        name: 'Warual',
        PageComponent: Warual,
        detailsTextPattern: /Brian is a multi-skilled contemporary artist and is internationally recognised/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
        artDrawerTextPatterns: [/Brian Robinson.*Warual III \(Green Turtle\).*2015/i],
        locationDrawerTextPattern: /Near the kitchen and exit on Level 2, Central Library \(Building 12\)/i,
    },
    {
        name: 'Tingari',
        PageComponent: Tingari,
        detailsTextPattern: /This work considers migration and movements across long expanses of Country/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        uniqueDrawerCount: 2,
        artDrawerTextPatterns: [/Johnny Yungut Tjupurrula.*Tingari ceremonies at Wilkinkarra.*2003/i],
        locationDrawerTextPattern: /Where: Level 1, Duhig Tower \(Building 2\), St Lucia campus/i,
    },
];

const setup = (PageComponent, { openDrawer = jest.fn(), ...props } = {}) => ({
    openDrawer,
    ...rtlRender(<PageComponent openDrawer={openDrawer} {...props} />),
});

describe('Artwork pages', () => {
    describe.each(expandablePageCases)(
        '$name',
        ({
            PageComponent,
            detailsTextPattern,
            infoButtonCount,
            locationButtonCount,
            uniqueDrawerCount,
            artDrawerTextPatterns,
            locationDrawerTextPattern,
        }) => {
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

            it('renders the expected artwork and location drawer content', async () => {
                const openDrawer = jest.fn();
                const { getAllByRole, unmount } = setup(PageComponent, { openDrawer });
                const infoButtons = getAllByRole('button', { name: 'More information about this artwork' });
                const locationButtons = getAllByRole('button', {
                    name: 'Location information about this artwork',
                });

                for (const button of infoButtons) {
                    await userEvent.click(button);
                }
                await userEvent.click(locationButtons[0]);
                unmount();

                for (const [index, artDrawerTextPattern] of artDrawerTextPatterns.entries()) {
                    const ArtDrawerContent = openDrawer.mock.calls[index][0];
                    const renderedDrawer = rtlRender(<ArtDrawerContent />);

                    expect(renderedDrawer.container).toHaveTextContent(artDrawerTextPattern);
                    renderedDrawer.unmount();
                }

                const LocationDrawerContent = openDrawer.mock.calls[infoButtonCount][0];
                const renderedLocationDrawer = rtlRender(<LocationDrawerContent />);

                expect(renderedLocationDrawer.getByRole('heading', { name: 'View the artwork' })).toBeInTheDocument();
                expect(renderedLocationDrawer.container).toHaveTextContent(locationDrawerTextPattern);
            });

            it('moves focus from the final location button to the artwork heading', async () => {
                const { getAllByRole, getByRole } = setup(PageComponent);
                const locationButtons = getAllByRole('button', {
                    name: 'Location information about this artwork',
                });
                const artworkHeading = getByRole('heading', { name: 'About the artwork' });

                locationButtons[locationButtons.length - 1].focus();
                await userEvent.tab();

                expect(artworkHeading).toHaveFocus();
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

    it('renders Continue Journey resources, transcript, and audio content', async () => {
        const { getByRole, getByText } = setup(ContinueJourney, { mediaStopSignal: 'trail:9' });

        expect(
            getByRole('heading', { name: 'Exploring Aboriginal and Torres Strait Islander stories' }),
        ).toBeInTheDocument();
        expect(getByRole('group', { name: 'Listen to this page' })).toBeInTheDocument();
        expect(
            getByText(/Thank you for exploring the Indigenous Art and Library Discovery Trail/i),
        ).toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Resources to continue your journey' }));

        expect(getByRole('link', { name: /UQ has a Blak history by Lesley Acres/i })).toHaveAttribute(
            'href',
            'https://uq.pressbooks.pub/uq-blak-history/',
        );
        expect(getByRole('link', { name: /Storying the archive by Tracey Bunda/i })).toBeInTheDocument();
        expect(
            getByRole('link', {
                name: /^The language of relationships with Aboriginal and Torres Strait Islander peoples - Introductory guide by/i,
            }),
        ).toBeInTheDocument();
        expect(getByRole('link', { name: 'Fryer Library' })).toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Audio transcript' }));

        expect(getByText(/The journey doesn't end here/i)).toBeInTheDocument();
    });
});
