import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    cardContent: {
        paddingTop: 0,
    },
});

const Panel = ({ title = '', icon = null, children = null, headerProps = {}, contentProps = {}, ...props } = {}) => {
    const classes = useStyles();
    return (
        <Card className={classes.root} {...props}>
            <CardHeader avatar={icon} title={title} {...headerProps} />
            <CardContent className={classes.cardContent} {...contentProps}>
                {children}
            </CardContent>
        </Card>
    );
};

Panel.propTypes = {
    title: PropTypes.string,
    icon: PropTypes.node,
    headerProps: PropTypes.object,
    contentProps: PropTypes.object,
    children: PropTypes.any,
};

export default React.memo(Panel);
