import { actionReducer } from './utils';

it('actionReducer operates correctly', () => {
    // test add action
    const testAction = {
        type: 'add',
        title: 'test title',
    };
    const expectedAction = {
        title: 'test title',
        isAdd: true,
        isEdit: false,
        isDelete: false,
        row: { asset_type_id: 'auto' },
    };
    expect(actionReducer(null, testAction)).toEqual(expectedAction);
    const expectedEmpty = { isAdd: false, isEdit: false, isDelete: false, rows: {}, row: {}, title: '' };
    testAction.type = 'clear';
    expect(actionReducer(null, testAction)).toEqual(expectedEmpty);
    // test if throw is correct
    testAction.type = 'test';
    expect(() => {
        actionReducer(null, testAction);
    }).toThrow();
});
