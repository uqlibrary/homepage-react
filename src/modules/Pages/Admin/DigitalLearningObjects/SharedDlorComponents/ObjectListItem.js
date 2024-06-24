import React from 'react';

import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { getDlorViewPageUrl } from 'modules/Pages/DigitalLearningObjects/dlorHelpers';
import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import { fullPath } from 'config/routes';

export const ObjectListItem = ({ object, listParentName = 'team' }) => {
    const navigateToDlorEditPage = uuid => {
        window.location.href = dlorAdminLink(`/edit/${uuid}`);
    };

    return (
        <Grid container key={`${listParentName}-object-${object.object_id}`}>
            <Grid item xs={1} />
            <Grid item xs={8}>
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
                <a
                    data-testid={`dlor-${listParentName}-object-list-item-view-${object?.object_id}`}
                    href={getDlorViewPageUrl(object?.object_public_uuid)}
                >
                    <VisibilityIcon style={{ color: 'black', marginTop: 8 }} />
                </a>
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
