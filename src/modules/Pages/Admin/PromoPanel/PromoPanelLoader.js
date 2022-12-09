import ContentLoader from 'react-content-loader';
import { PropTypes } from 'prop-types';
import React from 'React';

const PromoPanelLoader = props => {
    return (
        <ContentLoader
            speed={2}
            uniqueKey="training"
            width={'100%'}
            height={'100%'}
            viewBox="0 0 365 300"
            backgroundColor="#f3f3f3"
            foregroundColor="#e2e2e2"
            {...props}
        >
            <rect x="5%" y="15" rx="3" ry="3" width="50%" height="14" />
            <rect x="5%" y="40" rx="3" ry="3" width="40%" height="10" />
            <rect x="0" y="65" rx="3" ry="3" width="100%" height="1" />

            <rect x="5%" y="80" rx="3" ry="3" width="42%" height="14" />
            <rect x="5%" y="110" rx="3" ry="3" width="45%" height="10" />
            <rect x="0" y="135" rx="3" ry="3" width="100%" height="1" />

            <rect x="5%" y="150" rx="3" ry="3" width="75%" height="14" />
            <rect x="5%" y="175" rx="3" ry="3" width="41%" height="10" />
            <rect x="0" y="200" rx="3" ry="3" width="100%" height="1" />

            <rect x="5%" y="215" rx="3" ry="3" width="52%" height="14" />
            <rect x="5%" y="245" rx="3" ry="3" width="25%" height="10" />
            <rect x="0" y="270" rx="3" ry="3" width="100%" height="1" />

            <rect x="5%" y="285" rx="3" ry="3" width="47%" height="14" />
            <rect x="5%" y="310" rx="3" ry="3" width="42%" height="10" />
            <rect x="0" y="325" rx="3" ry="3" width="100%" height="1" />
        </ContentLoader>
    );
};

PromoPanelLoader.propTypes = {
    trainingEvents: PropTypes.any,
    trainingEventsLoading: PropTypes.bool,
    trainingEventsError: PropTypes.bool,
};

PromoPanelLoader.defaultProps = {};

export default PromoPanelLoader;
