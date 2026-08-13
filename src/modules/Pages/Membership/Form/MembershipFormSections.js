import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { isFieldVisible } from '../membershipFieldRules';
import {
    getFieldConfig,
    getSectionTitle,
    isSectionDeclaredForType,
    membershipFormSections,
} from '../membershipFormFields';
import MembershipFormField from './MembershipFormField';

export const visibleFieldsInRow = (row, type) => row.fields.filter(field => isFieldVisible(field, type));

export const visibleRowsInSection = (section, type) =>
    section.rows.filter(row => visibleFieldsInRow(row, type).length > 0);

/**
 * The sections a type actually sees. A section drops out if the field rules leave it with nothing to ask — so
 * the config never has to repeat what the rules already say.
 */
export const getVisibleSections = type =>
    membershipFormSections
        .filter(section => isSectionDeclaredForType(section, type))
        .filter(section => visibleRowsInSection(section, type).length > 0);

/**
 * A row of the form. Where several controls sit under one heading — "Your Name", "Date of Birth" — the row
 * becomes a fieldset with that heading as its legend, and each control keeps its own label, hidden but
 * announced, so every control has an accessible name even when only the group is captioned.
 */
export const MembershipFormRow = ({ row, ...fieldProps }) => {
    const fields = visibleFieldsInRow(row, fieldProps.type);

    if (fields.length === 0) {
        return null;
    }

    // A field may set its own width; otherwise a captioned row shares its width evenly and a lone control
    // takes two thirds.
    const renderField = field => (
        <Grid item xs={12} sm={getFieldConfig(field).gridSm ?? (row.legend ? true : 8)} key={field}>
            <MembershipFormField field={field} hideLabel={!!row.legend} {...fieldProps} />
        </Grid>
    );

    if (!row.legend) {
        return (
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                {fields.map(renderField)}
            </Grid>
        );
    }

    return (
        <Box
            component="fieldset"
            sx={{ border: 0, margin: 0, marginBottom: 2, padding: 0 }}
            data-testid={`membership-form-group-${row.legend.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
        >
            {/* Must be the fieldset's first child, or it does not name the group. */}
            <Typography component="legend" variant="body1">
                {row.legend}
            </Typography>
            <Grid container spacing={2}>
                {fields.map(renderField)}
            </Grid>
        </Box>
    );
};

MembershipFormRow.propTypes = {
    row: PropTypes.object.isRequired,
    type: PropTypes.string,
};

export const MembershipFormSections = ({ type, ...fieldProps }) => (
    <>
        {getVisibleSections(type).map(section => (
            <section key={section.id} data-testid={`membership-form-section-${section.id}`}>
                <Typography component="h2" variant="h6" sx={{ marginTop: 3, marginBottom: 1 }}>
                    {getSectionTitle(section, type)}
                </Typography>
                {visibleRowsInSection(section, type).map((row, index) => (
                    <MembershipFormRow key={index} row={row} type={type} {...fieldProps} />
                ))}
            </section>
        ))}
    </>
);

MembershipFormSections.propTypes = {
    type: PropTypes.string,
};

export default MembershipFormSections;
