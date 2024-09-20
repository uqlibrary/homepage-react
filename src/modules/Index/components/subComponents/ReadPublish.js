import React from 'react';
import PropTypes from 'prop-types';
import { isUQUser } from 'helpers/access';

import { default as locale } from './locale/subComponents.locale';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

export const ReadPublish = ({ account, journalSearchList, journalSearchLoading, journalSearchError }) => {
    // console.log('IN THE READ AND PUBLISH', !!!journalSearchList?.data || '');
    React.useEffect(() => {
        console.log('Load the journals here');
    }, []);

    if (!!!account) return null;
    return (
        <StandardCard
            subCard
            noPadding
            fullHeight
            primaryHeader
            standardCardId="readpublish-homepage-panel"
            title="Read and publish"
        >
            <div className="reference-panel-item" style={{ margin: '0 24px 0' }}>
                <p>
                    <a href="https://espace.library.uq.edu.au/journals/search/">Journal search</a>
                    <br />
                    Find journals for your reference.
                    {!!journalSearchList?.data && journalSearchList?.data?.length > 0 && (
                        <>
                            {journalSearchList?.data?.length > 0 ? (
                                <h4 style={{ marginBottom: 0 }}>
                                    Your favourite items ({journalSearchList?.data?.length})
                                </h4>
                            ) : (
                                <h4>You have no favourite items</h4>
                            )}
                            {journalSearchList?.data && ( // Only render list if data exists
                                <>
                                    <ul style={{ marginTop: 0, marginBottom: 0 }}>
                                        {journalSearchList?.data.slice(0, 5).map((journal, index) => (
                                            <li key={index}>
                                                <a
                                                    href={`https://espace.library.uq.edu.au/journal/view/${journal.jnl_jid}`}
                                                >
                                                    {journal.jnl_title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </>
                    )}
                    <p>
                        Visit{' '}
                        <a href="https://live-library-uq.pantheonsite.io/research-and-publish/open-research/read-and-publish-agreements">
                            Read and Publish Agreements
                        </a>{' '}
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
