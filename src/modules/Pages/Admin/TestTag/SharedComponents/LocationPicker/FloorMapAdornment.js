import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import MapIcon from '@mui/icons-material/Map';
import locale from 'modules/Pages/Admin/TestTag/testTag.locale';
import { Tooltip } from '@mui/material';

const FloorMapAdornment = floor => {
    const url = floor?.floor_plan_url?.trim?.();
    if (!url) return null;

    return (
        <InputAdornment position="end">
            <Tooltip title={locale.pages.inspect.form.event.location.floor.floorPlanTooltip}>
                <IconButton
                    component="a"
                    href={url}
                    target="_blank"
                    edge="end"
                    size="small"
                    sx={{
                        '&:hover': {
                            borderRadius: 1,
                        },
                    }}
                >
                    <MapIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </InputAdornment>
    );
};

export default React.memo(FloorMapAdornment);
