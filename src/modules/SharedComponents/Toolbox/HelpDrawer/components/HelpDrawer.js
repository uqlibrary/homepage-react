import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import withStyles from '@mui/styles/withStyles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

/* istanbul ignore next */
const styles = theme => ({
    paper: {
        width: 320,
        paddingTop: 40,
        paddingRight: 40,
        paddingLeft: 40,
        paddingBottom: 0,
        maxHeight: '100%',
    },
    title: {
        color: theme.palette.primary.main,
    },
    button: {
        float: 'right',
        marginBottom: 60,
    },
});

export class HelpDrawer extends Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        text: PropTypes.any.isRequired,
        hide: PropTypes.func.isRequired,
        buttonLabel: PropTypes.string,
        classes: PropTypes.object,
    };
    static defaultProps = {
        buttonLabel: 'CLOSE',
    };

    render() {
        const { classes, title, text, buttonLabel, open, hide } = this.props;
        let indexedText = null;
        if (this.props.text && this.props.text.props && this.props.text.props.children) {
            indexedText = React.Children.map(this.props.text.props.children, (child, index) => {
                if (child.type) {
                    return React.cloneElement(child, { key: index });
                } else {
                    return child;
                }
            });
        }
        return (
            <Drawer classes={{ paper: classes.paper }} open={open} anchor="right" onClose={hide}>
                <Grid container spacing={5} id="help-drawer">
                    <Grid item xs={12}>
                        <Typography
                            key={'title'}
                            component={'span'}
                            variant={'h6'}
                            className={classes.title}
                            id="help-drawer-title"
                        >
                            {title}
                        </Typography>
                        <Typography
                            key={'text'}
                            component={'span'}
                            variant="body2"
                            id={`help-drawer-text-${title.replace(/\s/g, '')}`}
                        >
                            {indexedText || text}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} id="help-drawer-button">
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            children={buttonLabel}
                            onClick={hide}
                        />
                    </Grid>
                </Grid>
            </Drawer>
        );
    }
}

export default withStyles(styles, { withTheme: true })(HelpDrawer);
