import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import MapIcon from '@mui/icons-material/Map';
import locale from 'modules/Pages/Admin/TestTag/testTag.locale';

const FloorMapAdornment = floor => {
    const url = floor?.floor_plan_url?.trim?.();
    if (!url) return null;

    return (
        <InputAdornment position="end">
            <IconButton
                component="a"
                href={url}
                title={locale.pages.inspect.form.event.location.floor.floorPlanButtonTitle}
                target="_blank"
                edge="end"
                size="small"
            >
                <MapIcon fontSize="small" />
            </IconButton>
        </InputAdornment>
    );
};

export default React.memo(FloorMapAdornment);
