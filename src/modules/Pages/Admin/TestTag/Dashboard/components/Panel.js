import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import clsx from 'clsx';

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    cardHeader: {},
    cardContent: {
        paddingTop: 0,
    },
});

const Panel = ({
    title = '',
    className = '',
    icon = null,
    children = null,
    headerProps = {},
    contentProps = {},
    ...props
} = {}) => {
    const classes = useStyles();
    const { className: headerClassName, ...restHeader } = headerProps;
    const { className: contentClassName, ...restContent } = contentProps;
    return (
        <Card className={clsx([classes.root, className ?? ''])} {...props}>
            <CardHeader
                className={clsx([classes.cardHeader, headerClassName ?? ''])}
                avatar={icon}
                title={title}
                {...restHeader}
            />
            <CardContent className={clsx([classes.cardContent, contentClassName ?? ''])} {...restContent}>
                {children}
            </CardContent>
        </Card>
    );
};

Panel.propTypes = {
    title: PropTypes.string,
    className: PropTypes.string,
    icon: PropTypes.node,
    headerProps: PropTypes.object,
    contentProps: PropTypes.object,
    children: PropTypes.any,
};

export default React.memo(Panel);
