import { act, renderHook } from '@testing-library/react-hooks';
import { useLocation, useSelectLocation } from './LocationPickerHooks';

describe('LocationPickerHooks', () => {
    describe('useLocation', () => {
        it('standard defaults', () => {
            const { result } = renderHook(() => useLocation());
            const { location } = result.current;
            expect(location).toEqual(expect.objectContaining({ site: -1, building: -1, floor: -1, room: -1 }));
        });
        it('defined defaults', () => {
            const { result } = renderHook(props => useLocation(...props), {
                initialProps: [1, 2, 3, 4],
            });
            const { location } = result.current;
            expect(location).toEqual(expect.objectContaining({ site: 1, building: 2, floor: 3, room: 4 }));
        });
        it('update location', () => {
            const { result, rerender } = renderHook(() => useLocation());
            const { location, setLocation } = result.current;
            expect(location).toEqual(expect.objectContaining({ site: -1, building: -1, floor: -1, room: -1 }));
            const newLocation = { site: 1, building: 2, floor: 3, room: 4 };
            act(() => {
                setLocation(newLocation);
            });
            rerender();
            expect(result.current.location).toEqual(expect.objectContaining(newLocation));
        });
        it('update location and reset to defaults', () => {
            const { result, rerender } = renderHook(() => useLocation());
            const { location, setLocation, resetLocation } = result.current;
            expect(location).toEqual(expect.objectContaining({ site: -1, building: -1, floor: -1, room: -1 }));
            const newLocation = { site: 1, building: 2, floor: 3, room: 4 };
            act(() => {
                setLocation(newLocation);
            });
            rerender();
            expect(result.current.location).toEqual(expect.objectContaining(newLocation));
            act(() => {
                resetLocation();
            });
            rerender();
            expect(result.current.location).toEqual(
                expect.objectContaining({ site: -1, building: -1, floor: -1, room: -1 }),
            );
        });
    });
    describe('useSelectLocation', () => {
        it('standard defaults', () => {
            const { result } = renderHook(() => useSelectLocation());
            const { selectedLocation, lastSelectedLocation } = result.current;
            expect(selectedLocation).toEqual('site');
            expect(lastSelectedLocation).toEqual('site');
        });
        it('defined defaults', () => {
            const { result } = renderHook(props => useSelectLocation(props), { initialProps: { initial: 'building' } });
            const { selectedLocation, lastSelectedLocation } = result.current;
            expect(selectedLocation).toEqual('building');
            expect(lastSelectedLocation).toEqual('building');
        });
        it('should call the loadSites function on first render', () => {
            const mockLoadSitesFn = jest.fn();
            const actions = { loadSites: mockLoadSitesFn };
            renderHook(props => useSelectLocation(props), { initialProps: { actions } });
            expect(mockLoadSitesFn).toHaveBeenCalled();
        });
        it('should skip processing if conditional function returns false', () => {
            const mockConditionFn = jest.fn(() => false);
            const mockLoadSitesFn = jest.fn();
            const actions = { loadSites: mockLoadSitesFn };
            renderHook(props => useSelectLocation(props), { initialProps: { actions, condition: mockConditionFn } });
            expect(mockLoadSitesFn).not.toHaveBeenCalled();
        });
        it('should return if site, floor or rooms are loading', () => {
            const mockLoadSitesFn = jest.fn();
            const actions = { loadSites: mockLoadSitesFn };
            renderHook(props => useSelectLocation(props), { initialProps: { actions } });
            expect(mockLoadSitesFn).toHaveBeenCalled();
        });
    });
});
