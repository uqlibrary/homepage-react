import React from 'react';
import { ConfirmDialogBox, styles } from './ConfirmDialogBox';
import { rtlRender, fireEvent } from 'test-utils';

const getProps = (testProps = {}) => ({
    classes: {},
    hideCancelButton: false,
    locale: {
        alternateActionButtonLabel: 'Maybe',
        confirmationTitle: 'Confirmation',
        confirmationMessage: 'Are you sure?',
        cancelButtonLabel: 'No',
        confirmButtonLabel: 'Yes',
    },
    onAction: jest.fn(),
    onCancelAction: jest.fn(),
    onAlternateAction: jest.fn(),
    onRef: jest.fn(),
    showAlternateActionButton: false,
    isOpen: true,
    ...testProps,
});

function setup(testProps = {}) {
    return rtlRender(<ConfirmDialogBox {...getProps(testProps)} />);
}

describe('ConfirmDialogBox snapshots tests', () => {
    it('renders component with yes/no buttons', () => {
        const { getByText, getByRole } = setup();
        expect(getByText('Confirmation')).toBeInTheDocument();
        expect(getByText('Are you sure?')).toBeInTheDocument();
        expect(getByRole('button', { name: /Yes/ })).toBeInTheDocument();
        expect(getByRole('button', { name: /No/ })).toBeInTheDocument();
    });

    it('renders component with yes', () => {
        const { getByRole, queryByRole } = setup({ hideCancelButton: true });
        expect(getByRole('button', { name: /Yes/ })).toBeInTheDocument();
        expect(queryByRole('button', { name: /No/ })).not.toBeInTheDocument();
    });

    it('renders component with yes/no/maybe buttons', () => {
        const { getByRole } = setup({ showAlternateActionButton: true });
        expect(getByRole('button', { name: /Yes/ })).toBeInTheDocument();
        expect(getByRole('button', { name: /Maybe/ })).toBeInTheDocument();
        expect(getByRole('button', { name: /No/ })).toBeInTheDocument();
    });

    it('should have a proper style generator', () => {
        const theme = {
            breakpoints: {
                up: jest.fn(() => 'test1'),
            },
            palette: {
                warning: {
                    main: 'test2',
                    dark: 'test3',
                },
                white: {
                    main: 'test4',
                },
            },
        };
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette.warning;
        delete theme.palette.white;
        expect(styles(theme)).toMatchSnapshot();

        delete theme.palette;
        expect(styles(theme)).toMatchSnapshot();
    });

    it('renders component with customised locale', () => {
        const { getByRole, getByText } = setup({
            locale: {
                alternateActionButtonLabel: 'ENG: Maybe',
                cancelButtonLabel: 'ENG: No',
                confirmationTitle: 'ENG: Confirmation',
                confirmationMessage: 'ENG: Are you sure?',
                confirmButtonLabel: 'ENG: Yes',
            },
            showAlternateActionButton: true,
        });
        expect(getByText('ENG: Confirmation')).toBeInTheDocument();
        expect(getByText('ENG: Are you sure?')).toBeInTheDocument();
        expect(getByRole('button', { name: /ENG: Yes/ })).toBeInTheDocument();
        expect(getByRole('button', { name: /ENG: Maybe/ })).toBeInTheDocument();
        expect(getByRole('button', { name: /ENG: No/ })).toBeInTheDocument();
    });

    it('the ok-equivalent button should work', () => {
        const testFn = jest.fn();
        const { getByRole } = setup({
            onAction: testFn,
        });
        fireEvent.click(getByRole('button', { name: /Yes/ }));
        expect(testFn).toHaveBeenCalled();
    });

    it('the cancel-equivalent button should work', () => {
        const testFn = jest.fn();
        const { getByRole } = setup({
            onCancelAction: testFn,
        });
        fireEvent.click(getByRole('button', { name: /No/ }));
        expect(testFn).toHaveBeenCalled();
    });

    it('the alternate action button should work', () => {
        const testFn = jest.fn();
        const { getByRole } = setup({
            showAlternateActionButton: true,
            onAlternateAction: testFn,
        });
        fireEvent.click(getByRole('button', { name: /Maybe/ }));
        expect(testFn).toHaveBeenCalled();
    });

    describe('Class instance', () => {
        const getInstance = props => {
            const instance = new ConfirmDialogBox(props ?? getProps());
            instance.setState = jest.fn(newState => {
                instance.state = { ...instance.state, ...newState };
            });
            return instance;
        };

        it('should show and hide confirmation dialog', () => {
            const instance = getInstance({ ...getProps({ isOpen: false }) });
            instance.showConfirmation();
            expect(instance.state.isDialogOpen).toBeTruthy();

            instance._hideConfirmation();
            expect(instance.state.isDialogOpen).toBeFalsy();
        });
    });
});
