import React from 'react';
import { fireEvent, rtlRender, userEvent, waitFor } from 'test-utils';
import Cookies from 'js-cookie';

import ArtTrailApp from './index';
import { trailPages } from './pages';
import { action, analyticsId } from './config/trackingEvents';

const mockTrackPageView = jest.fn();
const mockTrackNavigationClick = jest.fn();
const mockTrackInformationDrawerClick = jest.fn();
const mockTrackAudioPlayerClick = jest.fn();
const mockTrackAudioPlayerComplete = jest.fn();
const mockTrackAccordionExpand = jest.fn();
const mockTrackMapPoiClick = jest.fn();

jest.mock('./hooks', () => ({
    ...jest.requireActual('./hooks'),
    useGoogleAnalytics: () => ({
        trackPageView: mockTrackPageView,
        trackNavigationClick: mockTrackNavigationClick,
        trackInformationDrawerClick: mockTrackInformationDrawerClick,
        trackAudioPlayerClick: mockTrackAudioPlayerClick,
        trackAudioPlayerComplete: mockTrackAudioPlayerComplete,
        trackAccordionExpand: mockTrackAccordionExpand,
        trackMapPoiClick: mockTrackMapPoiClick,
    }),
}));

jest.mock('./MapTabContent', () => {
    const React = jest.requireActual('react');
    const PropTypes = jest.requireActual('prop-types');
    const ActualMapTabContent = jest.requireActual('./MapTabContent').default;

    const MockMapTabContent = props => {
        return (
            <>
                <ActualMapTabContent {...props} />
                <button type="button" onClick={() => props.handleMapEvent('Punu Tjukurpa', 'mapMarker')}>
                    Track map marker
                </button>
            </>
        );
    };

    MockMapTabContent.propTypes = {
        handleMapEvent: PropTypes.func.isRequired,
    };

    return MockMapTabContent;
});

jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
}));

const culturalDisclaimerText =
    'Aboriginal and Torres Strait Islander peoples are advised that the following may contain images, voices or names of deceased persons in photographs, film, audio recordings or printed material';

const totalPages = trailPages.length - 1; // subtract initial welcome screen

const setup = () => rtlRender(<ArtTrailApp />);

describe('ArtTrailApp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        Cookies.get.mockReset();
        Cookies.set.mockReset();
        Cookies.get.mockReturnValue(undefined);
    });

    it('tracks each selected Trail and Map page by title', async () => {
        const { getByRole } = setup();

        expect(mockTrackPageView).toHaveBeenCalledWith(trailPages[0].pageTitle, 0);

        await userEvent.click(getByRole('button', { name: 'Start the trail' }));
        await userEvent.click(getByRole('button', { name: 'Art Trail by location on a map' }));

        expect(mockTrackPageView).toHaveBeenNthCalledWith(2, trailPages[1].pageTitle, 1);
        expect(mockTrackPageView).toHaveBeenNthCalledWith(3, 'Art Trail Map of St Lucia campus', 10);
    });

    it('tracks stepper navigation controls', async () => {
        const { getByRole } = setup();

        await userEvent.click(getByRole('button', { name: 'Start the trail' }));
        expect(mockTrackNavigationClick).toHaveBeenLastCalledWith({
            click_label: 'Start the trail',
            click_class: analyticsId.start,
        });

        await userEvent.click(getByRole('button', { name: 'Next page' }));
        expect(mockTrackNavigationClick).toHaveBeenLastCalledWith({
            click_label: 'Next',
            click_class: analyticsId.next,
        });

        await userEvent.click(getByRole('button', { name: 'Previous page' }));
        expect(mockTrackNavigationClick).toHaveBeenLastCalledWith({
            click_label: 'Prev',
            click_class: analyticsId.prev,
        });
    });

    it('tracks tab navigation controls', async () => {
        const { getByRole } = setup();

        await userEvent.click(getByRole('button', { name: 'Art Trail by location on a map' }));
        expect(mockTrackNavigationClick).toHaveBeenLastCalledWith({
            click_label: 'Map',
            click_class: analyticsId.map,
        });
    });

    it('tracks menu open and close controls', async () => {
        const { getByRole } = setup();
        const menuButton = getByRole('button', { name: 'open navigation menu' });

        await userEvent.click(menuButton);
        expect(mockTrackNavigationClick).toHaveBeenLastCalledWith({
            click_action: action.OPEN,
            click_label: 'Menu',
            click_class: analyticsId.menuOpen,
        });

        await userEvent.click(menuButton);
        expect(mockTrackNavigationClick).toHaveBeenLastCalledWith({
            click_action: action.CLOSE,
            click_label: 'Menu',
            click_class: analyticsId.menuClose,
        });
    });

    it('tracks audio play, stop, and reset controls', async () => {
        const play = jest.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue();
        const pause = jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
        const { container, getByRole } = setup();
        const audioElement = container.querySelector('audio');

        Object.defineProperty(audioElement, 'currentTime', {
            configurable: true,
            writable: true,
            value: 0,
        });

        await userEvent.click(getByRole('button', { name: 'Play audio' }));
        fireEvent.play(audioElement);
        expect(mockTrackAudioPlayerClick).toHaveBeenLastCalledWith({
            click_label: 'Listen to this page',
            click_class: analyticsId.play,
        });

        audioElement.currentTime = 5;
        fireEvent.timeUpdate(audioElement);
        await userEvent.click(getByRole('button', { name: 'Stop audio playback' }));
        expect(mockTrackAudioPlayerClick).toHaveBeenLastCalledWith({
            click_label: 'Listen to this page',
            click_class: analyticsId.stop,
        });

        await userEvent.click(getByRole('button', { name: 'Reset audio playback' }));
        expect(mockTrackAudioPlayerClick).toHaveBeenLastCalledWith({
            click_label: 'Listen to this page',
            click_class: analyticsId.reset,
        });

        play.mockRestore();
        pause.mockRestore();
    });

    it('tracks audio completion', () => {
        const pause = jest.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
        const { container } = setup();
        const audioElement = container.querySelector('audio');

        fireEvent.ended(audioElement);
        expect(mockTrackAudioPlayerComplete).toHaveBeenCalledWith({
            click_class: analyticsId.complete,
        });

        pause.mockRestore();
    });

    it('tracks accordion expansion', async () => {
        const { getByRole } = setup();

        await userEvent.click(getByRole('button', { name: 'Start the trail' }));
        await userEvent.click(getByRole('button', { name: 'View more' }));

        expect(mockTrackAccordionExpand).toHaveBeenCalledWith({
            click_label: 'View more',
            click_class: analyticsId.expandAccordion,
        });
    });

    it('tracks map marker interactions', async () => {
        const { getByRole } = setup();

        await userEvent.click(getByRole('button', { name: 'Art Trail by location on a map' }));
        await userEvent.click(getByRole('button', { name: 'Track map marker' }));

        expect(mockTrackMapPoiClick).toHaveBeenCalledWith({
            click_label: 'Punu Tjukurpa',
            click_class: analyticsId.mapMarker,
        });
    });

    it('renders the fixed app shell and sets the document title', () => {
        const { getByTestId, getByRole, queryByRole, queryByText } = setup();

        expect(getByTestId('art-trail-app')).toBeInTheDocument();
        expect(getByTestId('culturalDisclaimer')).toHaveTextContent(culturalDisclaimerText);
        expect(getByRole('button', { name: 'open navigation menu' })).toBeInTheDocument();
        expect(getByRole('button', { name: 'Art Trail in sequential order' })).toBeInTheDocument();
        expect(queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
        expect(getByRole('button', { name: 'Start the trail' })).toBeEnabled();
        expect(queryByText(`Page 1 of ${totalPages}`)).not.toBeInTheDocument();
        expect(document.title).toBe('The University of Queensland Indigenous Art and Library Discovery Trail');
    });

    it('focuses the initial heading and announces subsequent navigation', async () => {
        const { getByRole, getByTestId } = setup();
        const announcement = getByTestId('aria-announcement');

        expect(announcement).toBeEmptyDOMElement();
        await waitFor(() =>
            expect(
                getByRole('heading', { level: 1, name: 'Indigenous art and Library discovery trail' }),
            ).toHaveFocus(),
        );

        await userEvent.click(getByRole('button', { name: 'Start the trail' }));

        await waitFor(() => expect(announcement).toHaveTextContent(/Hector Tjupuru Burton/));
    });

    it('opens the menu and preserves the Trail page state across tab switches', async () => {
        const { getByRole, getByText, getByTestId, queryByRole, queryByText } = setup();

        await userEvent.click(getByRole('button', { name: 'open navigation menu' }));

        expect(getByRole('menuitem', { name: 'Indigenous art and Library discovery trail' })).toBeInTheDocument();
        expect(getByRole('menuitem', { name: /Hector Tjupuru Burton/i }).querySelector('em')).toHaveTextContent(
            'Punu Tjukurpa',
        );
        await userEvent.click(getByRole('menuitem', { name: 'Indigenous art and Library discovery trail' }));

        await userEvent.click(getByRole('button', { name: 'Start the trail' }));
        expect(getByRole('button', { name: 'Previous page' })).toBeEnabled();
        expect(getByRole('button', { name: 'Next page' })).toBeEnabled();
        expect(queryByText(`Page 1 of ${totalPages}`)).not.toBeInTheDocument();
        expect(getByText(`1 / ${totalPages}`)).toBeInTheDocument();
        expect(getByRole('button', { name: 'View more' })).toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Art Trail by location on a map' }));
        expect(queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument();
        expect(queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument();
        expect(queryByText('Find your way through the trail')).not.toBeInTheDocument();
        expect(getByTestId('mazemap-container')).toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Art Trail in sequential order' }));
        expect(getByRole('button', { name: 'Previous page' })).toBeEnabled();
        expect(queryByText(`Page 1 of ${totalPages}`)).not.toBeInTheDocument();
        expect(getByText(`1 / ${totalPages}`)).toBeInTheDocument();
        expect(getByRole('button', { name: 'View more' })).toBeInTheDocument();
    });

    it('opens and closes the page drawer from a Trail page', async () => {
        const { getByRole, getByText, queryByText } = setup();

        await userEvent.click(getByRole('button', { name: 'Start the trail' }));
        await userEvent.click(getByRole('button', { name: 'More information about Punu Tjukurpa' }));

        expect(mockTrackInformationDrawerClick).toHaveBeenCalledWith({
            click_label: 'More information about Punu Tjukurpa',
            click_class: analyticsId.information,
        });

        expect(getByRole('heading', { name: /Hector Tjupuru Burton/i })).toBeInTheDocument();
        expect(getByText(/synthetic polymer paint on linen/i)).toBeInTheDocument();

        await userEvent.keyboard('{Escape}');

        expect(queryByText(/synthetic polymer paint on linen/i)).not.toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Location information about Punu Tjukurpa' }));
        expect(mockTrackInformationDrawerClick).toHaveBeenLastCalledWith({
            click_label: 'Location information for Punu Tjukurpa',
            click_class: analyticsId.location,
        });
    });

    it('resets the scroll position when changing Trail pages', async () => {
        const { getByRole, getByTestId } = setup();

        const scrollContainer = getByTestId('art-trail-scroll-container');

        Object.defineProperty(scrollContainer, 'scrollTop', {
            configurable: true,
            writable: true,
            value: 240,
        });

        await userEvent.click(getByRole('button', { name: 'Start the trail' }));

        expect(scrollContainer.scrollTop).toBe(0);

        scrollContainer.scrollTop = 180;

        await userEvent.click(getByRole('button', { name: 'Next page' }));

        expect(scrollContainer.scrollTop).toBe(0);
    });

    it('dismisses the cultural disclaimer across tabs and persists dismissal in a cookie', async () => {
        const { getByRole, queryByText } = setup();

        await userEvent.click(getByRole('button', { name: 'Dismiss cultural disclaimer' }));

        expect(Cookies.set).toHaveBeenCalledWith('ART_TRAIL_CULTURAL_DISCLAIMER_SEEN', 'true', { path: '/' });
        expect(queryByText(culturalDisclaimerText)).not.toBeInTheDocument();

        await userEvent.click(getByRole('button', { name: 'Art Trail by location on a map' }));
        expect(queryByText(culturalDisclaimerText)).not.toBeInTheDocument();
    });

    it('does not render the cultural disclaimer when the dismissal cookie is true', () => {
        Cookies.get.mockReturnValue('true');

        const { queryByText } = setup();

        expect(queryByText(culturalDisclaimerText)).not.toBeInTheDocument();
    });
});
