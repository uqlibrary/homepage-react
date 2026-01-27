import React from 'react';
import PropTypes from 'prop-types';
import ExportMenu from './ExportMenu';
import Toolbar from './Toolbar';

// eslint-disable-next-line react/prop-types
const WithExportMenu = ({ id, children }) => (
    <Toolbar id={id}>
        {children}
        <div style={{ flex: 1 }} />
        <ExportMenu />
    </Toolbar>
);

WithExportMenu.propTypes = {
    id: PropTypes.string.isRequired,
};

export default React.memo(WithExportMenu);
