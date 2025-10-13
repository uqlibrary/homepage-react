import * as actions from './actionTypes';

export const checkExpireSession = (dispatch, error) => {
    const triggerLogoutStatus = [401];
    if (!!error?.status && triggerLogoutStatus.includes(error.status)) {
        // They are no longer allowed. Log them out
        dispatch({ type: actions.CURRENT_ACCOUNT_ANONYMOUS });
    }
};
