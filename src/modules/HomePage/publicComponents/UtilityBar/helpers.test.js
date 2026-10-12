import { ASKUS_SPRINGSHARE_ID, FRYER_SPRINGSHARE_ID, GATTON_SPRINGSHARE_ID } from 'config/locale';
import {
    VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING,
    vemcountPercentByLocation,
    getVemcountPercentage,
    getTextForBusyness,
    ariaLabelForLocation,
    setLocationPanelAsClosed,
    setLocationPanelAsOpen,
} from './helpers';

const busyLookup = {
    1: 'not busy',
    2: 'moderately busy',
    3: 'quite busy',
    4: 'very busy',
};

const location = {
    lid: 3823,
    displayName: 'Architecture and Music',
    isCurrentlyOpen: true,
    openingHours: '8AM - 6PM',
    busyness: 25,
};

describe('Vemcount calculations', () => {
    const locationList = [{ id: 7877, headCount: 10, capacity: 40 }];

    it('calculates the raw percentage for a matching zone', () => {
        expect(vemcountPercentByLocation(7877, locationList)).toBe(25);
        expect(getVemcountPercentage(7877, locationList)).toBe(25);
    });

    it('reports missing zones and ignores locations without a zone', () => {
        expect(vemcountPercentByLocation(9999, locationList)).toBe(VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING);
        expect(getVemcountPercentage(9999, locationList)).toBe(VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING);
        expect(getVemcountPercentage(null, locationList)).toBeNull();
    });

    it.each([
        [1, 5],
        [10, 25],
        [35, 87],
        [50, 100],
    ])('clamps and floors %s people to %s percent', (headCount, expected) => {
        expect(getVemcountPercentage(7877, [{ id: 7877, headCount, capacity: 40 }])).toBe(expected);
    });

    it('reports invalid capacity as missing data', () => {
        expect(getVemcountPercentage(7877, [{ id: 7877, headCount: 0, capacity: 0 }])).toBe(
            VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING,
        );
    });
});

describe('getTextForBusyness', () => {
    it('maps occupancy percentages at the category boundaries', () => {
        [
            [1, 'not busy'],
            [25, 'not busy'],
            [26, 'moderately busy'],
            [50, 'moderately busy'],
            [51, 'quite busy'],
            [75, 'quite busy'],
            [76, 'very busy'],
        ].forEach(([busyness, label]) => {
            expect(getTextForBusyness({ ...location, busyness }, busyLookup)).toBe(label);
        });
    });

    it.each([
        ['AskUs assistance', { lid: ASKUS_SPRINGSHARE_ID }],
        ['no occupancy', { busyness: null }],
        ['zero occupancy', { busyness: 0 }],
        ['missing occupancy data', { busyness: VEMCOUNT_LOCATION_DATA_EXPECTED_BUT_MISSING }],
        ['a closed location', { isCurrentlyOpen: false }],
    ])('omits busyness for %s', (_, overrides) => {
        expect(getTextForBusyness({ ...location, ...overrides }, busyLookup)).toBeNull();
    });

    it('returns null when the lookup has no label for the occupancy level', () => {
        expect(getTextForBusyness(location, {})).toBeNull();
    });
});

describe('ariaLabelForLocation', () => {
    it('formats library hours and appends the current busyness', () => {
        expect(ariaLabelForLocation(location)).toBe(
            'The Architecture and Music Library study space is open 8am to 6pm. This space is currently not busy.',
        );
    });

    it('uses operating-hours wording without occupancy for AskUs', () => {
        expect(ariaLabelForLocation({ ...location, lid: ASKUS_SPRINGSHARE_ID })).toBe(
            'AskUs chat assistance operating hours today is open 8am to 6pm.',
        );
    });

    it.each([
        [FRYER_SPRINGSHARE_ID, 'Fryer Library'],
        [GATTON_SPRINGSHARE_ID, 'the JK Murray Library'],
    ])('uses "Click through to the location page" wording for %s (%s)', (lid, libraryName) => {
        expect(ariaLabelForLocation({ ...location, lid, openingHours: 'See location' })).toBe(
            `Click through to the location page for ${libraryName} hours and busy level.`,
        );
    });

    it('omits the busy level when the location is closed', () => {
        expect(ariaLabelForLocation({ ...location, isCurrentlyOpen: false })).toBe(
            'The Architecture and Music Library study space is open 8am to 6pm.',
        );
    });
});

describe('location panel state', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('toggles panel accessibility and opener classes', () => {
        document.body.innerHTML = `
            <div id="locations-wrapper" class="locations-wrapper-open"></div>
            <button id="location-dialog-controller" class="panel-open"></button>
        `;
        const locationsPanel = document.getElementById('locations-wrapper');
        const openerButton = document.getElementById('location-dialog-controller');

        setLocationPanelAsClosed();

        expect(locationsPanel).toHaveAttribute('inert', 'true');
        expect(locationsPanel).not.toHaveClass('locations-wrapper-open');
        expect(openerButton).not.toHaveClass('panel-open');
        expect(openerButton).toHaveClass('panel-closed');

        setLocationPanelAsOpen();

        expect(locationsPanel).not.toHaveAttribute('inert');
        expect(locationsPanel).toHaveClass('locations-wrapper-open');
        expect(openerButton).toHaveClass('panel-open');
        expect(openerButton).not.toHaveClass('panel-closed');
    });

    it('does not throw when panel elements are absent', () => {
        expect(() => setLocationPanelAsClosed()).not.toThrow();
        expect(() => setLocationPanelAsOpen()).not.toThrow();
    });
});
