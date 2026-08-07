import React from 'react';
import PropTypes from 'prop-types';

const TrailTabContent = ({ tab, page }) => {
    const PageComponent = page;

    return <PageComponent tab={tab} />;
};

TrailTabContent.propTypes = {
    tab: PropTypes.shape({
        label: PropTypes.string.isRequired,
        subtitle: PropTypes.string.isRequired,
    }).isRequired,
    page: PropTypes.elementType.isRequired,
};

export default TrailTabContent;
