import React from 'react';
import PropTypes from 'prop-types';
import { isUQUser } from 'helpers/access';

// import Grid from '@mui/material/Grid';
// import Typography from '@mui/material/Typography';

import { default as locale } from './locale/subComponents.locale';

import { fullPath } from 'config/routes';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

export const getPastExamPaperUrlForSubject = (item, pageLocation, includeFullPath = false) => {
    const examPath = `/${item.classnumber.toLowerCase()}`;
    const prefix = `${includeFullPath ? fullPath : ''}/exams/course`;
    const url =
        !!pageLocation.search && pageLocation.search.indexOf('?') === 0
            ? `${prefix}${examPath}${pageLocation.search}` // eg include ?user=s1111111
            : `${prefix}${examPath}`;
    return url;
};

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
            {locale.referencingPanel.items.map(item =>
                !item.uqOnly || (item.uqOnly && isUQUser(account)) ? (
                    <div className="reference-panel-item" style={{ margin: '0 24px 0' }}>
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
