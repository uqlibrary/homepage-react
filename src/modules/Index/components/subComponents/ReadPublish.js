import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { linkToDrupal } from 'helpers/general';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

export const ReadPublish = () => {
    return (
        <StandardCard
            subCard
            noPadding
            fullHeight
            primaryHeader
            standardCardId="readpublish-panel"
            title="Read and publish"
        >
            <div className="readpublish-panel-item" style={{ margin: '0 24px 0' }}>
                <p>
                    <a href="https://espace.library.uq.edu.au/journals/search/">Publish in the right journal</a>
                    <br />
                    <span>Find and evaluate the best publishing options using Journal Search.</span>
                    <p>
                        Visit{' '}
                        <Link to={linkToDrupal('/research-and-publish/open-research/read-and-publish-agreements')}>
                            Read and Publish Agreements
                        </Link>{' '}
                        for more information.
                    </p>
                </p>
            </div>
        </StandardCard>
    );
};

ReadPublish.propTypes = {
    account: PropTypes.object,
    journalSearchList: PropTypes.object,
    journalSearchLoading: PropTypes.bool,
    journalSearchError: PropTypes.bool,
};

export default ReadPublish;
