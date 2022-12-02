import React from 'react';
import { useLocation } from './hooks';

describe('Tests custom hooks', () => {
    it('useLocation manages location data', () => {
        const setStateMock = jest.fn();
        const spyState = useState => [useState, setStateMock];
        jest.spyOn(React, 'useState').mockImplementation(spyState);
        const [_, setLocation] = useLocation();
        setLocation({ formSiteId: 100 });
        expect(setStateMock).toHaveBeenCalledWith({
            formSiteId: 100,
            formBuildingId: -1,
            formFloorId: -1,
            formRoomId: -1,
        });
        setLocation({ formBuildingId: 100 });
        expect(setStateMock).toHaveBeenCalledWith({
            formSiteId: -1,
            formBuildingId: 100,
            formFloorId: -1,
            formRoomId: -1,
        });
        setLocation({ formFloorId: 100 });
        expect(setStateMock).toHaveBeenCalledWith({
            formSiteId: -1,
            formBuildingId: -1,
            formFloorId: 100,
            formRoomId: -1,
        });
        setLocation({ formRoomId: 100 });
        expect(setStateMock).toHaveBeenCalledWith({
            formSiteId: -1,
            formBuildingId: -1,
            formFloorId: -1,
            formRoomId: 100,
        });
        setLocation({ formSiteId: 1, formBuildingId: 2, formFloorId: 3, formRoomId: 4 });
        expect(setStateMock).toHaveBeenCalledWith({
            formSiteId: 1,
            formBuildingId: 2,
            formFloorId: 3,
            formRoomId: 4,
        });
    });
});
