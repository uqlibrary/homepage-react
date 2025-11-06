import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@mui/material/styles';

import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
    '&.Mui-disabled': {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        opacity: 0.8,
    },
    '& .MuiAccordionSummary-root.Mui-disabled': {
        opacity: 0.8,
        '& .MuiAccordionSummary-content': {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            opacity: 0.8,
        },
    },
}));

const componentIdLower = 'accordionWithCheckbox';

export const AccordionWithCheckbox = ({ id, children, label, slotProps, disabled = false }) => (
    <StyledAccordion {...slotProps?.accordion} disabled={disabled}>
        <AccordionSummary
            expandIcon={<></>}
            aria-controls={`${id}-content`}
            id={`${id}-header`}
            {...slotProps?.accordionSummary}
        >
            <FormControlLabel
                control={
                    <Checkbox
                        id={`${componentIdLower}-${id}-checkbox`}
                        data-testid={`${componentIdLower}-${id}-checkbox`}
                        disabled={disabled}
                        color="primary"
                        {...slotProps?.checkbox}
                    />
                }
                onClick={e => {
                    e.stopPropagation();
                }}
                label={label}
            />
        </AccordionSummary>
        <AccordionDetails {...slotProps?.accordionDetails}>{children}</AccordionDetails>
        <AccordionActions>
            <Button {...slotProps?.accordionActions}>Clear</Button>
        </AccordionActions>
    </StyledAccordion>
);

AccordionWithCheckbox.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    slotProps: PropTypes.shape({
        accordion: PropTypes.object,
        accordionSummary: PropTypes.object,
        accordionDetails: PropTypes.object,
        accordionActions: PropTypes.object,
        checkbox: PropTypes.object,
    }),
};
