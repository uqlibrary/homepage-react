import { act, renderHook } from '@testing-library/react-hooks';
import { useLocation, useSelectLocation } from './LocationPickerHooks';

const defaultLocation = { site: -1, building: -1, floor: -1, room: -1 };

describe('LocationPickerHooks', () => {
    describe('useLocation', () => {
        it('standard defaults', () => {
            const { result } = renderHook(() => useLocation());
            const { location } = result.current;
            expect(location).toEqual(expect.objectContaining(defaultLocation));
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
            expect(location).toEqual(expect.objectContaining(defaultLocation));
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
            expect(location).toEqual(expect.objectContaining(defaultLocation));
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
            expect(result.current.location).toEqual(expect.objectContaining(defaultLocation));
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
        it('should return if site list is loading', () => {
            const mockLoadSitesFn = jest.fn();
            const actions = { loadSites: mockLoadSitesFn };
            const { result } = renderHook(props => useSelectLocation(props), {
                initialProps: { actions, store: { siteListLoading: true } },
            });
            expect(mockLoadSitesFn).toHaveBeenCalled();
            expect(result.current.selectedLocation).toEqual('site');
            expect(result.current.lastSelectedLocation).toEqual('site');
        });
        it('should return if floor list is loading', () => {
            const mockLoadSitesFn = jest.fn();
            const actions = { loadSites: mockLoadSitesFn };
            const { result } = renderHook(props => useSelectLocation(props), {
                initialProps: { actions, store: { floorListLoading: true } },
            });
            expect(mockLoadSitesFn).toHaveBeenCalled();
            expect(result.current.selectedLocation).toEqual('site');
            expect(result.current.lastSelectedLocation).toEqual('site');
        });
        it('should return if room list is loading', () => {
            const mockLoadSitesFn = jest.fn();
            const actions = { loadSites: mockLoadSitesFn };
            const { result } = renderHook(props => useSelectLocation(props), {
                initialProps: { actions, store: { roomListLoading: true } },
            });
            expect(mockLoadSitesFn).toHaveBeenCalled();
            expect(result.current.selectedLocation).toEqual('site');
            expect(result.current.lastSelectedLocation).toEqual('site');
        });
        it('should return list of sites when loaded', () => {
            const mockLoadSitesFn = jest.fn(() => [{ site_id: 1 }, { site_id: 2 }]);
            const actions = { loadSites: mockLoadSitesFn };
            const { result } = renderHook(props => useSelectLocation(props), {
                initialProps: { actions, store: { siteListLoading: true } },
            });
            expect(mockLoadSitesFn).toHaveBeenCalled();
            expect(result.current.selectedLocation).toEqual('site');
            expect(result.current.lastSelectedLocation).toEqual('site');
        });
        it('should set initial state for Site', () => {
            const siteList = [{ site_id: 1 }, { site_id: 2 }];
            const mockSetRowFn = jest.fn();
            const mockSetLocationFn = jest.fn();
            const { result } = renderHook(props => useSelectLocation(props), {
                initialProps: {
                    store: {
                        siteListLoaded: true,
                        siteList,
                    },
                    location: defaultLocation,
                    setRow: mockSetRowFn,
                    setLocation: mockSetLocationFn,
                },
            });
            const expected = structuredClone(defaultLocation);
            delete expected.site;

            expect(result.current.selectedLocation).toEqual('site');
            expect(mockSetRowFn).toHaveBeenCalledWith(siteList);
            expect(mockSetLocationFn).toHaveBeenCalledWith(expected);
        });
        it('should set next state to building when site chosen', () => {
            const buildingList = [{ building_id: 10 }, { building_id: 11 }];
            const siteList = [{ site_id: 1, buildings: buildingList }, { site_id: 2 }];
            const mockSetRowFn = jest.fn();
            const mockSetLocationFn = jest.fn();
            const { result } = renderHook(props => useSelectLocation(props), {
                initialProps: {
                    store: {
                        siteListLoaded: true,
                        siteList,
                    },
                    location: { ...defaultLocation, site: 1 },
                    setRow: mockSetRowFn,
                    setLocation: mockSetLocationFn,
                },
            });
            const expected = structuredClone(defaultLocation);
            delete expected.site;

            expect(result.current.selectedLocation).toEqual('building');
            expect(result.current.lastSelectedLocation).toEqual('site');
            expect(mockSetRowFn).toHaveBeenCalledWith(buildingList);
        });
        it('should set initial state for floors', () => {
            const floorList = [{ floor_id: 20 }, { floor_id: 21 }];
            const siteList = [
                { site_id: 1, buildings: [{ building_id: 10, floors: floorList }, { building_id: 11 }] },
                { site_id: 2 },
            ];
            const mockSetRowFn = jest.fn();
            const mockSetLocationFn = jest.fn();
            const { result } = renderHook(props => useSelectLocation(props), {
                initialProps: {
                    store: {
                        floorListLoaded: true,
                        siteList,
                    },
                    location: { ...defaultLocation, site: 1 },
                    setRow: mockSetRowFn,
                    setLocation: mockSetLocationFn,
                },
            });
            const expected = structuredClone(defaultLocation);
            delete expected.site;
            delete expected.building;

            expect(mockSetRowFn).toHaveBeenCalledWith([]);
            expect(mockSetLocationFn).toHaveBeenCalledWith(expected);
            expect(result.current.selectedLocation).toEqual('floor');
            expect(result.current.lastSelectedLocation).toEqual('building');
        });
        it('should set floors row data when building selected', () => {
            const floorList = [{ floor_id: 20 }, { floor_id: 21 }];
            const siteList = [
                { site_id: 1, buildings: [{ building_id: 10, floors: floorList }, { building_id: 11 }] },
                { site_id: 2 },
            ];
            const mockSetRowFn = jest.fn();
            const mockSetLocationFn = jest.fn();
            const { result } = renderHook(props => useSelectLocation(props), {
                initialProps: {
                    store: {
                        floorListLoaded: true,
                        siteList,
                        floorList: { floors: floorList },
                    },
                    location: { ...defaultLocation, site: 1, building: 1 },
                    setRow: mockSetRowFn,
                    setLocation: mockSetLocationFn,
                },
            });
            const expected = structuredClone(defaultLocation);
            delete expected.site;
            delete expected.building;

            expect(mockSetRowFn).toHaveBeenCalledWith(floorList);
            expect(result.current.selectedLocation).toEqual('floor');
            expect(result.current.lastSelectedLocation).toEqual('building');
        });
        it('should set initial state for rooms', () => {
            const mockSetLocationFn = jest.fn();
            const { result } = renderHook(props => useSelectLocation(props), {
                initialProps: {
                    store: {
                        roomListLoaded: true,
                    },
                    location: { ...defaultLocation, site: 1, building: 1 },
                    setLocation: mockSetLocationFn,
                },
            });
            const expected = structuredClone(defaultLocation);
            delete expected.site;
            delete expected.building;
            delete expected.floor;

            expect(mockSetLocationFn).toHaveBeenCalledWith(expected);
            expect(result.current.lastSelectedLocation).toEqual('building');
            expect(result.current.selectedLocation).toEqual('room');
        });
        it('should set row data for rows when floor selected', () => {
            const roomList = [{ room_id: 30 }, { room_id: 31 }];
            const mockSetRowFn = jest.fn();
            const mockSetLocationFn = jest.fn();
            const { result } = renderHook(props => useSelectLocation(props), {
                initialProps: {
                    store: {
                        roomListLoaded: true,
                        roomList: { rooms: roomList },
                    },
                    location: { ...defaultLocation, site: 1, building: 1, floor: 1 },
                    setRow: mockSetRowFn,
                    setLocation: mockSetLocationFn,
                },
            });

            expect(mockSetRowFn).toHaveBeenCalledWith(roomList);
            expect(result.current.lastSelectedLocation).toEqual('floor');
            expect(result.current.selectedLocation).toEqual('room');
        });
        it('should set last selected location to room when room selected', () => {
            const { result } = renderHook(props => useSelectLocation(props), {
                initialProps: {
                    store: {
                        roomListLoaded: true,
                    },
                    location: { ...defaultLocation, site: 1, building: 1, floor: 1, room: 1 },
                },
            });

            expect(result.current.lastSelectedLocation).toEqual('room');
        });
    });
});
