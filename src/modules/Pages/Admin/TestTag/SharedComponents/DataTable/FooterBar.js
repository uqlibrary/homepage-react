import React from 'react';
import PropTypes from 'prop-types';
import { GridFooterContainer } from '@mui/x-data-grid';
import Button from '@material-ui/core/Button';

const rootId = 'footer_bar';

const FooterBar = ({
    id,
    actionLabel = '',
    altLabel = '',
    onAltClick,
    onActionClick,
    cancelButtonProps,
    nextButtonProps,
}) => {
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
        <GridFooterContainer id={`${rootId}-${id}`} data-testid={`${rootId}-${id}`}>
            {!!onAltClick && (
                <Button
                    color="primary"
                    onClick={onAltClick}
                    variant="outlined"
                    id={`${rootId}-${id}-alt-button`}
                    data-testid={`${rootId}-${id}-alt-button`}
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
                    id={`${rootId}-${id}-action-button`}
                    data-testid={`${rootId}-${id}-action-button`}
                    {...nextButtonProps}
                >
                    {actionLabel}
                </Button>
            )}
        </GridFooterContainer>
    );
};

export default React.memo(FooterBar);
