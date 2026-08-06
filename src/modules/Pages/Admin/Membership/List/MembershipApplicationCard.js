import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { alpha } from '@mui/material/styles';
import { visuallyHidden } from '@mui/utils';
import moment from 'moment';

import { default as locale } from '../membershipAdmin.locale';

const strings = locale.list.row;

/**
 * The applicant's full name, in the order it is written on a card and in an aria-label.
 */
export const fullName = membership =>
    [membership?.title, membership?.first_name, membership?.sn].filter(Boolean).join(' ');

// The two statuses that mean the application already exists as a library account.
export const ISSUED_STATUSES = ['confirmed', 'renewing'];

// The backend reports a confirmation it has begun but not finished as step 1 or 2. Acting on the application
// again is unsafe until that settles.
export const IN_PROGRESS_STEPS = [1, 2, '1', '2'];

export const isIssued = membership => ISSUED_STATUSES.includes(membership?.status);
export const isConfirmationInProgress = membership => IN_PROGRESS_STEPS.includes(membership?.confirm_step);

// Confirming an applicant who has been confirmed before is a re-confirmation, and reads as one.
export const confirmButtonText = membership => (membership?.confirmed_on ? strings.reconfirm : strings.confirm);

export const statusText = status => (!status ? '' : status.charAt(0).toUpperCase() + status.slice(1));

// Colour carries the same meaning the word does, so it is never the only thing saying it (WCAG 1.4.1).
export const STATUS_COLOURS = { confirmed: 'success', renewing: 'warning' };
export const statusColour = status => STATUS_COLOURS[status] ?? 'default';

// Every date this API emits is day-first: the Membership model sets `$dateFormat = 'd-m-Y'` and serialises
// through it, and submitted_on is written as `date('d-m-Y H:i:s')`. Handing those to a bare moment() is not
// merely imprecise - it reads 04-05-1990 as 5 April, because moment falls back to the platform parser and that
// one is month-first. A date of birth is what an admin checks an applicant against, so it has to be the date
// the applicant gave.
export const API_DATE_FORMAT = 'D-M-YYYY';
export const API_DATETIME_FORMAT = 'D-M-YYYY H:mm:ss';

// Better to show what arrived than "Invalid date": the raw value is at least a clue to what went wrong.
const format = (value, inputFormat, outputFormat) => {
    const parsed = moment(value, inputFormat);
    return parsed.isValid() ? parsed.format(outputFormat) : value;
};

// A birth date has no time of day. Formatting it as one printed a meaningless "12:00am" after every one.
export const formatDate = value => format(value, API_DATE_FORMAT, 'D MMM YYYY');
export const formatDateTime = value => format(value, API_DATETIME_FORMAT, 'D MMM YYYY, h:mma');

/**
 * A fact drawn as an icon rather than a word. The icon is decoration - it is the hidden label that names the
 * value, since a date reads as "10 Jul 2026" to a screen reader and nothing tells it which date that is.
 */
export const IconFact = ({ icon: Icon, label, children }) => (
    <>
        <Icon aria-hidden="true" sx={{ fontSize: 14, verticalAlign: '-0.2em', marginRight: 0.375 }} />
        <Box component="span" sx={visuallyHidden}>
            {label}{' '}
        </Box>
        {children}
    </>
);

IconFact.propTypes = { icon: PropTypes.elementType, label: PropTypes.string, children: PropTypes.node };

// The avatar is decoration that helps an admin find their place in a long queue, so it is hidden from screen
// readers - the name is right beside it.
export const initialsOf = membership =>
    [membership?.first_name, membership?.sn]
        .filter(Boolean)
        .map(part => part.trim()[0])
        .join('')
        .toUpperCase();

/**
 * The applicant's details: one line of "a · b · c" where there is room for it, a fact per line where there is
 * not.
 *
 * The separators are decoration: a screen reader reading "middot" between every fact would be noise, so they
 * are hidden and each fact is its own element.
 *
 * Wide, this runs as text rather than as a flex row. A flex gap sits on both sides of every separator, which
 * leaves each dot marooned in its own pocket of air instead of reading as punctuation, and flex wrapping treats
 * a separator as a child in its own right, so a card could end a line on a dot and push the fact it belonged to
 * onto the next one. Here each separator shares a span with the fact that follows it and has no whitespace
 * between them, so the two can only ever wrap together.
 *
 * Narrow, a dot earns nothing. A separator only does work when two facts share a line; a fact that starts one
 * has already been separated by the break above it, and a leading dot there just reads as a bullet. On a phone
 * almost every fact starts its own line anyway, so the facts stack and the dots go - which also stops a fact
 * being split down the middle, "Born" stranded at one line's end and its date at the next one's start.
 */
export const MetaLine = ({ children, ...props }) => {
    const items = React.Children.toArray(children).filter(Boolean);
    return (
        <Typography component="div" variant="caption" color="text.secondary" sx={{ lineHeight: 1.6 }} {...props}>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 0 && ' '}
                    {/* A fact is atomic: it wraps to the next line whole, rather than leaving "Submitted" at the
                        end of one line and its date at the start of the next. The line breaks between facts
                        instead - of which there is always one to spare, since a fact too long to share a line
                        gets one of its own. */}
                    <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' }, whiteSpace: { sm: 'nowrap' } }}>
                        {index > 0 && (
                            <Box
                                component="span"
                                aria-hidden="true"
                                sx={{ display: { xs: 'none', sm: 'inline' }, color: 'text.disabled', marginRight: 0.5 }}
                            >
                                ·
                            </Box>
                        )}
                        {item}
                    </Box>
                </React.Fragment>
            ))}
        </Typography>
    );
};

MetaLine.propTypes = { children: PropTypes.node };

/**
 * One application in the admin queue.
 *
 * A card rather than a table row. An admin here works one application at a time rather than comparing a column
 * of dates down the page, so each application is a record with a heading, its status beside it, and its facts on
 * the line beneath.
 *
 * The heading matters beyond looks: it lets a screen reader user jump between applications instead of walking
 * every cell of a grid.
 */
export const MembershipApplicationCard = ({ membership, typeTitles, busy, deleted, onConfirm, onDelete }) => {
    const name = fullName(membership);
    const headingId = `membership-name-${membership.id}`;
    const inProgress = isConfirmationInProgress(membership);
    // A confirmed account has no confirm to offer; a renewing one can be re-confirmed, and one still waiting on
    // a decision can be confirmed. Nothing is actionable while a confirmation is already in flight, or once the
    // application has been deleted.
    const canConfirm = !deleted && !inProgress && (membership.status === 'renewing' || !isIssued(membership));
    // Only an application still waiting on a decision is deleted from here - an issued account is not thrown
    // away from the queue, and a confirmation in flight must settle first.
    const canDelete = !deleted && !inProgress && !isIssued(membership);

    return (
        <Box component="li" sx={{ listStyle: 'none' }}>
            <Card
                variant="outlined"
                component="article"
                aria-labelledby={headingId}
                data-testid={`membership-row-${membership.id}`}
                sx={{
                    borderRadius: 2,
                    transition: 'border-color 120ms ease, box-shadow 120ms ease',
                    // Hover is an affordance, never the way anything is revealed - everything here is on the
                    // page whether a pointer is over it or not (WCAG 1.4.13, and keyboard users have no hover).
                    '&:hover': {
                        borderColor: theme => alpha(theme.palette.primary.main, 0.4),
                        boxShadow: theme => `0 1px 8px ${alpha(theme.palette.primary.main, 0.08)}`,
                    },
                    // A deleted application stays on the page so the admin sees the delete took, but reads as
                    // spent rather than live.
                    ...(deleted ? { opacity: 0.6 } : {}),
                }}
            >
                <CardContent
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        paddingY: 1.5,
                        '&:last-child': { paddingBottom: 1.5 },
                    }}
                >
                    <Avatar
                        aria-hidden="true"
                        sx={{
                            bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            fontSize: 13,
                            fontWeight: 600,
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                        }}
                    >
                        {initialsOf(membership)}
                    </Avatar>

                    {/* One column beside the avatar. */}
                    <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
                        {/* The name and the application's status share the top line: the name to jump to, the
                            status to read at a glance. */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: 1,
                            }}
                        >
                            <Typography
                                id={headingId}
                                component="h2"
                                variant="subtitle1"
                                sx={{ fontWeight: 600, lineHeight: 1.4 }}
                            >
                                {name}
                            </Typography>

                            <Chip
                                size="small"
                                label={statusText(membership.status)}
                                color={statusColour(membership.status)}
                                data-testid={`membership-status-${membership.id}`}
                                sx={{ flexShrink: 0 }}
                            />
                        </Box>

                        <MetaLine data-testid={`membership-meta-${membership.id}`}>
                            {/* The type is a fact about the application, not a state of it. It leads the line,
                                and carries the only emphasis in it, because it is the fact that decides which
                                rules apply. The hospital service that qualifies it follows immediately. */}
                            <Box
                                component="span"
                                sx={{ fontWeight: 600, color: 'text.primary' }}
                                data-testid={`membership-type-${membership.id}`}
                            >
                                {typeTitles[membership.type] ?? membership.type}
                            </Box>
                            {!!membership.hospital_service && membership.hospital_service}
                            {!!membership.mail && (
                                <Link
                                    href={`mailto:${membership.mail}?subject=${encodeURIComponent(
                                        strings.mailSubject,
                                    )}`}
                                    // The one fact that opts out of staying whole. An address has no length
                                    // limit worth trusting, and an unbreakable one would push the card wider
                                    // than the screen (WCAG 1.4.10).
                                    sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere' }}
                                >
                                    <MailOutlineIcon
                                        aria-hidden="true"
                                        sx={{ fontSize: 14, verticalAlign: '-0.2em', marginRight: 0.375 }}
                                    />
                                    {membership.mail}
                                </Link>
                            )}
                            {!!membership.submitted_on && (
                                <IconFact icon={EventOutlinedIcon} label={strings.submittedOn}>
                                    {formatDateTime(membership.submitted_on)}
                                </IconFact>
                            )}
                            {!!membership.date_of_birth &&
                                membership.type !== 'fryer' &&
                                `${strings.birthdate} ${formatDate(membership.date_of_birth)}`}
                            {!!membership.alumni_num && membership.alumni_num}
                        </MetaLine>

                        {/* The decision on the application, kept in the same corner of every card so an admin
                            always knows where to reach for it. A confirmation already under way, or an
                            application already deleted, replaces the buttons with a chip saying so, rather than
                            a control that is unsafe or pointless to press. */}
                        {(canConfirm || canDelete || inProgress || deleted) && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    marginTop: 1,
                                }}
                            >
                                {!!inProgress && (
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        label={strings.inProgress}
                                        data-testid={`membership-inprogress-${membership.id}`}
                                    />
                                )}
                                {!!deleted && (
                                    <Chip
                                        size="small"
                                        variant="outlined"
                                        label={strings.deleted}
                                        data-testid={`membership-deleted-${membership.id}`}
                                    />
                                )}
                                {!!canDelete && (
                                    <Button
                                        size="small"
                                        variant="text"
                                        color="error"
                                        data-testid={`membership-delete-${membership.id}`}
                                        aria-label={strings.deleteLabel(name)}
                                        disabled={busy === 'deleting'}
                                        onClick={() => onDelete(membership)}
                                    >
                                        {busy === 'deleting' ? strings.deleting : strings.delete}
                                    </Button>
                                )}
                                {!!canConfirm && (
                                    <Button
                                        size="small"
                                        variant="contained"
                                        disableElevation
                                        data-testid={`membership-confirm-${membership.id}`}
                                        aria-label={strings.confirmLabel(confirmButtonText(membership), name)}
                                        disabled={busy === 'confirming'}
                                        onClick={() => onConfirm(membership)}
                                    >
                                        {busy === 'confirming' ? strings.confirming : confirmButtonText(membership)}
                                    </Button>
                                )}
                            </Box>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

MembershipApplicationCard.propTypes = {
    membership: PropTypes.object.isRequired,
    typeTitles: PropTypes.object.isRequired,
    // What this card is waiting on, if anything: 'confirming' | 'deleting'.
    busy: PropTypes.string,
    deleted: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default MembershipApplicationCard;
