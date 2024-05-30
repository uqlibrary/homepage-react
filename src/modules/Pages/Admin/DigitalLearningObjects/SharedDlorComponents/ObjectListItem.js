import React from 'react';

import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import { dlorAdminLink } from '../dlorAdminHelpers';

export const ObjectListItem = ({ object, listParentName = 'team' }) => {
    console.log('ObjectListItem object=', object);
    const navigateToDlorEditPage = uuid => {
        window.location.href = dlorAdminLink(`/edit/${uuid}`);
    };

    return (
        <Grid container key={`${listParentName}-object-${object.object_id}`}>
            <Grid item xs={1} />
            <Grid item xs={9}>
                <div>
                    <Typography component={'h2'} variant={'h6'}>
                        {object?.object_title}
                        {object?.object_status !== 'current' && <strong> {`(${object?.object_status})`}</strong>}
                    </Typography>
                    <Typography variant={'p'}>
                        <p>{object?.object_summary}</p>
                    </Typography>
                </div>
            </Grid>
            <Grid item xs={1}>
                <IconButton
                    data-testid={`dlor-${listParentName}-object-list-item-${object?.object_id}`}
                    onClick={() => navigateToDlorEditPage(object?.object_public_uuid)}
                    disabled={object?.object_status === 'deleted'}
                >
                    <EditIcon />
                </IconButton>
            </Grid>
            <Grid item xs={1} />
        </Grid>
    );
};
