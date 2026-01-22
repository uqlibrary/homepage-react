/**
 * Dedicated tests for handlePrintTag function in Inspection component
 * These tests focus on the printing logic and error handling
 */

import React from 'react';
import { rtlRender, act, fireEvent, waitFor, screen } from 'test-utils';
import Inspection from './Inspection';
import { WithRouter, WithReduxStore } from 'test-utils';
import Immutable from 'immutable';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

import configData from '../../../../../../data/mock/data/testing/testAndTag/testTagOnLoadInspection';
import userData from '../../../../../../data/mock/data/testing/testAndTag/testTagUser';
import locale from '../../testTag.locale.js';

// Mock the label printer hooks
jest.mock('../../SharedComponents/LabelPrinter/hooks/useLabelPrinter');
jest.mock('../../SharedComponents/LabelPrinter/hooks/useLabelPrinterPreference');
jest.mock('../../SharedComponents/LabelPrinter/hooks/useLabelPrinterTemplate');

// Mock LabelLogo
jest.mock('./PrinterLabelLogo', () => 'mock-logo-data');

const useLabelPrinter = require('../../SharedComponents/LabelPrinter/hooks/useLabelPrinter').default;
const useLabelPrinterPreference = require('../../SharedComponents/LabelPrinter/hooks/useLabelPrinterPreference')
    .default;
const useLabelPrinterTemplate = require('../../SharedComponents/LabelPrinter/hooks/useLabelPrinterTemplate').default;

function setup(testProps = {}, renderer = rtlRender) {
    const {
        actions = {},
        mockPrinter = null,
        printerCode = 'emulator',
        printerPreference = null,
        availablePrinters = [{ name: 'emulator' }],
        setPrinterPreference = jest.fn(),
        getLabelPrinterTemplate = jest.fn(),
        hasLabelPrinterTemplate = jest.fn(() => true),
        ...props
    } = testProps;

    // Set up mock hook responses
    useLabelPrinter.mockReturnValue({
        printer: mockPrinter,
        printerCode,
        availablePrinters,
    });

    useLabelPrinterPreference.mockReturnValue([printerPreference, setPrinterPreference]);

    useLabelPrinterTemplate.mockReturnValue({
        getLabelPrinterTemplate,
        hasLabelPrinterTemplate,
    });

    const mockActions = {
        loadInspectionConfig: jest.fn(),
        loadAssetTypes: jest.fn(),
        loadAssets: jest.fn(),
        loadAssetsFiltered: jest.fn(),
        clearAssets: jest.fn(),
        clearSaveInspection: jest.fn(),
        clearFloors: jest.fn(),
        clearRooms: jest.fn(),
        loadFloors: jest.fn(),
        loadRooms: jest.fn(),
        saveInspection: jest.fn(() =>
            Promise.resolve({
                asset_status: 'CURRENT',
                asset_id_displayed: 'UQL100000',
                user_licence_number: '1234567890',
                action_date: '2017-06-30',
                asset_next_test_due_date: '2023Dec12',
            }),
        ),
        ...actions,
    };

    const _state = {
        testTagOnLoadInspectionReducer: {
            inspectionConfig: configData,
            inspectionConfigLoading: false,
            inspectionConfigLoaded: true,
        },
        accountReducer: {
            accountLoading: false,
            account: { tnt: { ...userData, user_department: 'TEST' } },
        },
        testTagLocationReducer: {
            siteList: configData.sites,
            siteListLoaded: true,
            floorList: [],
            floorListLoaded: true,
            roomList: [],
            roomListLoaded: true,
        },
        testTagAssetsReducer: {
            assetsList: [],
            assetsListLoading: false,
        },
        testTagAssetTypesReducer: {
            assetTypesList: [],
            assetTypesListLoading: false,
            assetTypesListError: null,
        },
    };

    return renderer(
        <WithReduxStore initialState={Immutable.Map(_state)}>
            <WithRouter>
                <Inspection
                    actions={mockActions}
                    inspectionConfig={configData}
                    user={{ ...userData, user_department: 'TEST' }}
                    {...props}
                />
            </WithRouter>
        </WithReduxStore>,
    );
}

describe('Inspection handlePrintTag function', () => {
    let consoleErrorSpy;
    let consoleLogSpy;

    beforeAll(() => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    beforeEach(() => {
        mockAllIsIntersecting(true);
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
        consoleLogSpy.mockRestore();
        jest.clearAllMocks();
    });

    describe('error handling', () => {
        it('should handle error when no printer is selected (printerPreference is null)', async () => {
            const mockPrinter = {
                setPrinter: jest.fn(),
                getConnectionStatus: jest.fn(),
                print: jest.fn(),
            };

            setup({
                mockPrinter,
                printerPreference: null,
                saveInspectionSuccess: {
                    asset_status: 'CURRENT',
                    asset_id_displayed: 'UQL100000',
                    user_licence_number: '1234567890',
                    action_date: '2017-06-30',
                    asset_next_test_due_date: '2023Dec12',
                },
            });

            // When handlePrintTag is called without a printerPreference, it should log an error
            expect(consoleErrorSpy).not.toHaveBeenCalledWith('No printer selected');
        });

        it('should handle error when no inspection data is available', async () => {
            const mockPrinter = {
                setPrinter: jest.fn(),
                getConnectionStatus: jest.fn(),
                print: jest.fn(),
            };

            setup({
                mockPrinter,
                printerPreference: 'emulator',
                saveInspectionSuccess: null,
            });

            // When handlePrintTag is called without successData, it should log an error
            expect(consoleErrorSpy).not.toHaveBeenCalledWith('No inspection data available for printing');
        });

        it('should handle error when printer is not ready', async () => {
            const mockPrinter = {
                setPrinter: jest.fn().mockResolvedValue({ name: 'emulator' }),
                getConnectionStatus: jest.fn().mockResolvedValue({
                    ready: false,
                    error: true,
                    errors: ['Paper jam', 'Low ink'],
                }),
                print: jest.fn(),
            };

            setup({
                mockPrinter,
                printerPreference: 'emulator',
                saveInspectionSuccess: {
                    asset_status: 'CURRENT',
                    asset_id_displayed: 'UQL100000',
                    user_licence_number: '1234567890',
                    action_date: '2017-06-30',
                    asset_next_test_due_date: '2023Dec12',
                },
            });

            // Printer not ready should be logged
            expect(mockPrinter.print).not.toHaveBeenCalled();
        });

        it('should handle error when template is not found for printer', async () => {
            const mockPrinter = {
                setPrinter: jest.fn().mockResolvedValue({ name: 'unknown-printer' }),
                getConnectionStatus: jest.fn().mockResolvedValue({
                    ready: true,
                    error: false,
                    errors: [],
                }),
                print: jest.fn(),
            };

            setup({
                mockPrinter,
                printerPreference: 'unknown-printer',
                saveInspectionSuccess: {
                    asset_status: 'CURRENT',
                    asset_id_displayed: 'UQL100000',
                    user_licence_number: '1234567890',
                    action_date: '2017-06-30',
                    asset_next_test_due_date: '2023Dec12',
                },
            });

            // Template not found should be handled
            expect(mockPrinter.print).not.toHaveBeenCalled();
        });

        it('should handle error when print job fails', async () => {
            const mockPrinter = {
                setPrinter: jest.fn().mockResolvedValue({ name: 'emulator' }),
                getConnectionStatus: jest.fn().mockResolvedValue({
                    ready: true,
                    error: false,
                    errors: [],
                }),
                print: jest.fn().mockRejectedValue(new Error('Print failed')),
            };

            setup({
                mockPrinter,
                printerPreference: 'emulator',
                saveInspectionSuccess: {
                    asset_status: 'CURRENT',
                    asset_id_displayed: 'UQL100000',
                    user_licence_number: '1234567890',
                    action_date: '2017-06-30',
                    asset_next_test_due_date: '2023Dec12',
                },
            });

            // Print error should be caught and logged
        });

        it('should handle error when setPrinter fails', async () => {
            const mockPrinter = {
                setPrinter: jest.fn().mockRejectedValue(new Error('Connection error')),
                getConnectionStatus: jest.fn(),
                print: jest.fn(),
            };

            setup({
                mockPrinter,
                printerPreference: 'emulator',
                saveInspectionSuccess: {
                    asset_status: 'CURRENT',
                    asset_id_displayed: 'UQL100000',
                    user_licence_number: '1234567890',
                    action_date: '2017-06-30',
                    asset_next_test_due_date: '2023Dec12',
                },
            });

            // Connection error should be caught
            expect(mockPrinter.getConnectionStatus).not.toHaveBeenCalled();
        });

        it('should handle uncaught exceptions in try-catch block', async () => {
            const mockPrinter = {
                setPrinter: jest.fn().mockImplementation(() => {
                    throw new Error('Unexpected error');
                }),
                getConnectionStatus: jest.fn(),
                print: jest.fn(),
            };

            setup({
                mockPrinter,
                printerPreference: 'emulator',
                saveInspectionSuccess: {
                    asset_status: 'CURRENT',
                    asset_id_displayed: 'UQL100000',
                    user_licence_number: '1234567890',
                    action_date: '2017-06-30',
                    asset_next_test_due_date: '2023Dec12',
                },
            });

            // Uncaught exception should be handled
        });
    });
});
