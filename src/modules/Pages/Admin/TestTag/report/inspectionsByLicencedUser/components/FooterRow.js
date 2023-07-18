import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    footerContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    footerText: {
        fontSize: '14px',
        minWidth: 100,
        paddingLeft: 10,
        marginTop: 15,
        fontWeight: 400,
    },
}));

const FooterRow = ({ count, columns, locale }) => {
    const classes = useStyles();
    const headerCellWidths = columns.map(column => column.width);
    const footerCellWidth = headerCellWidths.reduce((sum, width) => sum + width, 0);

    return (
        <div
            className={classes.footerContainer}
            style={{
                width: footerCellWidth,
            }}
        >
            <div
                id="data_table_total-user-inspections"
                data-testid="data_table_total-user-inspections"
                className={classes.footerText}
            >
                {locale.form.totalInspections(count)}
            </div>
        </div>
    );
};

FooterRow.propTypes = {
    count: PropTypes.number,
    columns: PropTypes.array,
    locale: PropTypes.object,
};

export default React.memo(FooterRow);
