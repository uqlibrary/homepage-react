import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import { styled, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { useAccountContext } from 'context';
import { useConfirmationState } from 'hooks';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import {
    addClass,
    isValidUrl,
    removeClass,
    scrollToTopOfPage,
    slugifyName,
    standardText,
    StyledPrimaryButton,
    StyledSecondaryButton,
} from 'helpers/general';

import {
    displayToastMessage,
    displayToastErrorMessage,
    spacesAdminLink,
    validLibraryList,
} from 'modules/Pages/Admin/BookableSpaces/bookableSpacesAdminHelpers';
import { getFlatFacilityTypeList, getFriendlyLocationDescription } from 'modules/Pages/BookableSpaces/spacesHelpers';
import { ImageUploadDropzone } from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/ImageUploadDropzone';
import SpaceOutagePanel from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/SpaceOutagePanel';
import {
    getSpaceOutageStatus,
    normalizeSpaceOutageList,
} from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
import SpacesAdminPage from 'modules/Pages/Admin/BookableSpaces/SpacesAdminPage';
import SpaceLocationMap from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/SpaceLocationMap';

const StyledErrorMessageTypography = styled(Typography)(({ theme }) => ({
    ...standardText(theme),
    color: theme.palette.error.light,
    marginTop: 4,
}));
const StyledPrettyLocationDiv = styled('div')(() => ({
    '& .location-space': {
        lineHeight: 1.25,
    },
    '& .location-floor': {
        fontWeight: 500,
        whiteSpace: 'nowrap',
    },
}));
const StyledTabs = styled(Tabs)(({ theme }) => ({
    '& > div > div': {
        columnGap: '0.25rem',
    },
    '& button': {
        border: theme.palette.designSystem.border,
        borderRadiusTopLeft: '0.5rem',
        borderRadiusTopRight: '0.5rem',
        width: '15%',
        textTransform: 'none',
        fontWeight: 400,
        fontSize: '16px',
    },
}));
const StyledFilterWrapper = styled('div')(() => ({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
}));
const StyledHighlightedGrid = styled(Grid)(({ theme }) => ({
    border: theme.palette.designSystem.border,
    marginTop: '2rem',
    padding: '1rem',
    '& h4': {
        marginBottom: '0.5rem',
    },
}));
const StyledDraftModeNotice = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.5rem',
    backgroundColor: '#fffde7',
    border: `1px solid ${theme.palette.warning.light}`,
    borderRadius: '4px',
    padding: '0.6rem 0.8rem',
}));
const StyledErrorAttentionMessageDiv = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.5rem',
    backgroundColor: '#fbeaea',
    border: `1px solid ${theme.palette.error.main}`,
    borderRadius: '4px',
    padding: '0.6rem 0.8rem',
    '& svg': {
        color: '#000',
    },
    '& p': {
        margin: 0,
        color: '#000',
    },
}));
const StyledUqTightLink = styled('a')(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: 500,
    fontSize: '16px',
    textAlign: 'left',
    textTransform: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    lineHeight: 'normal',
    padding: '0 4px',
    marginLeft: '1.5rem',
    '&:hover': {
        backgroundColor: 'inherit',
    },
    '& span': {
        textDecoration: 'underline',
        '&:hover': {
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
        },
    },
}));
const StyledFacilityGroupCheckboxBlock = styled('div')(() => ({
    '& h5': {
        fontWeight: 300,
        fontSize: '1.1rem',
        marginLeft: '0.6rem',
    },
    '& ul': {
        paddingLeft: 0,
        marginRight: '0.5rem',
        marginTop: 0,
    },
    '& li': {
        listStyle: 'none',
        paddingLeft: 0,
        '& label': {
            width: '200px',
            whiteSpace: 'normal',
            overflow: 'auto',
            textOverflow: 'iniital',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            paddingTop: '9px', // 9px: top align checkbox and label, allowing for checkbox hover affect
            transition: 'color 0.2s ease',
            '&:hover': {
                cursor: 'pointer',
                color: 'rgba(0, 0, 0, 1)',
            },
            '& > span:first-of-type': {
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                marginTop: '-9px', // 9px: top align checkbox and label, allowing for checkbox hover affect
            },
            '& input[type="checkbox"]': {
                margin: 0,
            },
        },
    },
}));
const StyledSpringshareHouseFormControl = styled(FormControl)(() => ({
    border: '1px solid rgba(38, 85, 115, 0.15)',
    borderRadius: '4px',
    padding: '10px',
    '& label': {
        padding: '10px',
    },
    '&.asLoaded': {
        borderColor: 'blue',
        borderWidth: '2px',
    },
}));
const StyledErrorCountBadge = styled(Badge)(() => ({
    '& span': {
        right: -12,
    },
}));
const StyledWarningListBox = styled('div')(({ theme }) => ({
    marginTop: '0.75rem',
    padding: '0.75rem',
    borderRadius: '4px',
    backgroundColor: '#fffde7',
    border: `1px solid ${theme.palette.warning.light}`,
    display: 'flex',
    alignItems: 'center',
    columnGap: '0.5rem',
    '& p': {
        margin: 0,
    },
    '& svg': {
        flexShrink: 0,
    },
}));

function CustomTabPanel(props) {
    const { children, value, index, keepMounted = false, testId, ...other } = props;
    // Keep only tabs with components that break on remount, such as MazeMap,
    // mounted while hidden. Other tabs can unmount normally.
    const [hasBeenActive, setHasBeenActive] = React.useState(keepMounted ? value === index : false);
    React.useEffect(() => {
        if (keepMounted && value === index) setHasBeenActive(true);
    }, [keepMounted, value, index]);

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`spacesform-tabpanel-${index}`}
            aria-labelledby={`spacesform-tab-${index}`}
            data-testid={testId}
            {...other}
        >
            {(keepMounted ? hasBeenActive : value === index) && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}
CustomTabPanel.propTypes = {
    children: PropTypes.any,
    value: PropTypes.number,
    index: PropTypes.number,
    keepMounted: PropTypes.bool,
    testId: PropTypes.string,
};

export const EditSpaceForm = ({
    actions,
    bookableSpacesRoomAdding,
    bookableSpacesRoomAddError,
    bookableSpacesRoomAddResult,
    currentCampusList,
    initialCampus,
    bookableSpacesRoomList,
    bookableSpacesRoomListLoading,
    bookableSpacesRoomListError,
    facilityTypeList,
    facilityTypeListLoading,
    facilityTypeListError,
    formValues,
    setFormValues,
    saveToDb,
    pageTitle,
    currentPageSlug,
    springshareList,
    spaceOutageList,
    spaceOutageListLoading,
    spaceOutageListError,
    bookableSpacesRoomUpdating,
    bookableSpacesRoomUpdateError,
    bookableSpacesRoomUpdateResult,
    mode,
}) => {
    console.log(
        'TOP EditSpaceForm bookableSpacesRoomAddResult',
        bookableSpacesRoomAdding,
        bookableSpacesRoomAddError,
        bookableSpacesRoomAddResult,
    );
    console.log(
        'TOP EditSpaceForm bookableSpacesRoomUpdateResult',
        bookableSpacesRoomUpdating,
        bookableSpacesRoomUpdateError,
        bookableSpacesRoomUpdateResult,
    );
    console.log('TOP EditSpaceForm currentCampusList', currentCampusList);
    console.log('TOP EditSpaceForm formValues', Object.keys(formValues)?.length, formValues);
    console.log(
        'TOP EditSpaceForm bookableSpacesRoomList',
        bookableSpacesRoomListLoading,
        bookableSpacesRoomListError,
        bookableSpacesRoomList,
    );
    console.log('TOP EditSpaceForm facilityTypeList', facilityTypeListLoading, facilityTypeListError, facilityTypeList);
    console.log('TOP EditSpaceForm mode', mode);
    console.log('TOP EditSpaceForm springshareList', springshareList);

    const { account } = useAccountContext();
    const theme = useTheme();

    const getSpaceUnavailabilityStatus = outages => {
        const outageStatuses = normalizeSpaceOutageList(outages).map(spaceOutage => getSpaceOutageStatus(spaceOutage));

        if (outageStatuses.includes('Current')) {
            return 'Current';
        }
        if (outageStatuses.includes('Upcoming')) {
            return 'Upcoming';
        }

        return null;
    };

    const spaceUnavailabilityStatus =
        spaceOutageListLoading || !!spaceOutageListError ? null : getSpaceUnavailabilityStatus(spaceOutageList);

    const [location, setLocation] = useState({});

    const [isConfirmationOpen, showConfirmation, hideConfirmation] = useConfirmationState();
    const [isUndeleteConfirmationOpen, showUndeleteConfirmation, hideUndeleteConfirmation] = useConfirmationState();
    const [errorMessages, setErrorMessages] = useState([]);
    const [showSpaceDescriptionCheckbox, setShowSpaceDescriptionCheckbox] = useState(!!formValues?.space_description);
    const spaceDescriptionStateKeyRef = useRef(`${mode}:${formValues?.space_uuid || 'new'}`);

    const firstTabId = 0;
    const secondTabId = 1;
    const thirdTabId = 2;
    const addModeLastTabId = 3;
    const editModeOutageTabId = 3;
    const editModeImageryTabId = 4;
    const [activeStep, setActiveStep] = useState(0);

    const addModeTabLabels = ['About', 'Facility types', 'Location & Hours', 'Imagery'];
    const editModeTabLabels = ['About', 'Facility types', 'Location & Hours', 'Closures', 'Imagery'];

    const basePhotoDescriptionFieldLabel = 'Description of photo to assist people using screen readers';

    const editorConfig = {
        removePlugins: [
            'Image',
            'ImageCaption',
            'ImageStyle',
            'ImageToolbar',
            'ImageUpload',
            'EasyImage',
            'CKFinder',
            'BlockQuote',
            'Table',
            'MediaEmbed',
        ],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading2', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            ],
        },
    };

    const [isBookable, setIsBookable2] = useState();
    const setIsBookable = x => {
        console.log('setIsBookable', x);
        setIsBookable2(x);
    };
    // const [hasCapacityLimit, setHasCapacityLimit] = useState();
    useEffect(() => {
        hideConfirmation();

        setIsBookable(!!formValues?.space_external_book_url || false);

        // setHasCapacityLimit(formValues?.space_capacity > 0 || false);
    }, [
        hideConfirmation,
        formValues?.space_uuid,
        formValues?.space_external_book_url,
        //    , formValues?.space_capacity
    ]);

    useEffect(() => {
        if (!bookableSpacesRoomAdding && (!!bookableSpacesRoomAddError || !!bookableSpacesRoomAddResult)) {
            showConfirmation();
        }
    }, [bookableSpacesRoomAdding, bookableSpacesRoomAddError, bookableSpacesRoomAddResult, showConfirmation]);

    useEffect(() => {
        if (!bookableSpacesRoomUpdating && (!!bookableSpacesRoomUpdateError || !!bookableSpacesRoomUpdateResult)) {
            showConfirmation();
        }
    }, [bookableSpacesRoomUpdating, bookableSpacesRoomUpdateError, bookableSpacesRoomUpdateResult, showConfirmation]);

    useEffect(() => {
        const nextStateKey = `${mode}:${formValues?.space_uuid || 'new'}`;

        if (spaceDescriptionStateKeyRef.current !== nextStateKey) {
            spaceDescriptionStateKeyRef.current = nextStateKey;
            setShowSpaceDescriptionCheckbox(!!formValues?.space_description);
        }
    }, [mode, formValues?.space_description, formValues?.space_uuid]);

    const validatePanelAbout = (currentValues, errorMessages = []) => {
        console.log('validatePanelAbout start currentValues=', currentValues);
        if (!currentValues?.space_name) {
            errorMessages?.push({ field: 'space_name', message: 'A Name is required.' });
        }
        if (!currentValues?.space_type_id) {
            errorMessages.push({ field: 'space_type_id', message: 'A Type is required.' });
        }
        // spaces with a booking url must have capacity entered

        console.log('validatePanelAbout currentValues.space_external_book_url=', currentValues.space_external_book_url);
        console.log('validatePanelAbout currentValues.space_capacity=', currentValues.space_capacity);
        console.log('validatePanelAbout currentValues.isBookableCheckbox=', currentValues.isBookableCheckbox);
        console.log('validatePanelAbout isBookable=', isBookable);
        if (!!currentValues.isBookableCheckbox && !currentValues?.space_external_book_url) {
            errorMessages.push({
                field: 'space_external_book_url',
                message: 'Provide the booking link, or uncheck the checkbox.',
            });
        }
        if (
            (!!currentValues.isBookableCheckbox || !!currentValues.space_external_book_url) &&
            (!currentValues?.space_capacity || Number(currentValues?.space_capacity) < 1)
        ) {
            errorMessages.push({
                field: 'space_capacity',
                message: 'Bookable spaces must have the Space capacity set.',
            });
        }
        console.log('validatePanelAbout errorMessages=', errorMessages);
        return errorMessages;
    };

    function validatePanelFacilityTypes(currentValues, errorMessages = []) {
        return errorMessages;
    }

    function validatePanelLocation(currentValues, errorMessages = []) {
        console.log('validatePanelLocation currentValues=', currentValues);
        if (!currentValues?.campus_id) {
            errorMessages?.push({ field: 'campus_id', message: 'A campus is required.' });
        }
        if (!currentValues?.library_id) {
            errorMessages?.push({ field: 'library_id', message: 'A library is required.' });
        }
        if (!currentValues?.space_floor_id && !currentValues?.floor_id) {
            errorMessages?.push({ field: 'space_floor_id', message: 'A floor is required.' });
        }
        if (!currentValues?.space_latitude || !currentValues?.space_longitude) {
            errorMessages?.push({ field: 'space_latitude', message: 'Please locate the Space on the map' });
        }
        if (!!currentValues?.space_services_page && !isValidUrl(currentValues?.space_services_page)) {
            errorMessages?.push({
                field: 'space_services_page',
                message: 'Please supply a valid "About" page, or clear the field.',
            });
        }
        return errorMessages;
    }

    function validatePanelImagery(currentValues, errorMessages = []) {
        if (!!currentValues?.space_photo_url && !currentValues?.space_photo_description) {
            // if a photo is supplied then it must have an accessible description; the photo itself is not required
            errorMessages?.push({
                field: 'space_photo_description',
                message: 'When a photo is supplied, a description must be supplied.',
            });
        }
        if (!!currentValues?.space_photo_url && !isValidUrl(currentValues?.space_photo_url)) {
            errorMessages?.push({ field: 'space_photo_url', message: 'The photo is not valid.' });
        }
        return errorMessages;
    }

    const validateForm = valuesToValidate => {
        console.log('validateForm valuesToValidate=', valuesToValidate);
        const messages = [];

        validatePanelAbout(valuesToValidate, messages)?.forEach(m => {
            const findIndex = messages?.findIndex(e => e?.field === m?.field);
            if (findIndex !== -1) {
                messages?.splice(findIndex, 1);
            }
            messages?.push(m);
        });
        console.log('validateForm messages=', messages);

        validatePanelFacilityTypes(valuesToValidate, messages)?.forEach(m => {
            const findIndex = messages?.findIndex(e => e?.field === m?.field);
            if (findIndex !== -1) {
                messages?.splice(findIndex, 1);
            }
            messages?.push(m);
        });

        validatePanelLocation(valuesToValidate, messages)?.forEach(m => {
            const findIndex = messages?.findIndex(e => e?.field === m?.field);
            if (findIndex !== -1) {
                messages?.splice(findIndex, 1);
            }
            messages?.push(m);
        });

        validatePanelImagery(valuesToValidate, messages)?.forEach(m => {
            const findIndex = messages?.findIndex(e => e?.field === m?.field);
            if (findIndex !== -1) {
                messages?.splice(findIndex, 1);
            }
            messages?.push(m);
        });

        console.log('validateForm errorMessages=', messages);

        setErrorMessages(messages);

        return messages?.length > 0 ? messages : true;
    };
    const handleNext = () => {
        // setEditorReady(false);
        document.activeElement.blur(); // defocus the button
        validateForm(formValues);
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        scrollToTopOfPage();
    };

    const handleBack = () => {
        // setEditorReady(false);
        document.activeElement.blur(); // defocus the button
        validateForm(formValues);
        setActiveStep(prevActiveStep => prevActiveStep - 1);
        scrollToTopOfPage();
    };

    const handleFieldCompletion = e => {
        console.log('handleFieldCompletion', e.target, formValues);
        const validationResult = validateForm(formValues);
        if (validationResult !== true) {
            setErrorMessages(validationResult);
        }
    };

    const reportErrorMessage = fieldName => {
        return errorMessages?.find(m => m?.field === fieldName)?.message;
    };

    const getBookingUrlQuerystringWarning = spaceExternalBookUrl => {
        if (!spaceExternalBookUrl) {
            return null;
        }

        try {
            const parsedUrl = new URL(spaceExternalBookUrl);
            const isUqBookitDomain = parsedUrl?.hostname?.toLowerCase() === 'uqbookit.uq.edu.au';
            const hasStandardQueryString = !!parsedUrl?.search && parsedUrl?.search !== '?';

            // UQ Bookit routes commonly use hash fragments (e.g. #/app/booking-types/111?x=y).
            // In those cases, URL.search is empty, so we also inspect the fragment for query params.
            const hashValue = parsedUrl?.hash || '';
            const hashWithoutPrefix = hashValue.startsWith('#') ? hashValue.slice(1) : hashValue;
            const hasHashQueryString = hashWithoutPrefix.includes('?') && !hashWithoutPrefix.endsWith('?');

            const hasQueryString = hasStandardQueryString || hasHashQueryString;

            if (isUqBookitDomain && hasQueryString) {
                return 'For uqbookit.uq.edu.au links, remove query string parameters (everything after "?").';
            }
        } catch {
            // Ignore invalid URLs here; this is only a domain-specific warning.
        }

        return null;
    };

    const handleChange = _prop => e => {
        let theNewValue =
            e?.target?.hasOwnProperty('checked') && e?.target?.type !== 'radio' ? e?.target?.checked : e?.target?.value;
        console.log('handleChange start ', _prop, theNewValue);

        const localFormValues = formValues;

        const updatedLocation = {};
        let prop = _prop;
        if (_prop === 'isBookableCheckbox') {
            console.log('handleChange isBookableCheckbox=', theNewValue);
            setIsBookable(e?.target?.checked);
            if (theNewValue === false) {
                // they have cleared the checkbox. Wipe the booking url
                prop = 'space_external_book_url';
                localFormValues.isBookableCheckbox = false;
            }
        } else if (_prop === 'facility_type_id') {
            prop = 'facility_types';
            const clickedFacilityTypeId = parseInt(e?.target?.id?.replace('filtertype-', ''), 10);
            const newCheckboxAdded = theNewValue;
            if (newCheckboxAdded) {
                // it doesn't exist and we must add it
                theNewValue = [
                    ...(formValues?.facility_types || []),
                    {
                        facility_type_id: clickedFacilityTypeId,
                        facility_type_name: getFlatFacilityTypeList(facilityTypeList)?.find(
                            f => f?.facility_type_id === clickedFacilityTypeId,
                        )?.facility_type_name,
                    },
                ];
            } else {
                // it must exist and we are removing it
                theNewValue = formValues?.facility_types?.filter(f => f?.facility_type_id !== clickedFacilityTypeId);
            }
        } else if (prop === 'space_type_new') {
            // update the form value for the Select, not the text field (which is cleared in the form completion
            prop = 'space_type';
        } else if (_prop === 'space_type_id') {
            const selectedSpaceType = bookableSpacesRoomList?.data?.known_space_types?.find(
                spaceType => String(spaceType?.space_type_id) === String(theNewValue),
            );

            const newValues = {
                ...formValues,
                space_type_id: theNewValue,
                space_type: selectedSpaceType?.space_type_name || '',
            };

            setFormValues(newValues);

            // Clear the field-level validation error as soon as a valid type is selected.
            if (!!theNewValue) {
                setErrorMessages(errorMessages?.filter(m => m?.field !== 'space_type_id') || []);
            }
            return;
        } else if (prop === 'space_opening_hours_id') {
            const springshareElement = document.querySelector('.asLoaded');
            removeClass(springshareElement, 'asLoaded');
        } else if (_prop === 'campus_id') {
            updatedLocation.currentCampus =
                !!formValues?.campus_id && !!currentCampusList && currentCampusList.length > 0
                    ? currentCampusList?.find(c => c?.campus_id === theNewValue)
                    : {};
            updatedLocation.campus_id = updatedLocation?.currentCampus?.campus_id;

            updatedLocation.currentCampusLibraries = validLibraryList(updatedLocation?.currentCampus?.libraries);
            updatedLocation.currentLibrary = updatedLocation?.currentCampusLibraries?.at(0);
            updatedLocation.library_id = updatedLocation?.currentLibrary?.library_id;

            updatedLocation.currentLibraryFloors = updatedLocation?.currentLibrary?.floors;
            updatedLocation.currentFloor = updatedLocation?.currentLibraryFloors?.at(0);
            updatedLocation.floor_id = updatedLocation?.currentFloor?.floor_id;
            setLocation({
                ...location,
                ...updatedLocation,
            });
            const springshareElement = document.querySelector('.asLoaded');
            addClass(springshareElement, 'asLoaded');
        } else if (_prop === 'library_id') {
            updatedLocation.currentCampus =
                !!formValues?.campus_id && !!currentCampusList && currentCampusList.length > 0
                    ? currentCampusList?.find(c => c?.campus_id === formValues?.campus_id)
                    : {};
            updatedLocation.campus_id = updatedLocation?.currentCampus?.campus_id;

            updatedLocation.currentCampusLibraries = validLibraryList(updatedLocation?.currentCampus?.libraries || []);
            updatedLocation.currentLibrary = updatedLocation?.currentCampusLibraries?.find(
                l => l?.library_id === theNewValue,
            );
            updatedLocation.library_id = updatedLocation?.currentLibrary?.library_id;

            updatedLocation.currentLibraryFloors = updatedLocation?.currentLibrary?.floors;
            updatedLocation.currentFloor = updatedLocation?.currentLibraryFloors?.at(0);
            updatedLocation.floor_id = updatedLocation?.currentFloor?.floor_id;
            setLocation({
                ...location,
                ...updatedLocation,
            });
            const springshareElement = document.querySelector('.asLoaded');
            addClass(springshareElement, 'asLoaded');
        } else if (_prop === 'space_photo_url') {
            const photoDescriptionField = document.getElementById('space_photo_description');
            const photoDescriptionFieldLabel = document.getElementById('space_photo_description-label');
            let newRequiredValue = false;
            if (theNewValue !== '' && theNewValue?.length > 0) {
                // a url has been entered - the description should be required
                newRequiredValue = true;

                !!photoDescriptionFieldLabel &&
                    (photoDescriptionFieldLabel.textContent = basePhotoDescriptionFieldLabel + ' *');
            } else {
                !!photoDescriptionFieldLabel &&
                    (photoDescriptionFieldLabel.textContent = basePhotoDescriptionFieldLabel);
            }
            !!photoDescriptionField && photoDescriptionField?.setAttribute('required', newRequiredValue);
        }

        const newLocation = {};
        if (!!updatedLocation?.campus_id) {
            newLocation.campus_id = updatedLocation?.campus_id;
        }
        if (!!updatedLocation?.library_id) {
            newLocation.library_id = updatedLocation?.library_id;
            newLocation.space_opening_hours_id = updatedLocation?.currentLibrary?.library_springshare_id || -1;
        }
        if (!!updatedLocation?.floor_id) {
            newLocation.floor_id = updatedLocation?.floor_id;
        }
        const newValues = {
            ...localFormValues,
            ...newLocation,
            [prop]: theNewValue,
        };
        console.log('handleChange newValues=', newValues);

        validateForm(newValues);

        setFormValues(newValues);
    };

    function navigateToPage(spacesPath) {
        // reload spaces to get new one
        actions.loadAllBookableSpacesRooms({ includeDrafts: true }).then(() => {
            window.location.href = spacesAdminLink(spacesPath, account);
        });
    }

    const returnToDashboard = () => {
        hideConfirmation();
        actions.clearABookableSpace();
        navigateToPage('/admin/spaces');
    };
    const clearForm = () => {
        hideConfirmation();
        actions.clearABookableSpace();
        window.location.reload(false);
    };
    const reEditRecord = () => {
        clearForm();
        actions.clearABookableSpace();
        navigateToPage(window.location.href);
    };

    const spaceTypeList = React.useMemo(() => {
        if (
            bookableSpacesRoomListLoading === false &&
            bookableSpacesRoomListError === false &&
            bookableSpacesRoomList?.data?.known_space_types &&
            Array.isArray(bookableSpacesRoomList?.data?.known_space_types) &&
            bookableSpacesRoomList?.data?.known_space_types?.length > 0
        ) {
            const list = bookableSpacesRoomList?.data?.known_space_types?.map(spaceType => spaceType?.space_type_name);
            !!formValues?.space_type && list.push(formValues?.space_type);
            const filteredList = list?.filter(
                (spaceType, index, array) =>
                    spaceType && // Remove null/undefined values
                    spaceType?.trim() !== '' && // Remove empty strings
                    array?.indexOf(spaceType) === index, // Remove duplicates
            );
            return filteredList?.sort(); // Sort alphabetically for better UX
        }
        return [];
    }, [bookableSpacesRoomListLoading, bookableSpacesRoomListError, bookableSpacesRoomList, formValues?.space_type]);

    const selectedSpaceType = React.useMemo(() => {
        if (
            bookableSpacesRoomListLoading === false &&
            bookableSpacesRoomListError === false &&
            Array.isArray(bookableSpacesRoomList?.data?.known_space_types)
        ) {
            return (
                bookableSpacesRoomList?.data?.known_space_types?.find(spaceType => {
                    if (!!formValues?.space_type_id) {
                        return String(spaceType?.space_type_id) === String(formValues?.space_type_id);
                    }
                    return spaceType?.space_type_name === formValues?.space_type;
                }) || null
            );
        }
        return null;
    }, [
        bookableSpacesRoomListLoading,
        bookableSpacesRoomListError,
        bookableSpacesRoomList,
        formValues?.space_type_id,
        formValues?.space_type,
    ]);

    const selectedSpaceTypeDescription = React.useMemo(() => {
        return selectedSpaceType?.space_type_description || '';
    }, [selectedSpaceType]);

    const reportCurrentLibraryAboutPage = location => (
        <>
            {location?.currentLibrary?.library_about_page_default ? (
                <StyledUqTightLink
                    target="_blank"
                    href={location?.currentLibrary?.library_about_page_default}
                    data-testid="add-space-about-page"
                >
                    <span>{location?.currentLibrary?.library_about_page_default}</span>
                </StyledUqTightLink>
            ) : (
                <span data-testid="add-space-about-page">none</span>
            )}
        </>
    );

    const showFilterCheckboxes = () => {
        if (facilityTypeList?.data?.facility_type_groups?.length === 0) {
            return <p>No filter types in system.</p>;
        }

        const facilityTypeGroups = facilityTypeList?.data?.facility_type_groups || [];
        const sortedUsedGroups = [...facilityTypeGroups]?.sort(
            (a, b) => a?.facility_type_group_order - b?.facility_type_group_order,
        );

        return (
            <>
                {sortedUsedGroups
                    ?.sort((a, b) => a?.facility_type_children.length - b?.facility_type_children.length)
                    .map(group => (
                        <StyledFacilityGroupCheckboxBlock key={group?.facility_type_group_id}>
                            <Typography component={'h5'} variant={'h6'} style={{ fontWeight: '400' }}>
                                {group?.facility_type_group_name}
                            </Typography>
                            <ul data-testid="facility-type-checkbox-list">
                                {group?.facility_type_children && group?.facility_type_children?.length > 0 ? (
                                    group?.facility_type_children?.map(facilityType => {
                                        const isChecked = () =>
                                            formValues?.facility_types?.find(
                                                ft => ft?.facility_type_id === facilityType?.facility_type_id,
                                            );
                                        return (
                                            <li
                                                key={`facility-type-listitem-${facilityType?.facility_type_id}`}
                                                data-testid={`facility-type-listitem-${facilityType?.facility_type_id}`}
                                            >
                                                <InputLabel title={facilityType?.facility_type_name}>
                                                    <Checkbox
                                                        checked={!!isChecked()}
                                                        data-testid={`filtertype-${facilityType?.facility_type_id}`}
                                                        id={`filtertype-${facilityType?.facility_type_id}`}
                                                        onChange={handleChange('facility_type_id')}
                                                    />
                                                    {facilityType?.facility_type_name}
                                                </InputLabel>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li className="no-items">No facility types available</li>
                                )}
                            </ul>
                        </StyledFacilityGroupCheckboxBlock>
                    ))}
            </>
        );
    };

    const handleSaveClick = () => {
        const valuesToSend = {};
        valuesToSend.space_name = formValues?.space_name;
        valuesToSend.space_type_id = formValues?.space_type_id || selectedSpaceType?.space_type_id || null;
        valuesToSend.space_floor_id = formValues?.floor_id;
        valuesToSend.space_precise = formValues?.space_precise;
        valuesToSend.space_capacity = !!formValues?.space_capacity ? formValues?.space_capacity : 0;
        valuesToSend.space_description = showSpaceDescriptionCheckbox ? formValues?.space_description : null;
        valuesToSend.space_photo_url = formValues?.space_photo_url;
        valuesToSend.space_photo_description = formValues?.space_photo_description;
        valuesToSend.space_opening_hours_id = formValues?.space_opening_hours_id;
        valuesToSend.space_services_page = formValues?.space_services_page;
        valuesToSend.space_latitude = formValues?.space_latitude?.toString();
        valuesToSend.space_longitude = formValues?.space_longitude?.toString();
        valuesToSend.space_zlevel = formValues?.space_zlevel;
        valuesToSend.space_external_book_url = !!formValues?.space_external_book_url
            ? formValues?.space_external_book_url
            : null;
        valuesToSend.space_draftmode = !!formValues?.space_draftmode;
        valuesToSend.facility_types = formValues?.facility_types?.map(ft => ft?.facility_type_id);
        valuesToSend.space_id = formValues?.space_id;
        valuesToSend.uploadedFile = formValues.uploadedFile;
        console.log('handleSaveClick valuesToSend=', valuesToSend);

        const validationResult = validateForm({
            ...valuesToSend,
            isBookableCheckbox: formValues.isBookableCheckbox,
            campus_id: formValues?.campus_id,
            library_id: formValues?.library_id,
            floor_id: formValues?.floor_id,
        });
        if (validationResult !== true) {
            setErrorMessages(validationResult);

            document.activeElement.blur();
            const message =
                `<p data-error-count="${validationResult?.length}">These errors occurred:</p>` +
                `<ul>${validationResult?.map(m => `<li>${m?.message}</li>`)?.join('')}</ul>`;
            displayToastErrorMessage(message);
        } else {
            saveToDb(valuesToSend);
        }
    };

    const confirmationLocale = {
        success: {
            confirmationTitle: mode === 'add' ? 'A Space has been added' : 'The Space has been updated',
            confirmationMessage: '',
            confirmButtonLabel: 'Return to dashboard',
            cancelButtonLabel: mode === 'add' ? 'Add another Space' : 'Edit record again',
        },
        error: {
            confirmationTitle: mode === 'add' ? bookableSpacesRoomAddError : bookableSpacesRoomUpdateError,
            confirmationMessage: '',
            confirmButtonLabel: 'Return to dashboard',
            cancelButtonLabel: mode === 'add' ? 'Add another Space' : 'Edit record again',
            alternateActionButtonLabel: 'Close',
        },
    };

    useEffect(() => {
        const currentCampus =
            (!!currentCampusList &&
                currentCampusList.length > 0 &&
                currentCampusList?.find(c => c?.campus_id === formValues?.campus_id)) ||
            {};
        const currentCampusLibraries = validLibraryList(currentCampus?.libraries || []);
        const currentLibrary = currentCampusLibraries?.find(l => l?.library_id === formValues?.library_id) || {};

        const updatedLocation = {};
        updatedLocation.currentCampus = currentCampus;
        updatedLocation.campus_id = currentCampus?.campus_id;

        updatedLocation.currentCampusLibraries = currentCampusLibraries;
        updatedLocation.currentLibrary = currentLibrary;
        updatedLocation.library_id = currentLibrary?.library_id;

        updatedLocation.currentLibraryFloors = currentLibrary?.floors;
        updatedLocation.currentFloor = currentLibrary?.floors?.find(f => f?.floor_id === formValues?.floor_id);
        updatedLocation.floor_id = formValues?.floor_id;
        setLocation({
            ...updatedLocation,
        });
        validateForm(formValues);
    }, [currentCampusList, formValues]);

    const handleSuppliedFiles = files => {
        setFormValues({ ...formValues, ['uploadedFile']: files, hasImage: true });
    };

    const clearSuppliedFile = () => {
        setFormValues(prevState => {
            return { ...prevState, ['uploadedFile']: [], hasImage: false, space_photo_url: '' };
        });
    };

    function a11yProps(index) {
        return {
            id: `spacesform-tab-${index}`,
            'aria-controls': `spacesform-tabpanel-${index}`,
        };
    }

    const [panelId, setPanel] = useState(0);

    const handleTabChange = (event, newPanelId) => {
        setPanel(newPanelId);
    };

    const bookableCheckboxLabel = 'This Space is bookable';
    const aboutPanel = () => {
        const bookingUrlQuerystringWarning = getBookingUrlQuerystringWarning(formValues?.space_external_book_url);
        // const selectedFacilityTypes = formValues?.facility_types || [];
        // const selectedFacilityTypeIds = selectedFacilityTypes
        //     .map(ft => ft?.facility_type_id)
        //     .filter(id => id !== null && id !== undefined);
        // const selectedFacilityTypeIdsAsString = selectedFacilityTypeIds.map(id => String(id));
        // const selectedFacilityTypeNames = selectedFacilityTypes
        //     .map(ft => (ft?.facility_type_name || '').trim().toLowerCase())
        //     .filter(Boolean);

        // const knownBookableFacilityType = getFlatFacilityTypeList(facilityTypeList)?.find(
        //     ft => (ft?.facility_type_name || '').trim().toLowerCase() === 'bookable',
        // );
        // const knownBookableFacilityTypeId =
        //     knownBookableFacilityType?.facility_type_id !== null &&
        //     knownBookableFacilityType?.facility_type_id !== undefined
        //         ? String(knownBookableFacilityType?.facility_type_id)
        //         : null;
        // const isBookableFacilityTypeSelectedById =
        //     !!knownBookableFacilityTypeId && selectedFacilityTypeIdsAsString.includes(knownBookableFacilityTypeId);
        // const isBookableFacilityTypeSelectedByName = selectedFacilityTypeNames.includes('bookable');

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography component={'h3'} variant={'h6'}>
                        About
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="space_name">Space name *</InputLabel>
                        <Input
                            id="space_name"
                            data-testid="space-name"
                            required
                            value={formValues?.space_name || ''}
                            onChange={handleChange('space_name')}
                            onBlur={handleFieldCompletion}
                        />
                        <StyledErrorMessageTypography component={'div'}>
                            {reportErrorMessage('space_name')}
                        </StyledErrorMessageTypography>
                    </FormControl>
                </Grid>
                <Grid item md={6} xs={12}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="add-space-type-label" htmlFor="add-space-type-input">
                            Choose an existing Space type *
                        </InputLabel>
                        <Select
                            id="add-space-type"
                            labelId="add-space-type-label"
                            data-testid="space-type"
                            value={formValues?.space_type_id || selectedSpaceType?.space_type_id || ''}
                            onChange={handleChange('space_type_id')}
                            onBlur={handleFieldCompletion}
                            inputProps={{
                                id: 'add-space-type-input',
                                title: 'Choose an existing Space type',
                            }}
                        >
                            {!!spaceTypeList &&
                                spaceTypeList?.length > 0 &&
                                bookableSpacesRoomList?.data?.known_space_types?.map((spaceType, index) => {
                                    return (
                                        <MenuItem value={spaceType?.space_type_id} key={`spacetype-${index}`}>
                                            {spaceType?.space_type_name}
                                        </MenuItem>
                                    );
                                })}
                        </Select>
                        <StyledErrorMessageTypography component={'div'}>
                            {reportErrorMessage('space_type_id')}
                        </StyledErrorMessageTypography>
                    </FormControl>
                </Grid>

                {!!selectedSpaceTypeDescription && (
                    <Grid item xs={12} data-testid="selected-space-type-description">
                        <Typography component={'p'} variant={'body2'}>
                            {selectedSpaceTypeDescription}
                        </Typography>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showSpaceDescriptionCheckbox}
                                onChange={event => setShowSpaceDescriptionCheckbox(event.target.checked)}
                                data-testid="toggle-space-description-checkbox"
                            />
                        }
                        label="Provide additional description for this space"
                    />
                </Grid>
                {showSpaceDescriptionCheckbox && (
                    <Grid item xs={12} data-testid="add-space-description">
                        <label htmlFor="space_description">
                            Space description
                            <br />
                            <span style={{ fontWeight: 400 }}>
                                Optional: Add details unique to this space. This will appear after the standard space
                                type description. Leave blank to use only the standard description.
                            </span>
                        </label>
                        <CKEditor
                            id="space_description"
                            label="Space description"
                            editor={ClassicEditor}
                            config={editorConfig}
                            data={formValues?.space_description || ''}
                            onReady={editor => {
                                editor.editing.view.change(writer => {
                                    writer.setStyle('height', '200px', editor.editing.view.document.getRoot());
                                });

                                const editableElement = editor.ui.getEditableElement();
                                editableElement?.addEventListener('click', event => {
                                    const anchorElement = event?.target?.closest?.('a');
                                    if (!!anchorElement) {
                                        event.preventDefault();
                                    }
                                });
                            }}
                            onChange={(event, editor) => {
                                const htmlData = editor.getData();
                                setFormValues({ ...formValues, space_description: htmlData });
                            }}
                            onBlur={handleFieldCompletion}
                        />
                        <StyledErrorMessageTypography component={'div'}>
                            {reportErrorMessage('space_description')}
                        </StyledErrorMessageTypography>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <StyledHighlightedGrid item xs={12}>
                        <FormControlLabel
                            label={bookableCheckboxLabel}
                            data-testid="contains-bookable-checkbox"
                            control={
                                <Checkbox
                                    checked={!!isBookable}
                                    data-testid="space-can-book"
                                    className={'checkbox'}
                                    onChange={handleChange('isBookableCheckbox')}
                                    inputProps={{ 'aria-label': bookableCheckboxLabel }}
                                />
                            }
                        />
                        {!!isBookable && (
                            <div data-testid="booking-link-details">
                                <Typography component={'h4'} variant={'p'}>
                                    Provide a booking link
                                </Typography>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel htmlFor="space_external_book_url">
                                        Enter the UQ Bookit landing page for this Space *
                                    </InputLabel>
                                    <Input
                                        id="space_external_book_url"
                                        data-testid="space_external_book_url"
                                        value={formValues?.space_external_book_url || ''}
                                        onChange={handleChange('space_external_book_url')}
                                        onBlur={handleFieldCompletion}
                                    />
                                    <StyledErrorMessageTypography component={'div'}>
                                        {reportErrorMessage('space_external_book_url')}
                                    </StyledErrorMessageTypography>
                                </FormControl>
                                {!!bookingUrlQuerystringWarning && (
                                    <StyledWarningListBox data-testid="spaces-booking-url-warning-list">
                                        <WarningAmberIcon style={{ color: theme?.palette.warning.dark }} />
                                        <p>{bookingUrlQuerystringWarning}</p>
                                    </StyledWarningListBox>
                                )}
                            </div>
                        )}
                    </StyledHighlightedGrid>
                </Grid>
                <Grid item xs={12}>
                    <div data-testid="capacity-details">
                        <Typography component={'h4'} variant={'p'}>
                            How many people can use this space? (Required field when space is bookable){' '}
                            {isBookable && (
                                <span
                                    className="required"
                                    aria-label="Required"
                                    data-testid="capacity-required-indicator"
                                >
                                    *
                                </span>
                            )}
                        </Typography>
                        {console.log('formValues?.space_capacity=', formValues?.space_capacity)}
                        <FormControl variant="standard" fullWidth>
                            <InputLabel htmlFor="space-capacity">
                                Enter the number of patrons who can make use of this Space
                            </InputLabel>
                            <Input
                                type="number"
                                id="space-capacity"
                                data-testid="space-capacity"
                                value={formValues?.space_capacity || 0}
                                onChange={handleChange('space_capacity')}
                                // onBlur={handleChange('space_capacity')}
                                onBlur={handleFieldCompletion}
                                style={{ width: '5rem' }}
                                inputProps={{
                                    style: { textAlign: 'right' },
                                    min: 0,
                                }}
                                required={isBookable}
                            />
                            <Typography component={'p'} style={{ marginTop: '0.5rem' }}>
                                (Note: capacity is only displayed to users if the space is bookable.)
                            </Typography>
                            {!!isBookable && (
                                <StyledErrorMessageTypography component={'div'} data-testid="space-capacity-error">
                                    {reportErrorMessage('space_capacity')}
                                </StyledErrorMessageTypography>
                            )}
                        </FormControl>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        label={
                            <span data-testid="space-draftmode-label">
                                Draft mode (this Space will not be displayed until draft mode is disabled, and it is
                                ready to publish)
                            </span>
                        }
                        data-testid="space-draftmode-checkbox"
                        control={
                            <Checkbox
                                checked={!!formValues?.space_draftmode}
                                data-testid="space_draftmode"
                                className={'checkbox'}
                                onChange={handleChange('space_draftmode')}
                            />
                        }
                    />
                </Grid>
            </Grid>
        );
    };
    const facilityTypePanel = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography component={'h3'} variant={'h6'} style={{ marginBottom: '1rem' }}>
                        Facility types
                    </Typography>
                    <StyledFilterWrapper>{showFilterCheckboxes()}</StyledFilterWrapper>
                </Grid>
            </Grid>
        );
    };
    const locationPanel = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography component={'h3'} variant={'h6'}>
                        Location
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="add-space-select-campus-label" htmlFor="add-space-select-campus-input">
                            Campus *
                        </InputLabel>
                        <Select
                            id="add-space-select-campus"
                            labelId="add-space-select-campus-label"
                            data-testid="add-space-select-campus"
                            value={formValues?.campus_id}
                            onChange={handleChange('campus_id')}
                            required
                            inputProps={{
                                id: 'add-space-select-campus-input',
                                'aria-labelledby': 'add-space-select-campus-label',
                            }}
                        >
                            {!!currentCampusList &&
                                currentCampusList?.length > 0 &&
                                currentCampusList?.map((campus, index) => (
                                    <MenuItem value={campus?.campus_id} key={`select-campus-${index}`}>
                                        {campus?.campus_name}
                                    </MenuItem>
                                ))}
                        </Select>
                        <StyledErrorMessageTypography component={'div'}>
                            {reportErrorMessage('??')}
                        </StyledErrorMessageTypography>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="add-space-select-library-label" htmlFor="add-space-select-library-input">
                            Library *
                        </InputLabel>
                        <Select
                            id="add-space-select-library"
                            labelId="add-space-select-library-label"
                            data-testid="add-space-select-library"
                            value={formValues?.library_id}
                            onChange={handleChange('library_id')}
                            required
                            inputProps={{
                                id: 'add-space-select-library-input',
                                'aria-labelledby': 'add-space-select-library-label',
                            }}
                        >
                            {!!location.currentCampusLibraries &&
                                location.currentCampusLibraries?.length > 0 &&
                                location.currentCampusLibraries?.map((library, index) => (
                                    <MenuItem value={library?.library_id} key={`select-library-${index}`}>
                                        {library?.library_name || library?.building_name}
                                    </MenuItem>
                                ))}
                        </Select>
                        <StyledErrorMessageTypography component={'div'}>
                            {reportErrorMessage('??')}
                        </StyledErrorMessageTypography>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel id="add-space-select-floor-label" htmlFor="add-space-select-floor-input">
                            Level *
                        </InputLabel>
                        <Select
                            id="add-space-select-floor"
                            labelId="add-space-select-floor-label"
                            data-testid="add-space-select-floor"
                            value={formValues?.floor_id}
                            onChange={handleChange('floor_id')}
                            required
                            inputProps={{
                                id: 'add-space-select-floor-input',
                                'aria-labelledby': 'add-space-select-floor-label',
                            }}
                        >
                            {!!location?.currentLibrary &&
                                !!location?.currentLibraryFloors &&
                                location?.currentLibraryFloors?.length > 0 &&
                                location?.currentLibraryFloors?.map((floor, index) => {
                                    const libraryName =
                                        location?.currentLibrary?.library_name ||
                                        location?.currentLibrary?.building_name;
                                    return (
                                        <MenuItem value={floor?.floor_id} key={`select-floor-${index}`}>
                                            {floor?.floor_name}{' '}
                                            {location?.currentLibrary?.ground_floor_id === floor?.floor_id
                                                ? ' (Ground floor)'
                                                : ''}
                                            {`${
                                                window.location.host === 'localhost:2020' // to make the Select more readable to we poor devs, also makes more accurate test
                                                    ? ' [' + libraryName + ' - ' + floor?.floor_id + ']'
                                                    : ''
                                            }`}
                                        </MenuItem>
                                    );
                                })}
                        </Select>
                        <StyledErrorMessageTypography component={'div'}>
                            {reportErrorMessage('??')}
                        </StyledErrorMessageTypography>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="space_precise">
                            Description of Space placement within the Library
                        </InputLabel>
                        <Input
                            id="space_precise"
                            data-testid="add-space-precise-location"
                            value={formValues?.space_precise || ''}
                            onChange={handleChange('space_precise')}
                            onBlur={handleFieldCompletion}
                        />
                        <StyledErrorMessageTypography component={'div'}>
                            {reportErrorMessage('space_precise')}
                        </StyledErrorMessageTypography>
                    </FormControl>
                    <StyledPrettyLocationDiv data-testid="add-space-pretty-location">
                        <Typography component={'h4'} variant={'h6'}>
                            Displayed location text
                        </Typography>
                        {getFriendlyLocationDescription({
                            space_is_ground_floor:
                                location?.currentFloor?.floor_id === location?.currentLibrary?.ground_floor_id,
                            space_floor_name: location?.currentFloor?.floor_name,
                            space_precise: formValues?.space_precise,
                            space_library_name: location?.currentLibrary?.library_name,
                            space_building_name: location?.currentLibrary?.building_name,
                            space_building_number: location?.currentLibrary?.building_number,
                            space_campus_name: location?.currentCampus?.campus_name,
                        })}
                    </StyledPrettyLocationDiv>
                </Grid>
                <Grid item xs={12}>
                    <Typography component={'p'}>
                        The "About" page for this Library: <span>{reportCurrentLibraryAboutPage(location)}</span>
                    </Typography>
                    <FormControl variant="standard" fullWidth>
                        <InputLabel htmlFor="space_services_page">Enter a different page for this Space:</InputLabel>
                        <Input
                            id="space_services_page"
                            data-testid="space_services_page"
                            value={formValues?.space_services_page || ''}
                            onChange={handleChange('space_services_page')}
                            onBlur={handleFieldCompletion}
                        />
                        <StyledErrorMessageTypography component={'div'}>
                            {reportErrorMessage('space_services_page')}
                        </StyledErrorMessageTypography>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <SpaceLocationMap
                        formValues={formValues}
                        setFormValues={setFormValues}
                        campusCoordinateList={currentCampusList}
                        bookableSpacesRoomList={bookableSpacesRoomList}
                        initialCampus={initialCampus}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography component={'h3'} variant={'h6'}>
                        Opening hours
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <StyledSpringshareHouseFormControl variant="standard" fullWidth className="asLoaded">
                        <InputLabel id="add-space-springshare-id-label" htmlFor="add-space-springshare-input">
                            Choose the Springshare Library to use for Opening hours *
                        </InputLabel>
                        <Select
                            id="add-space-springshare-id"
                            labelId="add-space-springshare-id-label"
                            data-testid="add-space-springshare-id"
                            value={formValues?.space_opening_hours_id} // selectedSpringshareOption
                            onChange={handleChange('space_opening_hours_id')}
                            required
                            inputProps={{
                                id: 'add-space-springshare-input',
                                'aria-labelledby': 'add-space-springshare-id-label',
                            }}
                        >
                            {!!springshareList &&
                                springshareList?.length > 0 &&
                                springshareList?.map((s, index) => {
                                    return (
                                        <MenuItem value={s?.id} key={`select-floor-${index}`}>
                                            {s?.display_name}
                                        </MenuItem>
                                    );
                                })}
                        </Select>
                        <StyledErrorMessageTypography component={'div'}>
                            {reportErrorMessage('space_opening_hours_id')}
                        </StyledErrorMessageTypography>
                    </StyledSpringshareHouseFormControl>{' '}
                </Grid>
            </Grid>
        );
    };
    const imageryPanel = () => {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography component={'h3'} variant={'h6'}>
                        Imagery
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl variant="standard" fullWidth>
                        <ImageUploadDropzone
                            onAddFile={handleSuppliedFiles}
                            onClearFile={clearSuppliedFile}
                            currentImage={formValues?.space_photo_url}
                        />
                        <StyledErrorMessageTypography component={'div'}>
                            {reportErrorMessage('space_photo_url')}
                        </StyledErrorMessageTypography>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    {/* this WONT be upgraded to CK, because it should just be plain text! */}
                    <TextField
                        id="space_photo_description"
                        data-testid="space_photo_description"
                        label={basePhotoDescriptionFieldLabel}
                        variant="standard"
                        fullWidth
                        multiline
                        rows={4}
                        value={formValues?.space_photo_description || ''}
                        onChange={handleChange('space_photo_description')}
                        inputProps={{
                            'data-testid': 'add-space-photo-description',
                        }}
                        onBlur={handleFieldCompletion}
                    />
                    <StyledErrorMessageTypography component={'div'}>
                        {reportErrorMessage('space_photo_description')}
                    </StyledErrorMessageTypography>
                </Grid>
                <Grid item xs={12}>
                    <Typography component={'p'} variant={'p'} sx={{ textAlign: 'right' }}>
                        Required fields are marked with a *
                    </Typography>
                </Grid>
            </Grid>
        );
    };
    const outagePanel = () => {
        return (
            <SpaceOutagePanel
                actions={actions}
                mode={mode}
                spaceId={formValues?.space_id}
                spaceName={formValues?.space_name}
                floorId={formValues?.floor_id}
                libraryId={formValues?.library_id}
                campusId={formValues?.campus_id}
                spaceOutageList={spaceOutageList}
                spaceOutageListLoading={spaceOutageListLoading}
                spaceOutageListError={spaceOutageListError}
            />
        );
    };
    const cancelButton = () => {
        return (
            <StyledUqTightLink
                href={spacesAdminLink('/admin/spaces', account)}
                data-testid="admin-spaces-form-button-cancel"
            >
                <span>Cancel</span>
            </StyledUqTightLink>
        );
    };

    const handleUndeleteClick = () => {
        showUndeleteConfirmation();
    };

    const confirmUndelete = () => {
        hideUndeleteConfirmation();
        if (!formValues?.space_id) {
            console.error('Space ID not found');
            return;
        }
        actions.updateSpaceDeletedState(formValues.space_id, false);
    };

    const undeleteConfirmationDialog = () => {
        return (
            <Dialog
                open={isUndeleteConfirmationOpen}
                onClose={hideUndeleteConfirmation}
                data-testid="spaces-undelete-dialog"
            >
                <DialogContent>
                    <DialogContentText data-testid="spaces-undelete-dialog-message">
                        Do you wish to restore this deleted space?
                    </DialogContentText>
                </DialogContent>
                <DialogActions data-testid="spaces-undelete-dialog-actions">
                    <Button onClick={hideUndeleteConfirmation} data-testid="spaces-undelete-cancel-button">
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmUndelete}
                        color="primary"
                        variant="contained"
                        data-testid="spaces-undelete-confirm-button"
                    >
                        Restore
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };
    const saveButton = (disabled = false) => {
        return (
            <div>
                <StyledPrimaryButton
                    data-testid="admin-spaces-save-button-submit"
                    variant="contained"
                    children="Save"
                    disabled={disabled}
                    onClick={() => handleSaveClick()}
                />
                {errorMessages?.length > 0 && (
                    <div data-testid="spaces-button-error-list">
                        <h2 data-error-count={errorMessages?.length}>Errors</h2>
                        <p>These errors occurred:</p>
                        {errorMessages?.map((m, index) => {
                            return <p key={`error-${index}`}>{m?.message}</p>;
                        })}
                    </div>
                )}
            </div>
        );
    };

    function panelErrorCount(tabId) {
        if (tabId === firstTabId) {
            const abouterrorcount = validatePanelAbout(formValues);
            console.log('abouterrorcount=', abouterrorcount);
            return abouterrorcount?.length;
        } else if (tabId === secondTabId) {
            return validatePanelFacilityTypes(formValues)?.length;
        } else if (tabId === thirdTabId) {
            return validatePanelLocation(formValues)?.length;
        } else {
            // tabId must = 3 in add mode
            return validatePanelImagery(formValues)?.length;
        }
    }

    return (
        <>
            <ConfirmationBox
                confirmationBoxId="spaces-save-outcome"
                isOpen={isConfirmationOpen}
                onClose={hideConfirmation}
                onAction={() => returnToDashboard()}
                //
                hideCancelButton={!confirmationLocale?.success?.cancelButtonLabel}
                onCancelAction={() => {
                    mode === 'edit' ? reEditRecord() : clearForm();
                }}
                //
                showAlternateActionButton={!!bookableSpacesRoomUpdateError}
                alternateActionButtonLabel="Close"
                onAlternateAction={hideConfirmation}
                //
                locale={
                    !!bookableSpacesRoomAddError || !!bookableSpacesRoomUpdateError
                        ? confirmationLocale?.error
                        : confirmationLocale?.success
                }
                cancelButtonColor="accent"
            />
            {undeleteConfirmationDialog()}

            <SpacesAdminPage
                systemTitle="Spaces"
                pageTitle={pageTitle}
                currentPageSlug={currentPageSlug}
                standardPageId="StandardPage"
            >
                {mode === 'add' && (
                    <>
                        <form id="spaces-addedit-form">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Stepper activeStep={activeStep}>
                                        {addModeTabLabels?.map((tabName, tabId) => {
                                            const stepProps = { completed: null };
                                            const labelProps = {
                                                optional: null,
                                            };
                                            return (
                                                <Step key={tabName} {...stepProps} sx={{ paddingRight: '25px' }}>
                                                    <StepLabel {...labelProps}>
                                                        {panelErrorCount(tabId) === 0 ? (
                                                            <span data-testid={`tab-${slugifyName(tabName)}`}>
                                                                {tabName}
                                                            </span>
                                                        ) : (
                                                            <StyledErrorCountBadge
                                                                color="error"
                                                                badgeContent={panelErrorCount(tabId)}
                                                                data-testid={`tab-${slugifyName(tabName)}`}
                                                            >
                                                                {tabName}
                                                            </StyledErrorCountBadge>
                                                        )}
                                                    </StepLabel>
                                                </Step>
                                            );
                                        })}
                                    </Stepper>
                                </Grid>
                                {!!formValues?.space_draftmode && (
                                    <Grid item xs={12} data-testid="space-draftmode-notice">
                                        <StyledDraftModeNotice data-testid="space-draftmode-notice-stepper-panel">
                                            <WarningAmberIcon
                                                style={{ color: theme?.palette.warning.dark }}
                                                data-testid="space-draftmode-notice-stepper-icon"
                                            />
                                            <Typography
                                                component={'p'}
                                                variant={'body2'}
                                                data-testid="space-draftmode-notice-stepper-text"
                                            >
                                                This Space is currently in draft mode and will not be displayed until
                                                draft mode is turned off.
                                            </Typography>
                                        </StyledDraftModeNotice>
                                    </Grid>
                                )}
                                {activeStep === firstTabId && aboutPanel()}
                                {activeStep === secondTabId && facilityTypePanel()}
                                {activeStep === thirdTabId && locationPanel()}
                                {activeStep === addModeLastTabId && imageryPanel()}
                                <Grid item xs={12}>
                                    <Box
                                        id={'button-wrapper'}
                                        sx={{ display: 'flex', flexDirection: 'row', pt: 2, alignItems: 'start' }}
                                    >
                                        <StyledSecondaryButton
                                            color="inherit"
                                            disabled={activeStep === firstTabId}
                                            onClick={handleBack}
                                            sx={{ mr: 1 }}
                                            data-testid="spaces-form-back-button"
                                        >
                                            Back
                                        </StyledSecondaryButton>
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        {activeStep === addModeLastTabId ? (
                                            saveButton(errorMessages?.length > 0)
                                        ) : (
                                            <StyledPrimaryButton
                                                onClick={handleNext}
                                                data-testid="spaces-form-next-button"
                                            >
                                                Next
                                            </StyledPrimaryButton>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </form>
                        <Grid container spacing={3}>
                            <Grid item xs={12} style={{ marginTop: '2rem', textAlign: 'center' }}>
                                {cancelButton()}
                            </Grid>
                        </Grid>
                    </>
                )}
                {mode === 'edit' && (
                    <>
                        <form id="spaces-addedit-form">
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <StyledTabs value={panelId} onChange={handleTabChange} aria-label="Space fields">
                                        {editModeTabLabels?.map((tabName, index) => {
                                            // Keep the legacy outages test id for existing tests.
                                            const isOutagesTab = ['outages', 'closures'].includes(slugifyName(tabName));
                                            return (
                                                <Tab
                                                    key={`${tabName}-edit`}
                                                    label={`${tabName}`}
                                                    {...a11yProps(index)}
                                                    data-testid={
                                                        isOutagesTab
                                                            ? 'tab-unavailability'
                                                            : `tab-${slugifyName(tabName)}`
                                                    }
                                                />
                                            );
                                        })}
                                    </StyledTabs>
                                </Box>
                                {!!formValues?.space_draftmode && (
                                    <Box sx={{ mt: 2 }} data-testid="space-draftmode-notice">
                                        <StyledDraftModeNotice data-testid="space-draftmode-notice-tabs-panel">
                                            <WarningAmberIcon
                                                style={{ color: theme?.palette.warning.dark }}
                                                data-testid="space-draftmode-notice-tabs-icon"
                                            />
                                            <Typography
                                                component={'p'}
                                                variant={'body2'}
                                                data-testid="space-draftmode-notice-tabs-text"
                                            >
                                                This Space is currently in draft mode and will not be displayed in the
                                                spaces list until draft mode is turned off.
                                            </Typography>
                                        </StyledDraftModeNotice>
                                    </Box>
                                )}
                                {formValues?.space_deleted === true && (
                                    <Box sx={{ mt: 2 }} data-testid="space-deleted-notice">
                                        <StyledErrorAttentionMessageDiv data-testid="space-deleted-notice-panel">
                                            <HighlightOffIcon
                                                style={{ color: '#000' }}
                                                data-testid="space-deleted-notice-icon"
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <Typography
                                                    component={'p'}
                                                    variant={'body2'}
                                                    data-testid="space-deleted-notice-text"
                                                    sx={{ mb: 1 }}
                                                >
                                                    This Space has been deleted and is not visible to users. You can
                                                    restore it using the button below.
                                                </Typography>
                                                <StyledPrimaryButton
                                                    onClick={handleUndeleteClick}
                                                    size="small"
                                                    data-testid="space-undelete-button"
                                                    sx={{ mt: 1 }}
                                                >
                                                    Restore Space
                                                </StyledPrimaryButton>
                                            </Box>
                                        </StyledErrorAttentionMessageDiv>
                                    </Box>
                                )}
                                {spaceUnavailabilityStatus === 'Upcoming' && (
                                    <Box sx={{ mt: 2 }} data-testid="space-outage-upcoming-notice">
                                        <StyledDraftModeNotice data-testid="space-outage-upcoming-notice-panel">
                                            <ErrorOutlineIcon
                                                style={{ color: theme?.palette.warning.dark }}
                                                data-testid="space-outage-upcoming-notice-icon"
                                            />
                                            <Typography
                                                component={'p'}
                                                variant={'body2'}
                                                data-testid="space-outage-upcoming-notice-text"
                                            >
                                                This Space has scheduled closure(s). It will be shown as unavailable
                                                during that time.
                                            </Typography>
                                        </StyledDraftModeNotice>
                                    </Box>
                                )}
                                {spaceUnavailabilityStatus === 'Current' && (
                                    <Box sx={{ mt: 2 }} data-testid="space-outage-current-notice">
                                        <StyledErrorAttentionMessageDiv data-testid="space-outage-current-notice-panel">
                                            <HighlightOffIcon
                                                style={{ color: '#000' }}
                                                data-testid="space-outage-current-notice-icon"
                                            />
                                            <Typography
                                                component={'p'}
                                                variant={'body2'}
                                                data-testid="space-outage-current-notice-text"
                                            >
                                                This Space is presently unavailable and will display as unavailable in
                                                the spaces list until the current closure ends.
                                            </Typography>
                                        </StyledErrorAttentionMessageDiv>
                                    </Box>
                                )}
                                <CustomTabPanel value={panelId} index={firstTabId} testId="spaces-tabpanel-about">
                                    {aboutPanel()}
                                </CustomTabPanel>
                                <CustomTabPanel
                                    value={panelId}
                                    index={secondTabId}
                                    testId="spaces-tabpanel-facility-types"
                                >
                                    {facilityTypePanel()}
                                </CustomTabPanel>
                                <CustomTabPanel
                                    value={panelId}
                                    index={thirdTabId}
                                    keepMounted
                                    testId="spaces-tabpanel-location-hours"
                                >
                                    {locationPanel()}
                                </CustomTabPanel>
                                <CustomTabPanel
                                    value={panelId}
                                    index={editModeOutageTabId}
                                    testId="spaces-tabpanel-unavailability"
                                >
                                    {outagePanel()}
                                </CustomTabPanel>
                                <CustomTabPanel
                                    value={panelId}
                                    index={editModeImageryTabId}
                                    testId="spaces-tabpanel-imagery"
                                >
                                    {imageryPanel()}
                                </CustomTabPanel>
                            </Box>
                        </form>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                {cancelButton()}
                            </Grid>
                            <Grid item xs={6} align="right">
                                {saveButton()}
                            </Grid>
                        </Grid>
                    </>
                )}
            </SpacesAdminPage>
        </>
    );
};

EditSpaceForm.propTypes = {
    actions: PropTypes.any,
    bookableSpacesRoomAdding: PropTypes.any,
    bookableSpacesRoomAddError: PropTypes.any,
    bookableSpacesRoomAddResult: PropTypes.any,
    currentCampusList: PropTypes.any,
    initialCampus: PropTypes.number,
    bookableSpacesRoomList: PropTypes.any,
    bookableSpacesRoomListLoading: PropTypes.any,
    bookableSpacesRoomListError: PropTypes.any,
    facilityTypeList: PropTypes.any,
    facilityTypeListLoading: PropTypes.any,
    facilityTypeListError: PropTypes.any,
    bookableSpacesRoomUpdating: PropTypes.any,
    bookableSpacesRoomUpdateError: PropTypes.any,
    bookableSpacesRoomUpdateResult: PropTypes.any,
    formValues: PropTypes.any,
    setFormValues: PropTypes.any,
    saveToDb: PropTypes.func,
    pageTitle: PropTypes.string,
    currentPageSlug: PropTypes.string,
    mode: PropTypes.string,
    bookableSpaceGetError: PropTypes.any,
    springshareList: PropTypes.any,
    spaceOutageList: PropTypes.any,
    spaceOutageListLoading: PropTypes.any,
    spaceOutageListError: PropTypes.any,
};

export default React.memo(EditSpaceForm);
