import React from 'react';
import PropTypes from 'prop-types';

// MUI 1
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

const useStyles = makeStyles(
    theme => ({
        helpIcon: {
            color: theme.palette.secondary.light,
            opacity: 0.66,
            '&:hover': {
                opacity: 0.87,
            },
        },
    }),
    { withTheme: true },
);

export const HelpIcon = ({ title, text, buttonLabel, iconSize, tooltip, onClick, IconComponent }) => {
    const classes = useStyles();
    const setDrawerContent = () => {
        onClick(title, text, buttonLabel);
    };
    const commonID = `HelpIcon-${title}`;
    return (
        <Tooltip
            title={tooltip}
            placement="bottom-end"
            TransitionComponent={Fade}
            id={`${commonID}-tooltip`}
            data-testid={`${commonID}-tooltip`}
        >
            <IconButton
                onClick={setDrawerContent}
                aria-label={tooltip}
                id={`${commonID}-button`}
                data-testid={`${commonID}-button`}
                size="large">
                <IconComponent className={classes.helpIcon} size={iconSize} titleAccess={tooltip} />
            </IconButton>
        </Tooltip>
    );
};

HelpIcon.propTypes = {
    title: PropTypes.string,
    text: PropTypes.any.isRequired,
    buttonLabel: PropTypes.string,
    tooltip: PropTypes.string,
    onClick: PropTypes.func,
    IconComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.object]),
    iconSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

HelpIcon.defaultProps = {
    tooltip: 'Click for more information',
    IconComponent: HelpOutlineIcon,
};

export default HelpIcon;
