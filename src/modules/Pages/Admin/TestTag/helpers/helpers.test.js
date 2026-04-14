import {
    capitaliseLeadingChar,
    isEmptyStr,
    isEmptyObject,
    createLocationString,
    isInvalidUUID,
    isInvalidTeamSlug,
    createLocationLink,
} from './helpers';
import { render } from '@testing-library/react';

export const assertLocationLinkless = el => {
    expect(el).toBeInTheDocument();
    expect(el.closest('a')).toBeNull();
    return el;
};

export const assertLocationLink = (el, expectedHref) => {
    expect(el).toBeInTheDocument();
    const link = el.closest('a');
    expect(link).toBeInTheDocument();
    expect(link).toContainElement(el);
    expect(link).toHaveAttribute('href', expectedHref);
    expect(link).toHaveAttribute('target', '_blank');
    return el;
};

describe('helpers', () => {
    it('capitaliseLeadingChar operates correctly', () => {
        expect(capitaliseLeadingChar('test')).toEqual('Test');
        expect(capitaliseLeadingChar('Test')).toEqual('Test');
        expect(capitaliseLeadingChar('TesT')).toEqual('Test');
        expect(capitaliseLeadingChar('TEST')).toEqual('Test');
    });
    it('isEmptyStr operates correctly', () => {
        expect(isEmptyStr('test')).toEqual(false);
        expect(isEmptyStr('')).toEqual(true);
        expect(isEmptyStr(null)).toEqual(true);
        expect(isEmptyStr(undefined)).toEqual(true);
        expect(isEmptyStr([])).toEqual(true);
        expect(isEmptyStr({})).toEqual(true);
        expect(isEmptyStr(['a'])).toEqual(true);
        expect(isEmptyStr({ a: 'a' })).toEqual(true);
    });
    it('isEmptyObject operates correctly', () => {
        expect(isEmptyObject('test')).toEqual(true);
        expect(isEmptyObject('')).toEqual(true);
        expect(isEmptyObject(null)).toEqual(true);
        expect(isEmptyObject(undefined)).toEqual(true);
        expect(isEmptyObject([])).toEqual(true);
        expect(isEmptyObject({})).toEqual(true);
        expect(isEmptyObject(['a'])).toEqual(true);
        expect(isEmptyObject({ a: 'a' })).toEqual(false);
    });
    it('createLocationString operates correctly', () => {
        expect(createLocationString({ site: 'test1', building: 'test2', floor: 'test3', room: 'test4' })).toEqual(
            'test3-test4 test2, test1',
        );
    });
    describe('createLocationLink', () => {
        it('should return given text when url is not given or is empty', () => {
            {
                const { container } = render(createLocationLink('my location'));
                expect(assertLocationLinkless(container)).toHaveTextContent('my location');
            }
            {
                const { container } = render(createLocationLink('my location', null));
                expect(assertLocationLinkless(container)).toHaveTextContent('my location');
            }
            {
                const { container } = render(createLocationLink('my location', '   '));
                expect(assertLocationLinkless(container)).toHaveTextContent('my location');
            }
        });

        it('should return link for given text and url', () => {
            const { getByTestId } = render(createLocationLink('my location', 'http://example.com'));
            expect(assertLocationLink(getByTestId('location-link'))).toHaveTextContent('my location');
        });
    });
    it('isInvalidUUID operates correctly', () => {
        expect(isInvalidUUID('A')).toEqual(true);
        expect(isInvalidUUID('a')).toEqual(false);
        expect(isInvalidUUID('123456789012345678901')).toEqual(true);
    });
    it('isInvalidTeamSlug operates correctly', () => {
        expect(isInvalidTeamSlug('')).toEqual(true);
        expect(isInvalidTeamSlug(null)).toEqual(true);
        expect(isInvalidTeamSlug(undefined)).toEqual(true);
        expect(isInvalidTeamSlug('abcdefghijk')).toEqual(true); // 11 chars, exceeds 10
        expect(isInvalidTeamSlug('abcdefghij')).toEqual(false); // exactly 10 chars
    });
});
