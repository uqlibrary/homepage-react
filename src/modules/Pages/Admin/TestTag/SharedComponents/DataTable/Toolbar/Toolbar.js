import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { GridToolbarContainer } from '@mui/x-data-grid';
import _ from 'lodash';

const Toolbar = ({ id, children }) => {
    const componentId = `add_toolbar-${id}`;
    return (
        <GridToolbarContainer id={componentId} data-testid={componentId}>
            {React.Children.map(children, child => {
                if (!React.isValidElement(child)) return child;
                return React.cloneElement(child, { id: componentId });
            })}
        </GridToolbarContainer>
    );
};

Toolbar.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node,
};

export default React.memo(Toolbar);
