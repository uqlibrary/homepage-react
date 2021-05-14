import React from 'react';
import PropTypes from 'prop-types';

export const SecureCollection = ({
    actions,
    account,
    secureCollectionCheck,
    secureCollectionCheckLoading,
    secureCollectionCheckError,
}) => {
    console.log('SecureCollection - account = ', account);
    console.log('SecureCollection - secureCollectionCheck = ', secureCollectionCheck);
    console.log('SecureCollection - secureCollectionCheckLoading = ', secureCollectionCheckLoading);
    console.log('SecureCollection - secureCollectionCheckError = ', secureCollectionCheckError);

    const extractPathFromParams = params => {
        const searchParams = new URLSearchParams(params);
        if (!searchParams.has('collection') || !searchParams.has('file')) {
            // force 'No such collection' response from the api
            return 'unknown/unknown';
        }
        return `${searchParams.get('collection')}/${searchParams.get('file')}`;
    };

    React.useEffect(() => {
        !!actions.loadSecureCollectionCheck &&
            actions.loadSecureCollectionCheck(extractPathFromParams(window.location.search));
    }, [actions]);

    return <div className="waiting empty">Secure Collection output will go here</div>;
};

SecureCollection.propTypes = {
    actions: PropTypes.object,
    account: PropTypes.object,
    secureCollectionCheck: PropTypes.object,
    secureCollectionCheckLoading: PropTypes.bool,
    secureCollectionCheckError: PropTypes.any,
};

export default React.memo(SecureCollection);
