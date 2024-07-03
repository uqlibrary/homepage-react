import { useLocation, useForm, useObjectList, useConfirmationAlert } from './hooks';
import { renderHook, act } from '@testing-library/react';
import moment from 'moment';

describe('hooks', () => {
    describe('useLocation', () => {
        it('operates correctly with defaults', () => {
            const { result } = renderHook(() => useLocation());

            expect(result.current.location.site).toBe(-1);
            expect(result.current.location.building).toBe(-1);
            expect(result.current.location.floor).toBe(-1);
            expect(result.current.location.room).toBe(-1);
        });
        it('should update location correctly', () => {
            const { result } = renderHook(() => useLocation());
            const newLocation = {
                site: 1,
                building: 2,
                floor: 3,
                room: 4,
            };
            act(() => {
                result.current.setLocation(newLocation);
            });
            expect(result.current.location).toEqual(newLocation);
        });

        it('should update location partially', () => {
            const { result } = renderHook(() => useLocation());
            const partialUpdate = {
                building: 2,
                room: 4,
            };
            act(() => {
                result.current.setLocation(partialUpdate);
            });
            const expectedLocation = {
                site: -1,
                building: 2,
                floor: -1,
                room: 4,
            };
            expect(result.current.location).toEqual(expectedLocation);
        });
    });
    describe('useForm', () => {
        const defaultValues = {
            name: '',
            lic: 'LIC001',
        };

        it('should initialize with default values', () => {
            const { result } = renderHook(() => useForm({ defaultValues }));

            expect(result.current.formValues).toEqual(defaultValues);
        });

        it('should update useForm form values correctly', () => {
            const { result } = renderHook(() => useForm({ defaultValues }));
            const newName = 'John';
            const newLic = 'LIC000';
            act(() => {
                result.current.handleChange('name')({ target: { value: newName } });
                result.current.handleChange('lic')({ target: { value: newLic } });
            });
            const expectedFormValues = {
                name: newName,
                lic: newLic,
            };
            expect(result.current.formValues).toEqual(expectedFormValues);
        });

        it('should format useForm date values correctly', () => {
            const { result } = renderHook(() => useForm({ defaultValues }));
            const thedate = '1995-08-21';
            act(() => {
                result.current.handleChange('thedate')(thedate);
            });
            const expectedFormattedDate = moment(thedate).format('YYYY-MM-DD HH:mm');
            expect(result.current.formValues.thedate).toBe(expectedFormattedDate);
        });

        it('useForm should reset form values', () => {
            const { result } = renderHook(() => useForm({ defaultValues }));
            const newFormValues = {
                name: 'Testing',
                lic: 'LIC999',
            };
            act(() => {
                result.current.resetFormValues(newFormValues);
            });
            expect(result.current.formValues).toEqual({
                ...defaultValues,
                ...newFormValues,
            });
        });
    });

    describe('useObjectList', () => {
        it('should initialize with an empty list', () => {
            const { result } = renderHook(() => useObjectList());

            expect(result.current.data).toEqual([]);
        });

        it('useObjectList should initialize with provided list and transform', () => {
            const initialList = [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
            ];

            const transform = list => {
                return list.map(item => ({
                    ...item,
                    name: `${item.name}${item.name.indexOf('transformed') === -1 ? ' transformed' : ''}`,
                    transformed: true,
                }));
            };
            const { result } = renderHook(() => useObjectList(initialList, transform));

            // ensure transformer fires when adding
            act(() => {
                result.current.addAt(2, { id: 3, name: 'Item 3' });
            });
            const expectedTransformedList = [
                ...initialList.map(item => ({
                    ...item,
                    name: `${item.name} transformed`,
                    transformed: true,
                })),
                { id: 3, name: 'Item 3 transformed', transformed: true },
            ];
            expect(result.current.data).toEqual(expectedTransformedList);
        });

        it('useObjectList should add items at specified index without an existing list', () => {
            const { result } = renderHook(() => useObjectList());
            const newItem2 = [{ id: 2, name: 'New Item 2' }];
            act(() => {
                result.current.addAt(1, newItem2);
            });
            expect(result.current.data).toEqual(newItem2);
        });
        it('useObjectList should add items at specified index with an existing list', () => {
            const { result } = renderHook(() => useObjectList([{ id: 0, name: 'existing' }]));
            const newItem2 = [{ id: 2, name: 'New Item 2' }];
            act(() => {
                result.current.addAt(1, newItem2);
            });
            expect(result.current.data).toEqual([{ id: 0, name: 'existing' }, ...newItem2]);
        });
        it('useObjectList should add item object at specified index with an existing list', () => {
            const { result } = renderHook(() =>
                useObjectList([
                    { id: 0, name: 'existing 1' },
                    { id: 1, name: 'existing 2' },
                ]),
            );
            const newItem = { id: 2, name: 'New Item 2' };
            act(() => {
                result.current.addAt(1, newItem);
            });
            expect(result.current.data).toEqual([
                { id: 0, name: 'existing 1' },
                { id: 2, name: 'New Item 2' },
                { id: 1, name: 'existing 2' },
            ]);
        });
        it('useObjectList should not add duplicate items', () => {
            const { result } = renderHook(() =>
                useObjectList([
                    { id: 0, name: 'existing 1' },
                    { id: 1, name: 'existing 2' },
                ]),
            );
            const newItem1 = [{ id: 2, name: 'existing 3' }];
            act(() => {
                result.current.addAt(1, newItem1);
            });
            expect(result.current.data).toEqual([
                { id: 0, name: 'existing 1' },
                { id: 1, name: 'existing 2' },
                { id: 2, name: 'existing 3' },
            ]);

            const newItem2 = { id: 2, name: 'existing 3' };
            act(() => {
                result.current.addAt(1, newItem2);
            });
            expect(result.current.data).toEqual([
                { id: 0, name: 'existing 1' },
                { id: 1, name: 'existing 2' },
                { id: 2, name: 'existing 3' },
            ]);
        });

        it('useObjectList should add items at the start', () => {
            const { result } = renderHook(() => useObjectList());
            const newItem = [{ id: 1, name: 'New Item' }];
            act(() => {
                result.current.addStart(newItem);
            });
            expect(result.current.data).toEqual(newItem);
        });

        it('useObjectList should add items at the end', () => {
            const { result } = renderHook(() => useObjectList());
            const newItem = [{ id: 1, name: 'New Item' }];
            act(() => {
                result.current.addEnd(newItem);
            });
            expect(result.current.data).toEqual(newItem);
        });

        it('useObjectList should delete item at specified index', () => {
            const initialList = [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
            ];
            const { result } = renderHook(() => useObjectList(initialList));
            act(() => {
                result.current.deleteAt(0);
            });
            expect(result.current.data).toEqual([{ id: 2, name: 'Item 2' }]);
        });
        it('useObjectList should delete item at end of array', () => {
            const initialList = [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
            ];
            const { result } = renderHook(() => useObjectList(initialList));
            act(() => {
                result.current.deleteAt(1);
            });
            expect(result.current.data).toEqual([{ id: 1, name: 'Item 1' }]);
        });
        it('useObjectList should handle index out of bounds', () => {
            const initialList = [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
            ];
            const { result } = renderHook(() => useObjectList(initialList));
            act(() => {
                result.current.deleteAt(2);
            });
            expect(result.current.data).toEqual([
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
            ]);
        });

        it('useObjectList should delete item with specified key and value', () => {
            const initialList = [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
            ];
            const { result } = renderHook(() => useObjectList(initialList));
            act(() => {
                result.current.deleteWith('id', 1);
            });
            expect(result.current.data).toEqual([{ id: 2, name: 'Item 2' }]);
        });

        it('useObjectList should clear the list', () => {
            const initialList = [
                { id: 1, name: 'Item 1' },
                { id: 2, name: 'Item 2' },
            ];
            const { result } = renderHook(() => useObjectList(initialList));
            act(() => {
                result.current.clear();
            });
            expect(result.current.data).toEqual([]);
        });
    });

    describe('useConfirmationAlert', () => {
        it('should initialize with default values', () => {
            const { result } = renderHook(() => useConfirmationAlert({}));

            expect(result.current.confirmationAlert).toEqual({
                message: '',
                visible: false,
            });
        });

        it('useConfirmationAlert should open and close confirmation alert', () => {
            const { result } = renderHook(() => useConfirmationAlert({}));

            const message = 'This is a confirmation message';
            const type = 'success';

            act(() => {
                result.current.openConfirmationAlert(message, type);
            });

            expect(result.current.confirmationAlert).toEqual({
                message: message,
                visible: true,
                type: type,
            });

            act(() => {
                result.current.closeConfirmationAlert();
            });

            expect(result.current.confirmationAlert).toEqual({
                message: '',
                visible: false,
                type: type,
            });
        });

        it('useConfirmationAlert should open confirmation alert with autoHideDuration', () => {
            const { result } = renderHook(() => useConfirmationAlert({ duration: 500 }));

            const message = 'Auto-hide message';

            act(() => {
                result.current.openConfirmationAlert(message);
            });

            expect(result.current.confirmationAlert).toEqual({
                message: message,
                visible: true,
                type: 'info',
                autoHideDuration: 500,
            });
        });

        it('useConfirmationAlert should open confirmation alert with formatted error message', () => {
            const errorMessage = 'Something went wrong';

            const { result } = renderHook(() =>
                useConfirmationAlert({
                    errorMessage,
                    errorMessageFormatter: errorMessage => `Error: ${errorMessage}`,
                }),
            );

            expect(result.current.confirmationAlert).toEqual({
                message: `Error: ${errorMessage}`,
                visible: true,
                type: 'error',
            });
        });

        it('useConfirmationAlert should open confirmation alert with unformatted error message', () => {
            const errorMessage = 'Something went wrong';

            const { result } = renderHook(() =>
                useConfirmationAlert({
                    errorMessage,
                }),
            );

            expect(result.current.confirmationAlert).toEqual({
                message: errorMessage,
                visible: true,
                type: 'error',
            });
        });

        it('useConfirmationAlert should call onClose when confirmation alert is closed', () => {
            const onCloseMock = jest.fn();
            const { result } = renderHook(() => useConfirmationAlert({ onClose: onCloseMock }));
            act(() => {
                result.current.openConfirmationAlert('Test message');
            });
            act(() => {
                result.current.closeConfirmationAlert();
            });
            expect(onCloseMock).toHaveBeenCalled();
        });
    });
});
