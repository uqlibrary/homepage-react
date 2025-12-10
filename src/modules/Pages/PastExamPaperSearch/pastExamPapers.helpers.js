import React from 'react';
import { styled } from '@mui/material/styles';
import { linkToDrupal } from 'helpers/general';

export const StyledBodyText = styled('p')(() => ({
    marginTop: '1rem',
    marginBottom: '2rem',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.6,
}));

const StyledInstructions = styled('p')(({ theme }) => ({
    marginBottom: 32,
    '& a': {
        color: theme.palette.primary.main,
        textDecoration: 'underline',
        fontWeight: 500,
        '&:hover': {
            color: '#fff',
            backgroundColor: theme.palette.primary.main,
        },
    },
}));

export const UserInstructions = () => {
    return (
        <StyledInstructions id="examResultsDescription">
            <a href={linkToDrupal('/study-and-learning-support/coursework/past-exam-papers')}>
                Read more about past exam papers
            </a>
        </StyledInstructions>
    );
};

export const noResultsFoundBlock = searchTerm => {
    const capitalisedSearchTerm =
        !!searchTerm && searchTerm.trim().length > 0 ? ` "${searchTerm.trim().toUpperCase()}"` : '';
    return (
        <div>
            <StyledBodyText>We have not found any past exams for this course{capitalisedSearchTerm}.</StyledBodyText>
            <UserInstructions />
        </div>
    );
};

export const MESSAGE_EXAMCODE_404 = 'No such exam';
