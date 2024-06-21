import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const StyledWrapper = styled('div')(() => ({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',

    '& .footerText': {
        fontSize: '14px',
        minWidth: 100,
        paddingLeft: 10,
        marginTop: 15,
        fontWeight: 400,
    },
}));

const FooterRow = ({ count, locale }) => {
    return (
        <StyledWrapper>
            <div
                id="data_table_total-user-inspections"
                data-testid="data_table_total-user-inspections"
                className={'footerText'}
            >
                {locale.form.totalInspections(count)}
            </div>
        </StyledWrapper>
    );
};

FooterRow.propTypes = {
    count: PropTypes.number,
    locale: PropTypes.object,
};

export default React.memo(FooterRow);
