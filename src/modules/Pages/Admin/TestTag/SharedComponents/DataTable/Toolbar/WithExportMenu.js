import React from 'react';
import PropTypes from 'prop-types';
import ExportMenu from './ExportMenu';
import Toolbar from './Toolbar';

const WithExportMenu = ({ id, children }) => (
    <Toolbar id={id}>
        {children}
        <div style={{ flex: 1 }} />
        <ExportMenu id={id} />
    </Toolbar>
);

WithExportMenu.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node,
};

export default React.memo(WithExportMenu);
