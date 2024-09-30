import React from 'react';
import PropTypes from 'prop-types';
import { isUQUser } from 'helpers/access';

import { default as locale } from './locale/subComponents.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

export const ReferencingPanel = ({ account }) => {
    return (
        <StandardCard
            subCard
            noPadding
            fullHeight
            primaryHeader
            standardCardId="referencing-homepage-panel"
            title="Referencing"
        >
            {locale.referencingPanel.items.map((item, index) =>
                !item.uqOnly || (item.uqOnly && isUQUser(account)) ? (
                    <div key={index} className="reference-panel-item" style={{ margin: '0 24px 0' }}>
                        <p>
                            <a href={`${item.url}`}>{`${item.title}`}</a>
                            <br />
                            {`${item.description}`}
                        </p>
                    </div>
                ) : null,
            )}
        </StandardCard>
    );
};

ReferencingPanel.propTypes = {
    account: PropTypes.object,
};

export default ReferencingPanel;
