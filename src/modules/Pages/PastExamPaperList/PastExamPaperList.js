import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { useTitle } from 'hooks';

import { Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { MESSAGE_EXAMCODE_404, noResultsFoundBlock } from 'modules/Pages/PastExamPaperSearch/pastExamPapers.helpers';
import { styled } from '@mui/material/styles';
import { breadcrumbs } from 'config/routes';
import { linkToDrupal } from 'helpers/general';

const colourBlack = '#19151c';
const colourPaneBackground = '#f3f3f4';

const StyledStandardCard = styled(StandardCard)(() => ({
    border: 'none',
}));
const StyledH3Typography = styled(Typography)(() => ({
    fontSize: '1rem',
    fontWeight: 500,
    color: colourBlack,
}));
const StyledBodyText = styled('p')(() => ({
    marginTop: '1rem',
    marginBottom: '2rem',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
}));
const StyledExplanation = styled('p')(({ theme }) => ({
    marginBottom: 32,
    '& a': {
        color: theme.palette.primary.light,
        textDecoration: 'underline',
        fontWeight: 500,
        '&:hover': {
            color: '#fff',
            backgroundColor: theme.palette.primary.light,
        },
    },
}));
const StyledTableLeftCell = styled(TableCell)(() => ({
    backgroundColor: colourPaneBackground,
    left: 0,
    position: 'sticky',
    verticalAlign: 'top',
}));

const StyledTableCell = styled(TableCell)(() => ({
    textAlign: 'center',
    verticalAlign: 'top',
    '& .secondaryExamDetail': {
        marginTop: '1em',
    },
}));

const StyledSimpleViewWrapper = styled('div')(() => ({
    marginTop: '1rem',
    '& .bodyCell': {
        verticalAlign: 'top',
    },
    '& .zebra': {
        /* stripe alternate rows on simple view */
        backgroundColor: colourPaneBackground,
        paddingTop: '0.5rem',
        paddingBottom: '1rem',
        marginBottom: '1rem',
        marginTop: '1rem',
    },
    '& .plain': {
        marginTop: '1rem',
    },
}));

export const PastExamPaperList = ({ actions, examSearchListError, examSearchList, examSearchListLoading }) => {
    const { courseHint } = useParams();
    const [originalExamPaperList, setOriginalExamPaperList] = useState([]);
    const [sampleExamPaperList, setSampleExamPaperList] = useState([]);
    const listTitle =
        !!examSearchList && !!examSearchList.minYear && !!examSearchList.maxYear && !!courseHint
            ? `Past Exam Papers from ${examSearchList.minYear} to ${
                  examSearchList.maxYear
              } for "${courseHint.toUpperCase()}"`
            : /* istanbul ignore next */ 'Past Exam Papers by Subject';

    useTitle(`${listTitle} - Library - The University of Queensland`);

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.exampapers.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.exampapers.pathname);
    }, []);

    function selectPapersByDisplayType(data, displayType) {
        const result = { ...data };

        if (result.papers && Array.isArray(result.papers)) {
            result.papers = result.papers
                .map(courseGroup => {
                    return courseGroup.filter(examGroup => {
                        // children are always arrays atm, but provide for the alternative
                        /* istanbul ignore else */
                        if (Array.isArray(examGroup)) {
                            const hasFile = examGroup.some(exam => exam.paperUrl && exam.paperUrl.trim().length > 0);
                            if (!hasFile) {
                                return false;
                            }

                            const hasSample = examGroup.some(
                                exam => exam.examType && exam.examType.toUpperCase() === 'SAMPLE',
                            );
                            return displayType === 'sample' ? hasSample : !hasSample;
                        } else {
                            const hasFile = examGroup.paperUrl && examGroup.paperUrl.trim().length > 0;
                            if (!hasFile) {
                                return false;
                            }

                            const hasSample = examGroup.examType && examGroup.examType.toUpperCase() === 'SAMPLE';
                            return displayType === 'sample' ? hasSample : !hasSample;
                        }
                    });
                })
                .filter(courseGroup => courseGroup.length > 0); // Remove empty course groups
        }

        return result;
    }
    useEffect(() => {
        if (examSearchListLoading === false) {
            setOriginalExamPaperList(selectPapersByDisplayType(examSearchList, 'original'));
            setSampleExamPaperList(selectPapersByDisplayType(examSearchList, 'sample'));
        }
    }, [examSearchList, examSearchListLoading]);

    useEffect(() => {
        /* istanbul ignore else */
        if (!!courseHint) {
            actions.loadExamSearch(courseHint);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseHint]);

    function getCourseCode(courseDetails) {
        const course = JSON.parse(JSON.stringify(courseDetails));
        const firstCourse = course.find((paper, pp) => pp === 0);
        const firstSemester = !!firstCourse && firstCourse.pop();
        return !!firstSemester && !!firstSemester.courseCode
            ? firstSemester.courseCode
            : /* istanbul ignore next */ null;
    }

    // don't display the input unless it is shown to be valid
    const displayedCourseHint = examSearchListError === false && courseHint.length > 0 ? `"${courseHint}"` : '';

    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.down('sm')) || false;

    const is404Error = !!examSearchListError && examSearchListError === MESSAGE_EXAMCODE_404;
    const isNon404Error = !!examSearchListError && examSearchListError !== MESSAGE_EXAMCODE_404;

    // eslint-disable-next-line react/prop-types
    const SimpleLayout = ({ examList, showMobileView, showFullDetails }) => {
        let formatType = showMobileView ? 'mobile' : 'desktop';
        formatType = showFullDetails ? `${formatType}-original` : `${formatType}-sample`;
        return (
            <StyledSimpleViewWrapper>
                {examList?.papers?.map((course, cc) => {
                    return (
                        <div
                            key={`exampaper-${formatType}-row-${cc}`}
                            className={cc % 2 ? 'zebra' : 'plain'}
                            data-testid={`exampaper-${formatType}-line`}
                        >
                            <StyledH3Typography
                                variant="h3"
                                style={{ marginTop: 6, marginBottom: '0.5rem', paddingLeft: 6 }}
                            >
                                {getCourseCode(course)}
                            </StyledH3Typography>
                            {course.map((semester, ss) => {
                                return (
                                    <div
                                        className={'bodyCell'}
                                        style={{
                                            textAlign: showMobileView ? 'center' : 'left',
                                            marginLeft: showMobileView ? 'auto' : '3rem',
                                        }}
                                        key={`exampaper-${formatType}-${ss}`}
                                    >
                                        {semester.map((paper, pp) => {
                                            /* istanbul ignore next */
                                            const examTypeSansSample = showFullDetails
                                                ? paper.examType
                                                : paper.examType?.replace(/\b(sample)\b/, () => '');
                                            let linklabel = `${paper.courseCode} ${paper.examPeriod} ${paper.examYear}`;

                                            linklabel +=
                                                !!paper.examType && !!showFullDetails
                                                    ? /* istanbul ignore next */ ` (${examTypeSansSample})`
                                                    : '';
                                            linklabel += !!paper.examNote ? ` ${paper.examNote}` : '';
                                            linklabel +=
                                                !paper.examNote && semester.length > 1 ? ` Paper ${pp + 1}` : '';
                                            return (
                                                <div key={`exampaper-${formatType}-detail-${pp}`}>
                                                    {!!paper.paperUrl && (
                                                        <div
                                                            style={{
                                                                marginTop: showMobileView ? 20 : 0,
                                                                marginBottom: showMobileView ? 20 : 8,
                                                            }}
                                                        >
                                                            <a
                                                                href={paper.paperUrl}
                                                                data-testid={`exampaper-${formatType}-link-${cc}-${ss}-${pp}`}
                                                                target="_blank"
                                                            >
                                                                {linklabel}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </StyledSimpleViewWrapper>
        );
    };

    const DesktopTableHeader = ({ examList }) => {
        return (
            <TableRow data-testid="exampaper-desktop-originals-table-header">
                <TableCell
                    component="th"
                    scope="col"
                    sx={{ position: 'sticky', left: 0, zIndex: 10 }}
                    style={{ backgroundColor: colourPaneBackground }}
                >
                    {' '}
                </TableCell>
                {examList?.periods?.map((semester, ss) => {
                    const parts = semester.split(' || ');
                    return (
                        <TableCell
                            component="th"
                            sx={{ textAlign: 'center' }}
                            key={`exampaper-desktop-originals-headercell-${ss}`}
                            style={{ fontSize: 16, fontWeight: 500, backgroundColor: colourPaneBackground }}
                            scope="col"
                        >
                            {parts.map((part, ii) => (
                                <div key={`exampaper-desktop-originals-headercell-part-${ii}`}>{part}</div>
                            ))}
                        </TableCell>
                    );
                })}
            </TableRow>
        );
    };

    // eslint-disable-next-line react/prop-types
    const DesktopTableCells = ({ cc, course }) => {
        return (
            <>
                <StyledTableLeftCell component="th" scope="row">
                    <StyledH3Typography variant="h3">{getCourseCode(course)}</StyledH3Typography>
                </StyledTableLeftCell>
                {course.map((semester, ss) => {
                    return (
                        <StyledTableCell key={`exampaper-desktop-originals-${ss}`}>
                            {semester.map((paper, pp) => {
                                return (
                                    <div
                                        key={`exampaper-desktop-originals-detail-${pp}`}
                                        className={pp > 0 ? 'secondaryExamDetail' : null}
                                    >
                                        {!!paper.paperUrl ? (
                                            <a
                                                data-testid={`exampaper-desktop-originals-link-${cc}-${ss}-${pp}`}
                                                href={paper.paperUrl}
                                                target="_blank"
                                            >
                                                {!!paper.examType && (
                                                    <span>
                                                        {paper.examType}
                                                        <br />
                                                    </span>
                                                )}
                                                <span>{paper.courseCode}</span>
                                                {!!paper.examNote && (
                                                    <span>
                                                        <br />
                                                        {paper.examNote}
                                                    </span>
                                                )}
                                            </a>
                                        ) : /* istanbul ignore next */ null}
                                    </div>
                                );
                            })}
                        </StyledTableCell>
                    );
                })}
            </>
        );
    };

    // eslint-disable-next-line react/prop-types
    const DesktopLayout = ({ examList }) => {
        return (
            <TableContainer
                sx={{ maxHeight: 600, marginTop: '1rem' }}
                component={Paper}
                data-testid="original-papers-table"
            >
                <Table stickyHeader aria-label={listTitle} aria-describedby="examResultsDescription">
                    <TableHead>
                        <DesktopTableHeader examList={examList} />
                    </TableHead>
                    <tbody data-testid="exampaper-desktop-originals-table-body">
                        {examList?.papers?.map((course, cc) => {
                            return (
                                <TableRow key={`exampaper-desktop-originals-row-${cc}`}>
                                    <DesktopTableCells cc={cc} course={course} />
                                </TableRow>
                            );
                        })}
                    </tbody>
                </Table>
            </TableContainer>
        );
    };

    const UserInstructions = () => {
        return (
            <StyledExplanation id="examResultsDescription">
                <a href={linkToDrupal('/study-and-learning-support/coursework/past-exam-papers')}>
                    Read more about past exam papers
                </a>
            </StyledExplanation>
        );
    };

    return (
        <StandardPage title={listTitle}>
            <UserInstructions />
            {(() => {
                /* istanbul ignore else */
                if (examSearchListLoading !== false) {
                    return (
                        <StyledStandardCard noHeader>
                            <Grid container>
                                <Grid item xs={'auto'}>
                                    <CircularProgress
                                        color="primary"
                                        size={20}
                                        id="loading-suggestions"
                                        aria-label="Loading Past exam papers"
                                    />
                                </Grid>
                            </Grid>
                        </StyledStandardCard>
                    );
                } else if (!!isNon404Error) {
                    return (
                        <StyledStandardCard noHeader>
                            <Grid container spacing={2} className={'searchPanel'} data-testid={'past-exam-paper-error'}>
                                <Grid item xs={12} sm={12} md className={'searchPanelInfo'}>
                                    <span>
                                        Past exam paper search is currently unavailable - please try again later
                                    </span>
                                </Grid>
                            </Grid>
                        </StyledStandardCard>
                    );
                } else if (
                    examSearchListLoading === false &&
                    !isNon404Error &&
                    ((!!examSearchList && !!examSearchList.papers && examSearchList.papers.length === 0) ||
                        !examSearchList ||
                        !examSearchList.papers ||
                        !!is404Error)
                ) {
                    return (
                        <StyledStandardCard noHeader>
                            <Grid container>
                                <Grid item xs={12} data-testid="past-exam-paper-missing">
                                    {noResultsFoundBlock(displayedCourseHint)}
                                </Grid>
                            </Grid>
                        </StyledStandardCard>
                    );
                    /* istanbul ignore else */
                } else if (
                    examSearchListLoading === false &&
                    !examSearchListError &&
                    !!examSearchList?.papers &&
                    !!examSearchList?.periods &&
                    !!examSearchList.papers.length > 0
                ) {
                    console.log('originalExamPaperList?.papers?.length=', originalExamPaperList?.papers?.length);
                    return (
                        <>
                            {sampleExamPaperList?.papers?.length > 0 && (
                                <StyledStandardCard noHeader style={{ margin: '-16px -16px 4.5rem -16px' }}>
                                    <Typography
                                        variant="h2"
                                        style={{ fontSize: 32, fontWeight: 500, color: colourBlack }}
                                        data-testid="sample-papers-heading"
                                    >
                                        Sample past exam papers
                                    </Typography>
                                    <StyledBodyText style={{ marginBottom: 0 }}>
                                        Note: Multiple sample papers may contain the same content.
                                    </StyledBodyText>
                                    <SimpleLayout
                                        examList={sampleExamPaperList}
                                        showMobileView={isMobileView}
                                        showFullDetails={false}
                                    />
                                </StyledStandardCard>
                            )}
                            <StyledStandardCard noHeader style={{ margin: '-32px -16px 80px -16px' }}>
                                <Typography
                                    variant="h2"
                                    style={{ fontSize: 32, fontWeight: 500, color: colourBlack }}
                                    data-testid="exampapers-original-heading"
                                >
                                    Original past exam papers
                                </Typography>
                                {originalExamPaperList?.papers?.length === 0 && (
                                    <StyledBodyText data-testid="no-original-papers-provided">
                                        No original papers provided.
                                    </StyledBodyText>
                                )}
                                {originalExamPaperList?.papers?.length === 1 && (
                                    <SimpleLayout
                                        examList={originalExamPaperList}
                                        showMobileView={isMobileView}
                                        showFullDetails
                                    />
                                )}
                                {originalExamPaperList?.papers?.length > 1 && (
                                    <>
                                        {isMobileView ? (
                                            <SimpleLayout
                                                examList={originalExamPaperList}
                                                showMobileView
                                                showFullDetails
                                            />
                                        ) : (
                                            <DesktopLayout examList={originalExamPaperList} />
                                        )}
                                    </>
                                )}
                            </StyledStandardCard>
                        </>
                    );
                } else {
                    return null;
                }
            })()}
        </StandardPage>
    );
};

PastExamPaperList.propTypes = {
    actions: PropTypes.any,
    examSearchListError: PropTypes.any,
    examSearchList: PropTypes.any,
    examSearchListLoading: PropTypes.bool,
};

export default PastExamPaperList;
