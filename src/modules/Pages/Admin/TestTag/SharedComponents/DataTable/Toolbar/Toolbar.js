import React from 'react';
import PropTypes from 'prop-types';
import { GridToolbarContainer } from '@mui/x-data-grid';

const Toolbar = ({ id, children }) => {
    const componentId = `${id}-data-table-toolbar`;
    return (
        <GridToolbarContainer id={componentId} data-testid={componentId}>
            {React.Children.map(children, child => {
                if (!React.isValidElement(child)) return child;
                return React.cloneElement(child, { id: child.props?.id || componentId });
            })}
        </GridToolbarContainer>
    );
};

Toolbar.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node,
};

export default React.memo(Toolbar);
