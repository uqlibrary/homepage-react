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
            <ul>
                <li><a href="https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=loans&lang=en_US">Your library loans ({`${loans?.total_loans_count}`})</a></li>
                <li><a href="https://search.library.uq.edu.au/primo-explore/account?vid=61UQ&section=requests&lang=en_US">Your library requests ({`${loans?.total_holds_count}`})</a></li>
                <li><a href="https://search.library.uq.edu.au/primo-explore/favorites?vid=61UQ&lang=en_US&section=search_history">Your library search history</a></li>
                <li><a href="https://search.library.uq.edu.au/primo-explore/favorites?vid=61UQ&lang=en_US&section=queries">Your library saved searches</a></li>
                <li><a href="https://search.library.uq.edu.au/primo-explore/favorites?vid=61UQ&lang=en_US&section=items">Your library saved items</a></li>
            </ul>
        </StandardCard>
    );
};

CataloguePanel.propTypes = {
    account: PropTypes.object,
    loans: PropTypes.object
};

export default CataloguePanel;
