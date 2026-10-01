import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { alpha } from '@mui/material/styles';

import { STATUS_ALL, STATUS_CONFIRMED, STATUS_RENEWING, STATUS_UNCONFIRMED } from '../membershipAdmin';
import { default as locale } from '../membershipAdmin.locale';

const strings = locale.list.tiles;

// The bucket every application sits in is the one thing an admin triages on, so it leads the page as a row of
// tiles that say how many are in each state and, in the same tap, narrow the list to them.
export const TILES = [
    { key: STATUS_ALL, label: strings.all },
    // The one that carries the work: applications waiting on a decision. It is the reason an admin is here.
    { key: STATUS_UNCONFIRMED, label: strings.unconfirmed, accent: 'primary' },
    { key: STATUS_RENEWING, label: strings.renewing, accent: 'warning' },
    { key: STATUS_CONFIRMED, label: strings.confirmed, accent: 'success' },
];

/**
 * The triage tiles: a count per status that is also the status filter.
 *
 * Exclusive selection, so exactly one bucket is ever active - the list can only show one status at a time, and
 * a screen reader hears the tiles as one control with one pressed button rather than four independent switches.
 * The active tile cannot be switched off, only swapped: clicking the one already chosen returns nothing to
 * change, and the choice stands.
 */
export const MembershipStatusTiles = ({ counts = {}, value, onChange }) => (
    <ToggleButtonGroup
        exclusive
        value={value}
        onChange={(event, next) => next && onChange(next)}
        aria-label={strings.legend}
        data-testid="membership-status-tiles"
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            '& .MuiToggleButtonGroup-grouped': {
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                marginLeft: 0,
            },
        }}
    >
        {TILES.map(tile => (
            <ToggleButton
                key={tile.key}
                value={tile.key}
                aria-label={strings.label(tile.label, counts[tile.key] ?? 0)}
                data-testid={`membership-status-tile-${tile.key}`}
                sx={{
                    flex: '1 1 auto',
                    minWidth: 132,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 0.25,
                    paddingX: 1.75,
                    paddingY: 1.25,
                    textTransform: 'none',
                    '&.Mui-selected': {
                        backgroundColor: theme => alpha(theme.palette[tile.accent ?? 'primary'].main, 0.12),
                        borderColor: theme => `${theme.palette[tile.accent ?? 'primary'].main} !important`,
                        '&:hover': {
                            backgroundColor: theme => alpha(theme.palette[tile.accent ?? 'primary'].main, 0.18),
                        },
                    },
                }}
            >
                <Box
                    component="span"
                    aria-hidden="true"
                    sx={{ fontSize: 26, fontWeight: 700, lineHeight: 1.1, color: 'text.primary' }}
                >
                    {counts[tile.key] ?? 0}
                </Box>
                <Box
                    component="span"
                    aria-hidden="true"
                    sx={{ fontSize: 13, color: 'text.secondary', fontWeight: 500 }}
                >
                    {tile.label}
                </Box>
            </ToggleButton>
        ))}
    </ToggleButtonGroup>
);

MembershipStatusTiles.propTypes = {
    counts: PropTypes.object,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default MembershipStatusTiles;
