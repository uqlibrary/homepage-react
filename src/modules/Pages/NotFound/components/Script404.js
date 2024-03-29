import React from 'react';
import { PropTypes } from 'prop-types';
import { useScript } from 'hooks';

export const Script404 = ({ account, accountLoading }) => {
    /* istanbul ignore next */
    const requester = !accountLoading && account ? account.id : 'NA';
    useScript({
        fileType: 'text/javascript',
        url: `/404.js?requri=${window.location.pathname}&requester=${requester}`,
    });
    return <></>;
};

Script404.propTypes = {
    account: PropTypes.object,
    accountLoading: PropTypes.bool,
};
