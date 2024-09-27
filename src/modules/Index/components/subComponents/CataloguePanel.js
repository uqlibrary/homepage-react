import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { linkToDrupal } from 'helpers/general';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

export const CataloguePanel = ({ account, loans }) => {
    return (
        <StandardCard
            subCard
            noPadding
            fullHeight
            primaryHeader
            standardCardId="catalogue-panel"
            title="My library account"
        >
            {console.log("Loans in the component", loans)}
        </StandardCard>
    );
};

CataloguePanel.propTypes = {
    account: PropTypes.object,
    loans: PropTypes.object
};

export default CataloguePanel;
