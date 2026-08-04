import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { visuallyHidden } from '@mui/utils';

import { Field, useForm } from 'modules/SharedComponents/Toolbox/ReactHookForm';
import TextField from 'modules/SharedComponents/Toolbox/TextField/components/TextField';
import SelectField from 'modules/SharedComponents/Toolbox/SelectField/components/SelectField';

import { default as locale } from '../membershipAdmin.locale';

const strings = locale.list.search;

export const STATUS_ANY = '';
export const STATUS_UNCONFIRMED = 'unconfirmed';
export const STATUS_RECONFIRM = 'reconfirm';

export const defaultFilter = { name: '', type: '', status: STATUS_ANY };

// The status filter is one choice of three: unconfirmed, reconfirm, or any. A select says exactly that to a
// screen reader, and reads as the same kind of control as the type filter beside it.
export const statusOptions = [
    { value: STATUS_UNCONFIRMED, label: strings.status.unconfirmed },
    { value: STATUS_RECONFIRM, label: strings.status.reconfirm },
];

export const typeOptions = (accountTypes = []) =>
    [...accountTypes]
        .sort((a, b) => String(a.title).localeCompare(String(b.title)))
        .map(type => ({ value: type.value, label: type.title }));

/**
 * The filter above the admin listing: a name to search on, and the type and status to narrow by.
 *
 * One row on a wide screen. The three filters are the same kind of control as each other, so they read as a bar
 * rather than a form to work down, and the whole thing costs the admin no scrolling before the results. The
 * legend saying what the group is for is there for a screen reader but not drawn: the controls describe
 * themselves on sight, and a heading above them only pushed the results further down.
 */
export const MembershipSearchForm = ({ accountTypes, searching, onSearch }) => {
    const { control, handleSubmit } = useForm({ defaultValues: defaultFilter });

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onSearch)} data-testid="membership-search-form">
            <Box component="fieldset" sx={{ border: 0, margin: 0, padding: 0 }}>
                <Typography component="legend" sx={visuallyHidden}>
                    {strings.legend}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 2 }}>
                    <Box sx={{ flex: '2 1 200px', minWidth: 160 }}>
                        <Field
                            control={control}
                            name="name"
                            component={TextField}
                            textFieldId="membership-search-name"
                            label={strings.name.label}
                            placeholder={strings.name.placeholder}
                        />
                    </Box>

                    <Box sx={{ flex: '1 1 160px', minWidth: 140 }}>
                        <Field
                            control={control}
                            name="type"
                            component={SelectField}
                            selectFieldId="membership-search-type"
                            label={strings.type.label}
                            placeholder={strings.type.placeholder}
                            options={typeOptions(accountTypes)}
                        />
                    </Box>

                    <Box sx={{ flex: '1 1 160px', minWidth: 140 }}>
                        <Field
                            control={control}
                            name="status"
                            component={SelectField}
                            selectFieldId="membership-search-status"
                            label={strings.status.label}
                            placeholder={strings.status.any}
                            options={statusOptions}
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SearchIcon />}
                        disabled={!!searching}
                        data-testid="membership-search-button"
                    >
                        {searching ? strings.submitting : strings.submit}
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

MembershipSearchForm.propTypes = {
    accountTypes: PropTypes.array,
    searching: PropTypes.bool,
    onSearch: PropTypes.func.isRequired,
};

export default MembershipSearchForm;
