import React from 'react';
import PropTypes from 'prop-types';
import { useCookies } from 'react-cookie';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { COOKIE_INCLUDE_ALL_TEAMS } from '../config';

const rootId = 'all-teams-switch';
const SwitchIncludeAllTeams = ({
    locale,
    onChange,
    defaultValue = false,
    withCookie = true,
    cookieName = COOKIE_INCLUDE_ALL_TEAMS,
    fireOnChangeOnMount = true,
    id = '',
    ...props
}) => {
    const componentIdLower = `${id.toLocaleLowerCase()}-${rootId}`;
    const [cookies, setCookie] = useCookies();
    const init = () => {
        return withCookie ? Boolean(cookies[cookieName]) : defaultValue;
    };
    const [checked, setChecked] = React.useState(init);

    const _onChange = event => {
        const newValue = event.target.checked;
        if (withCookie) {
            setCookie(cookieName, newValue, { path: '/' });
        }
        setChecked(newValue);
        onChange?.(newValue);
    };

    React.useEffect(() => {
        fireOnChangeOnMount && _onChange({ target: { checked: init() } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <FormControlLabel
            control={
                <Switch
                    checked={checked}
                    onChange={_onChange}
                    name="includeAllTeams"
                    color="primary"
                    id={componentIdLower}
                    {...props}
                    inputProps={{ 'data-testid': componentIdLower }}
                />
            }
            label={locale.includeAllTeams}
        />
    );
};

SwitchIncludeAllTeams.propTypes = {
    id: PropTypes.string,
    defaultValue: PropTypes.bool,
    onChange: PropTypes.func,
    withCookie: PropTypes.bool,
    fireOnChangeOnMount: PropTypes.bool,
    cookieName: PropTypes.string,
    locale: PropTypes.object.isRequired,
};

export default React.memo(SwitchIncludeAllTeams);
