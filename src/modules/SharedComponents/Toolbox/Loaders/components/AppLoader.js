import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const StyledLoader = styled(Grid)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...(((theme.palette || {}).primary || {}).gradient || {}).diagonal,
    width: '100%',
    height: '100%',
    textAlign: 'center !important',

    '& .white': {
        color: ((theme.palette || {}).white || {}).main,
        fontWeight: (theme.typography || {}).fontWeightLight,
    },
    '& .spaceBetween': {
        margin: '16px 0',
    },
    '& .logo': {
        width: 200,
    },
}));

export class AppLoader extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        logoImage: PropTypes.string,
        logoText: PropTypes.string,
    };

    render() {
        const { title, logoImage, logoText } = this.props;
        return (
            <StyledLoader container spacing={0} direction="column" justifyContent="center" alignItems="center">
                <Grid item className={'spaceBetween'}>
                    <CircularProgress
                        size={80}
                        thickness={1}
                        className={'white'}
                        aria-label="Loading Library website"
                    />
                </Grid>
                <Grid item className={'spaceBetween'}>
                    {logoImage && <div className={`${logoImage} logo`} alt={logoText} />}
                </Grid>
                <Grid item className={'spaceBetween'}>
                    <Typography variant={'h6'} className={'white'}>
                        {title}
                    </Typography>
                </Grid>
            </StyledLoader>
        );
    }
}

export default AppLoader;
