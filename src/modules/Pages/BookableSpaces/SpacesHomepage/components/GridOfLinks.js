import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledGridOfLinks = styled('section')(({ theme }) => ({
    marginTop: 'calc(2rem + 32px)',
    [theme.breakpoints.down('sm')]: {
        marginTop: 'calc(1.5rem + 32px)',
    },
}));

const StyledGrid = styled('div')(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    columnGap: '2rem',
    rowGap: 0,
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: '1fr',
        columnGap: 0,
    },
}));

const StyledListItem = styled('div')(({ theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider || 'rgba(0, 0, 0, 0.12)'}`,
    minHeight: '4rem',
    display: 'flex',
    alignItems: 'stretch',
}));

const linkStyles = ({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: '1rem',
    color: theme.palette.primary.main,
    fontSize: '16px',
    lineHeight: 1.3,
    fontWeight: 500,
    textDecoration: 'none',
    padding: '1rem 0',
    '&:hover, &:focus-visible': {
        textDecoration: 'none',
    },
    '&:focus-visible': {
        outline: `2px solid ${theme.palette.primary.main}`,
        outlineOffset: '2px',
    },
    '& span:first-of-type': {
        display: 'inline-block',
        overflowWrap: 'anywhere',
        textDecoration: 'none',
        transition: 'background-color 200ms ease-out, color 200ms ease-out, text-decoration 200ms ease-out',
    },
    '&:hover span:first-of-type, &:focus-visible span:first-of-type': {
        backgroundColor: theme.palette.primary.main,
        color: '#fff',
        textDecoration: 'underline',
    },
    '& span:last-of-type': {
        fontSize: '2rem',
        lineHeight: 1,
        marginLeft: 'auto',
        transform: 'translateY(-0.04em)',
        fontWeight: 300,
        textDecoration: 'none !important',
        color: 'inherit',
        backgroundColor: 'transparent',
        transition: 'none',
    },
});

const StyledLink = styled(Link)(({ theme }) => linkStyles({ theme }));

const StyledAnchor = styled('a')(({ theme }) => linkStyles({ theme }));

export const GridOfLinks = ({ title, links }) => {
    return (
        <StyledGridOfLinks>
            {title && (
                <Typography
                    component="h2"
                    sx={{
                        margin: 0,
                        marginBottom: '1rem',
                        fontSize: '32px',
                        lineHeight: 1.2,
                        fontWeight: 500,
                        color: '#19191c',
                    }}
                >
                    {title}
                </Typography>
            )}
            <StyledGrid>
                {(links || []).map(link => {
                    const label = link.label || '';
                    const content = (
                        <>
                            <span>{label}</span>
                            <span aria-hidden="true">›</span>
                        </>
                    );

                    return (
                        <StyledListItem key={link.key || label}>
                            {link.href ? (
                                <StyledAnchor href={link.href} target={link.target} rel={link.rel}>
                                    {content}
                                </StyledAnchor>
                            ) : (
                                <StyledLink to={link.to || '#'}>{content}</StyledLink>
                            )}
                        </StyledListItem>
                    );
                })}
            </StyledGrid>
        </StyledGridOfLinks>
    );
};

GridOfLinks.propTypes = {
    title: PropTypes.string,
    links: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string,
            label: PropTypes.string.isRequired,
            to: PropTypes.string,
            href: PropTypes.string,
            target: PropTypes.string,
            rel: PropTypes.string,
        }),
    ),
};

export default GridOfLinks;
