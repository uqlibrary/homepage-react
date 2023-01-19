import { useScript } from 'hooks';

export const Script404 = ({ account, accountLoading }) => {
    const requester = !accountLoading && account ? /* istanbul ignore next */ account.id : 'NA';
    useScript({
        type: 'text/javascript',
        src: `/404.js?requri=${window.location.pathname}&requester=${requester}`,
    });
};
