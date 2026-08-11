import React from 'react';
import PropTypes from 'prop-types';

const TrailTabContent = ({ tab, page, openDrawer }) => {
    const PageComponent = page;

    return <PageComponent tab={tab} openDrawer={openDrawer} />;
};

TrailTabContent.propTypes = {
    tab: PropTypes.shape({
        label: PropTypes.string.isRequired,
        subtitle: PropTypes.string,
    }).isRequired,
    page: PropTypes.elementType.isRequired,
    openDrawer: PropTypes.func.isRequired,
};

export default TrailTabContent;
