import React from 'react';
import PropTypes from 'prop-types';

// MUI 1
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles(
    theme => ({
        helpIcon: {
            color: theme.palette.secondary.main,
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
                id="help-icon"
                onClick={setDrawerContent}
                aria-label={tooltip}
                id={`${commonID}-button`}
                data-testid={`${commonID}-button`}
            >
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
