import React from 'react';
import PropTypes from 'prop-types';
import { GridFooterContainer } from '@mui/x-data-grid';
import Button from '@mui/material/Button';

const rootId = 'footer_bar';

const FooterBar = ({
    id,
    actionLabel,
    altLabel,
    onAltClick,
    onActionClick,
    cancelButtonProps,
    nextButtonProps,
    ...props
}) => {
    const componentId = `${rootId}-${id}`;
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
        <GridFooterContainer id={`${componentId}`} data-testid={`${componentId}`} {...props}>
            {!!onAltClick && (
                <Button
                    color="primary"
                    onClick={onAltClick}
                    variant="outlined"
                    id={`${componentId}-alt-button`}
                    data-testid={`${componentId}-alt-button`}
                    {...cancelButtonProps}
                >
                    {altLabel}
                </Button>
            )}
            {!!onActionClick && (
                <Button
                    color="primary"
                    onClick={onActionClick}
                    variant="contained"
                    id={`${componentId}-action-button`}
                    data-testid={`${componentId}-action-button`}
                    {...nextButtonProps}
                >
                    {actionLabel}
                </Button>
            )}
        </GridFooterContainer>
    );
};
FooterBar.defaultProps = {
    actionLabel: '',
    altLabel: '',
};
export default React.memo(FooterBar);
