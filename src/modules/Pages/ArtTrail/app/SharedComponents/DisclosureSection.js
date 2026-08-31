import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const SHARED_BUTTON_SX = {
    px: 0,
    ml: 0,
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    color: 'primary.main',
    textDecoration: 'underline',
    textUnderlineOffset: '0.14em',
    '&:hover': {
        textDecoration: 'underline',
        backgroundColor: 'transparent',
    },
};

const getExpandIconSx = isExpanded => ({
    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.2s ease',
});

const COLLAPSED_BUTTON_SX = {
    ...SHARED_BUTTON_SX,
    pt: 1.5,
    pb: 0,
    verticalAlign: 'baseline',
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 70%)',
};

const EXPANDED_BUTTON_SX = {
    ...SHARED_BUTTON_SX,
    py: 0,
    mb: 1.5,
    width: '100%',
    minWidth: 0,
    justifyContent: 'center',
    backgroundColor: 'white',
    '& .MuiButton-endIcon': {
        ml: 0.25,
    },
};

const DisclosureSection = ({
    heading,
    summary,
    details,
    collapsedLabel = 'View more',
    expandedLabel = 'View less',
    forceExpanded = false,
}) => {
    const [isExpanded, setIsExpanded] = React.useState(forceExpanded);
    const expandedContentId = React.useId();

    return (
        <Box>
            {heading}
            <Box sx={{ position: 'relative' }}>
                {summary}
                {!forceExpanded && !isExpanded ? (
                    <Button
                        type="button"
                        variant="text"
                        onClick={() => setIsExpanded(true)}
                        aria-expanded={isExpanded}
                        aria-controls={expandedContentId}
                        endIcon={<ExpandMoreIcon sx={getExpandIconSx(isExpanded)} />}
                        sx={COLLAPSED_BUTTON_SX}
                    >
                        {collapsedLabel}
                    </Button>
                ) : null}
            </Box>

            <Box id={expandedContentId}>{isExpanded ? details : null}</Box>

            {!forceExpanded && isExpanded ? (
                <Box sx={{ mt: 0.25 }}>
                    <Button
                        type="button"
                        onClick={() => setIsExpanded(currentState => !currentState)}
                        aria-expanded={isExpanded}
                        aria-controls={expandedContentId}
                        endIcon={<ExpandMoreIcon sx={getExpandIconSx(isExpanded)} />}
                        sx={EXPANDED_BUTTON_SX}
                    >
                        {expandedLabel}
                    </Button>
                </Box>
            ) : null}
        </Box>
    );
};

DisclosureSection.propTypes = {
    collapsedLabel: PropTypes.string,
    details: PropTypes.node,
    expandedLabel: PropTypes.string,
    heading: PropTypes.node,
    summary: PropTypes.node.isRequired,
    forceExpanded: PropTypes.bool,
};

export default DisclosureSection;
