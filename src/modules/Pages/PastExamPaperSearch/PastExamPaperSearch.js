import React from 'react';
import PropTypes from 'prop-types';

import { Grid, TextField } from '@material-ui/core';
// import { makeStyles } from '@material-ui/styles';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { useTitle } from 'hooks';

import locale from './pastExamPaperSearch.locale';

// const useStyles = makeStyles(
//     () => ({
//         searchPanel: {
//             paddingTop: 12,
//             paddingRight: 20,
//             paddingBottom: 0,
//             paddingLeft: 20,
//         },
//         searchPanelInfo: {
//             color: 'red',
//             paddingLeft: '2em',
//         },
//         selectInput: {
//             fontWeight: 300,
//             textOverflow: 'ellipsis !important',
//             overflow: 'hidden !important',
//             whiteSpace: 'nowrap !important',
//             '&::placeholder': {
//                 paddingRight: 50,
//                 textOverflow: 'ellipsis !important',
//                 overflow: 'hidden !important',
//                 whiteSpace: 'nowrap !important',
//             },
//         },
//         searchTitle: {
//             marginBlockStart: '0.5rem',
//             marginBlockEnd: '0.5rem',
//             marginLeft: '1rem',
//         },
//     }),
//     { withTheme: true },
// );
export const PastExamPaperSearch = ({ examSearchListError }) => {
    // const classes = useStyles();
    useTitle(locale.HTMLTitle);

    return (
        <StandardPage>
            <Grid container>
                <Grid item xs={12}>
                    <StandardCard title={locale.pageTitle}>
                        <TextField
                            placeholder={locale.placeholder}
                            error={!!examSearchListError}
                            // InputProps={{
                            //     type: 'search',
                            //     classes: {
                            //         input: classes.selectInput,
                            //     },
                            // }}
                            inputProps={{
                                // 'data-testid': `${elementId}-autocomplete-input-wrapper`,
                                'aria-label': 'search for past exams by course code',
                            }}
                            label={locale.placeholder}
                            fullWidth
                        />
                        <p>
                            (Note: You can enter up to 9 characters, so for example, BIOL3 will bring up all 3rd year
                            biological sciences courses, BIOL2001 will bring up that course only!)
                        </p>
                    </StandardCard>
                </Grid>
            </Grid>
        </StandardPage>
    );
};

PastExamPaperSearch.propTypes = {
    examSearchListError: PropTypes.func,
};

export default PastExamPaperSearch;
