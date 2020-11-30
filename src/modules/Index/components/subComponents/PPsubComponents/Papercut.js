import { PPlocale } from '../PersonalisedPanel.locale';
import { Location } from '../../../../SharedComponents/Location';


export const PaperCut = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleNagivationToUrl = url => {
        if (!!url) {
            window.location.href = url;
        }
        handleClose();
    };
    const topUpUrl = value =>
        `https://payments.uq.edu.au/OneStopWeb/aspx/TranAdd.aspx?TRAN-TYPE=W361&username=${account.id}&unitamountinctax=${value}&email=${printBalance.email}`;
    return (
        <Grid item xs={12} className={classes.menuItem}>
            <Tooltip
                id={id('tooltip')}
                title={'Click to manage your print balance'}
                placement="left"
                TransitionProps={{ timeout: 300 }}
            >
                <MenuItem onClick={handleClick}>
                    <Grid container spacing={0}>
                        <Grid item xs className={classes.menuItemLabel}>
                            {PPlocale.items.papercut.label.replace('[balance]', printBalance.balance || '0.00')}
                        </Grid>
                        <Grid item xs="auto">
                            <PrintIcon className={classes.icon} />
                        </Grid>
                    </Grid>
                </MenuItem>
            </Tooltip>
            <Menu
                id="pp-papercut-menu"
                data-testid="pp-papercut-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onBlur={handleClose}
            >
                <MenuItem disabled>Manage your PaperCut account</MenuItem>
                <MenuItem onClick={() => handleNagivationToUrl('https://lib-print.library.uq.edu.au:9192/user')}>
                    Log in and manage your print balance
                </MenuItem>
                <MenuItem onClick={() => handleNagivationToUrl(topUpUrl(5))}>
                    Top up your print balance - $5
                </MenuItem>
                <MenuItem onClick={() => handleNagivationToUrl(topUpUrl(10))}>
                    Top up your print balance - $10
                </MenuItem>
                <MenuItem onClick={() => handleNagivationToUrl(topUpUrl(20))}>
                    Top up your print balance - $20
                </MenuItem>
            </Menu>
        </Grid>
    );
};
return (
    <div className={`${classes.flexWrapper} ${!!isNextToSpotlights && classes.isNextToSpotlights}`}>
        <div className={classes.flexHeader}>
            {/* Greeting */}
            <Typography variant={'h5'} component={'h5'} color={'primary'} className={classes.greeting}>
                {greeting()} {account.firstName || ''}
            </Typography>
        </div>
        <div className={classes.flexContent}>
            <Grid container spacing={0} style={{ marginLeft: 16 }}>
                {/* Username */}
                <Grid item xs="auto">
                    <Tooltip
                        id={id('tooltip')}
                        title={`Your UQ username is ${(account && account.id) || 'unavailable'}`}
                        placement="left"
                        TransitionProps={{ timeout: 300 }}
                    >
                        <Typography component={'span'} color={'secondary'} style={{ fontSize: 14 }}>
                            <AccountBoxIcon className={classes.uqidIcon} fontSize={'small'} />
                            {(account && account.id) || ''}
                        </Typography>
                    </Tooltip>
                </Grid>
                {/* Location */}
                <Grid item xs="auto">
                    <Location />
                </Grid>
            </Grid>
        </div>
        <div className={classes.flexFooter}>
            {/* Content */}
            <Grid container spacing={0} style={{ marginLeft: 16 }}>
                {!!printBalance && printBalance.balance && <PaperCut />}
            </Grid>
        </div>
    </div>
);
