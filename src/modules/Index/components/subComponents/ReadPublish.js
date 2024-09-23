import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { linkToDrupal } from 'helpers/general';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

export const ReadPublish = ({ journalSearchList, journalSearchError }) => {
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
                    <a href="https://espace.library.uq.edu.au/journals/search/">Journal search</a>
                    <br />
                    Find journals for your reference.
                    {!!journalSearchList?.data && (
                        <>
                            <h4 data-testid="rp-yourfavourite-count">
                                {journalSearchList?.data.length > 0
                                    ? `Your favourite items (${journalSearchList?.data.length})`
                                    : 'You have no favourite items'}
                            </h4>
                            {journalSearchList?.data.length > 0 && (
                                <ul style={{ marginTop: 0, marginBottom: 0 }} data-testid="rp-journalsearch-items">
                                    {journalSearchList?.data.slice(0, 5).map((journal, index) => (
                                        <li key={index} data-testid={`rp-journalsearch-item-${index}`}>
                                            <Link
                                                to={`https://espace.library.uq.edu.au/journal/view/${journal.jnl_jid}`}
                                            >
                                                {journal.jnl_title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                    {!!journalSearchError && (
                        <p>
                            We cannot display your favourite journal searches at this time. Visit{' '}
                            <a href="https://espace.library.uq.edu.au/journals/search/">Journal search</a> to find your
                            favourite searches
                        </p>
                    )}
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
