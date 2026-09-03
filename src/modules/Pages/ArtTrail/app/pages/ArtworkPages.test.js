import React from 'react';
import { fireEvent, rtlRender, userEvent } from 'test-utils';

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
        artworkTitles: ['Sand Hills'],
        detailsTextPattern: /Despite her reductive palette, Napangardi imbues these works with movement/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        artDrawerTextPatterns: [/Lily Kelly Napangardi.*Sand Hills.*2007/i],
        locationDrawerTextPattern: /Level 1, Duhig Tower \(Building 2\), St Lucia campus/i,
    },
    {
        name: 'DevilMountainLizard',
        PageComponent: DevilMountainLizard,
        artworkTitles: ['Devil Mountain Lizard Dreaming'],
        detailsTextPattern: /The artist's work demonstrates a deep connection with Country/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        artDrawerTextPatterns: [/Gloria Tamerre Petyarre.*Devil Mountain Lizard Dreaming.*1997/i],
        locationDrawerTextPattern: /Level 1, Duhig Tower \(Building 2\), St Lucia campus/i,
    },
    {
        name: 'Kunawarritji',
        PageComponent: Kunawarritji,
        artworkTitles: ['Kunawarritji 1', 'Kunawarritji 2'],
        detailsTextPattern: /You can see the expressive brushstrokes within each of these works/i,
        infoButtonCount: 2,
        locationButtonCount: 2,
        artDrawerTextPatterns: [
            /Nora Wompi Nungurrayi.*Kunawarritji 1.*2012/i,
            /Nora Wompi Nungurrayi.*Kunawarritji 2.*2012/i,
        ],
        locationDrawerTextPattern: /Level 2, Duhig Tower \(Building 2\), St Lucia campus/i,
    },
    {
        name: 'PenuTjukurpa',
        PageComponent: PenuTjukurpa,
        artworkTitles: ['Punu Tjukurpa'],
        detailsTextPattern: /For Anangu communities, the tree is a significant motif for ancestry and family\./i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        artDrawerTextPatterns: [/Hector Tjupuru Burton.*Punu Tjukurpa.*2013/i],
        locationDrawerTextPattern: /Level 1, Duhig Tower \(Building 2\), St Lucia campus/i,
    },
    {
        name: 'Pikkuw',
        PageComponent: Pikkuw,
        artworkTitles: ['Pikkuw (Saltwater crocodile)'],
        detailsTextPattern: /The carving is of a male saltwater crocodile named Pikkuw/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        artDrawerTextPatterns: [/Craig Koomeeta.*Pikkuw \(Saltwater crocodile\).*2008/i],
        locationDrawerTextPattern: /Near the AskUs desk on Level 1, Central Library \(Building 12\), St Lucia campus/i,
    },
    {
        name: 'Whispers',
        PageComponent: Whispers,
        artworkTitles: ['Whispers (Poles)'],
        detailsTextPattern: /Cope's recent practice is informed by her cultural relationships/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        artDrawerTextPatterns: [/Megan Cope.*Whispers \(Poles\).*2023/i],
        locationDrawerTextPattern: /On Level 1, Central Library \(Building 12\), St Lucia campus.*near the AskUs desk/i,
    },
    {
        name: 'Warual',
        PageComponent: Warual,
        artworkTitles: ['Warual III (Green Turtle)'],
        detailsTextPattern: /Brian is a multi-skilled contemporary artist and is internationally recognised/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        artDrawerTextPatterns: [/Brian Robinson.*Warual III \(Green Turtle\).*2015/i],
        locationDrawerTextPattern: /Near the kitchen and exit on Level 2, Central Library \(Building 12\)/i,
    },
    {
        name: 'Tingari',
        PageComponent: Tingari,
        artworkTitles: ['Tingari ceremonies at Wilkinkarra'],
        detailsTextPattern: /This work considers migration and movements across long expanses of Country/i,
        infoButtonCount: 1,
        locationButtonCount: 1,
        artDrawerTextPatterns: [/Johnny Yungut Tjupurrula.*Tingari ceremonies at Wilkinkarra.*2003/i],
        locationDrawerTextPattern: /Level 1, Duhig Tower \(Building 2\), St Lucia campus/i,
    },
];

const setup = (
    PageComponent,
    {
        openInformationDrawer = jest.fn(),
        openLocationDrawer = jest.fn(),
        handleAccordionChange = jest.fn(),
        handleMediaEvent = jest.fn(),
        ...props
    } = {},
) => ({
    openInformationDrawer,
    openLocationDrawer,
    handleAccordionChange,
    handleMediaEvent,
    ...rtlRender(
        <PageComponent
            openInformationDrawer={openInformationDrawer}
            openLocationDrawer={openLocationDrawer}
            handleAccordionChange={handleAccordionChange}
            handleMediaEvent={handleMediaEvent}
            {...props}
        />,
    ),
});

describe('Artwork pages', () => {
    describe.each(expandablePageCases)(
        '$name',
        ({
            PageComponent,
            artworkTitles,
            detailsTextPattern,
            infoButtonCount,
            locationButtonCount,
            artDrawerTextPatterns,
            locationDrawerTextPattern,
        }) => {
            it('wires artwork overlay buttons to openInformationDrawer', async () => {
                const { getAllByRole, openInformationDrawer } = setup(PageComponent);

                const infoButtons = getAllByRole('button', { name: /^More information about / });

                expect(infoButtons).toHaveLength(infoButtonCount);

                for (const button of infoButtons) {
                    await userEvent.click(button);
                }

                expect(openInformationDrawer).toHaveBeenCalledTimes(infoButtonCount);
                for (const [index, [DrawerContentComponent, title]] of openInformationDrawer.mock.calls.entries()) {
                    expect(DrawerContentComponent).toEqual(expect.any(Function));
                    expect(title).toBe(artworkTitles[index]);
                }
            });

            it('wires location overlay buttons to openLocationDrawer', async () => {
                const { getAllByRole, openLocationDrawer } = setup(PageComponent);
                const locationButtons = getAllByRole('button', { name: /^Location information about / });

                expect(locationButtons).toHaveLength(locationButtonCount);

                for (const button of locationButtons) {
                    await userEvent.click(button);
                }

                expect(openLocationDrawer).toHaveBeenCalledTimes(locationButtonCount);
                for (const [index, [DrawerContentComponent, title]] of openLocationDrawer.mock.calls.entries()) {
                    expect(DrawerContentComponent).toEqual(expect.any(Function));
                    expect(title).toBe(artworkTitles[index]);
                }
            });

            it('renders the expected artwork and location drawer content', async () => {
                const { getAllByRole, openInformationDrawer, openLocationDrawer, unmount } = setup(PageComponent);
                const infoButtons = getAllByRole('button', { name: /^More information about / });
                const locationButtons = getAllByRole('button', { name: /^Location information about / });

                for (const button of infoButtons) {
                    await userEvent.click(button);
                }
                await userEvent.click(locationButtons[0]);
                unmount();

                for (const [index, artDrawerTextPattern] of artDrawerTextPatterns.entries()) {
                    const ArtDrawerContent = openInformationDrawer.mock.calls[index][0];
                    const renderedDrawer = rtlRender(<ArtDrawerContent />);

                    expect(renderedDrawer.container).toHaveTextContent(artDrawerTextPattern);
                    renderedDrawer.unmount();
                }

                const LocationDrawerContent = openLocationDrawer.mock.calls[0][0];
                const renderedLocationDrawer = rtlRender(<LocationDrawerContent />);

                expect(renderedLocationDrawer.getByRole('heading', { name: 'Artwork location' })).toBeInTheDocument();
                expect(renderedLocationDrawer.container).toHaveTextContent(locationDrawerTextPattern);
            });

            it('moves focus from the final location button to the artwork heading', async () => {
                const { getAllByRole, getByRole } = setup(PageComponent);
                const locationButtons = getAllByRole('button', { name: /^Location information about / });
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

            it('wires accordion expansion to handleAccordionChange', async () => {
                const { getByRole, handleAccordionChange } = setup(PageComponent);
                const accordionButton = getByRole('button', {
                    name: PageComponent === Tingari ? 'About the artist' : 'View more',
                });

                await userEvent.click(accordionButton);

                if (PageComponent === Tingari) {
                    expect(handleAccordionChange).toHaveBeenCalledWith(expect.any(Object), true);
                } else {
                    expect(handleAccordionChange).toHaveBeenCalledWith('View more', true);
                }
            });
        },
    );

    it('wires Continue Journey audio controls to handleMediaEvent', async () => {
        const play = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue();
        const pause = jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
        const { container, getByRole, handleMediaEvent } = setup(ContinueJourney, { mediaStopSignal: 'trail:9' });
        const audioElement = container.querySelector('audio');

        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 0,
        });

        await userEvent.click(getByRole('button', { name: 'Play audio' }));
        fireEvent.play(audioElement);
        audioElement.currentTime = 5;
        fireEvent.timeUpdate(audioElement);
        await userEvent.click(getByRole('button', { name: 'Stop audio playback' }));
        await userEvent.click(getByRole('button', { name: 'Reset audio playback' }));
        fireEvent.ended(audioElement);

        expect(handleMediaEvent.mock.calls).toEqual([['play'], ['stop'], ['reset'], ['complete']]);

        play.mockRestore();
        pause.mockRestore();
    });

    it('wires Continue Journey accordions to handleAccordionChange', async () => {
        const { getByRole, handleAccordionChange } = setup(ContinueJourney, { mediaStopSignal: 'trail:9' });

        await userEvent.click(getByRole('button', { name: 'Audio transcript' }));

        expect(handleAccordionChange).toHaveBeenCalledWith(expect.any(Object), true);
    });

    it('renders Continue Journey resources, transcript, and audio content', async () => {
        const { getByRole, getByText } = setup(ContinueJourney, { mediaStopSignal: 'trail:9' });

        expect(getByRole('heading', { name: 'Continue your journey' })).toBeInTheDocument();
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
