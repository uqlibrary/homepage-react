import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import MapIcon from '@mui/icons-material/Map';
import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { Tooltip } from '@mui/material';

const FloorPlanLink = props => {
    const { url, ...rest } = props;
    if (!url?.trim?.()) return null;

    return (
        <Tooltip title={locale.pages.inspect.form.event.location.floor.floorPlanTooltip}>
            <IconButton
                data-testid="floor-plan-adornment"
                component="a"
                href={url}
                target="_blank"
                edge="end"
                size="small"
                {...rest}
                sx={{
                    ...rest.sx,
                    borderRadius: 1,
                    '&:hover': {
                        borderRadius: 1,
                    },
                }}
            >
                <MapIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    );
};

FloorPlanLink.propTypes = {
    url: PropTypes.string,
};

export default React.memo(FloorPlanLink);
