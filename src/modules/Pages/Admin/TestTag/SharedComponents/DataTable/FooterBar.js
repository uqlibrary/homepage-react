import React from 'react';
import PropTypes from 'prop-types';
import { GridFooterContainer } from '@mui/x-data-grid';
import Button from '@material-ui/core/Button';

const FooterBar = ({ id, actionLabel = '', altLabel = '', onAltClick, onActionClick, ...props }) => {
    FooterBar.propTypes = {
        id: PropTypes.string.isRequired,
        actionLabel: PropTypes.string,
        altLabel: PropTypes.string,
        onAltClick: PropTypes.func,
        onActionClick: PropTypes.func,
        cancelButtonProps: PropTypes.object,
        nextButtonProps: PropTypes.object,
    };

    return (
        <GridFooterContainer>
            {!!onAltClick && (
                <Button
                    color="primary"
                    onClick={onAltClick}
                    variant="outlined"
                    id={`${id}-gridFooterClearBtn`}
                    data-testid={`${id}-gridFooterClearBtn`}
                    {...props.cancelButtonProps}
                >
                    {altLabel}
                </Button>
            )}
            {!!onActionClick && (
                <Button
                    color="primary"
                    onClick={onActionClick}
                    variant="contained"
                    id={`${id}-gridFooterNextBtn`}
                    data-testid={`${id}-gridFooterNextBtn`}
                    {...props.nextButtonProps}
                >
                    {actionLabel}
                </Button>
            )}
        </GridFooterContainer>
    );
};

export default React.memo(FooterBar);
