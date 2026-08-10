import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { pathConfig } from 'config/pathConfig';
import { breadcrumbs } from 'config/routes';

import { default as locale } from '../membershipAdmin.locale';

const strings = locale.settings;
const rowStrings = strings.row;

// A day-first date, DD-MM-YYYY. The whole-date format is checked here; whether the date exists is left to the
// backend, which rejects an impossible one - the same division the inline card edit makes. A blank is allowed:
// clearing the field and updating is how an override is dropped.
export const DATE_PATTERN = /^[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}$/;
export const isValidExpiry = value => value.trim() === '' || DATE_PATTERN.test(value.trim());

// A blank, or the computed date itself, both resolve to the computed date on save, so both read as "will use
// the calculated date". A type with no computed rule is never calculated.
export const willUseCalculated = (computedExpiry, value) =>
    !!computedExpiry && (value.trim() === '' || value.trim() === computedExpiry);

/**
 * One membership type's expiry date, editable in place and saved on its own.
 *
 * The row shows the type's computed date and whether the date in the field is that computed one or an override.
 * That status reads live as the field is edited - "on update" - so an admin sees what the update will make it.
 * The saved record is held here and replaced with whatever the server stores, since the server decides which
 * of the two a given submission resolves to (a blank or the computed date drops the override).
 */
export const MembershipTypeSetting = ({ type, title, onSave }) => {
    const [record, setRecord] = useState(type);
    const [expiry, setExpiry] = useState(record.expiry ?? '');
    // idle | saving | saved | error
    const [status, setStatus] = useState('idle');

    const valid = isValidExpiry(expiry);
    const dirty = expiry !== (record.expiry ?? '');
    const hasComputed = record.computed_expiry != null;
    const calculated = willUseCalculated(record.computed_expiry, expiry);

    const onChange = event => {
        setExpiry(event.target.value);
        // A save note describes what was last saved, so it goes the moment the value is edited again.
        setStatus(current => (current === 'idle' ? current : 'idle'));
    };

    const save = async () => {
        setStatus('saving');
        try {
            const saved = await onSave({ ...record, expiry: expiry.trim() });
            setRecord(saved);
            setExpiry(saved.expiry ?? '');
            setStatus('saved');
        } catch (failure) {
            setStatus('error');
        }
    };

    const statusText = hasComputed
        ? `${rowStrings.calculatedDefault(record.computed_expiry)} ` +
          `${calculated ? rowStrings.usingCalculated : rowStrings.overrideActive}${dirty ? rowStrings.onUpdate : ''}.`
        : rowStrings.automationUnavailable;

    return (
        <Box
            component="li"
            data-testid={`membership-type-${type.name}`}
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                gap: 2,
                listStyle: 'none',
                paddingY: 1.5,
                borderTop: theme => `1px solid ${theme.palette.divider}`,
            }}
        >
            <Typography component="span" sx={{ flex: '0 0 200px', fontWeight: 600, paddingTop: 0.75 }}>
                {title}
            </Typography>

            <Box sx={{ flex: '1 1 auto', minWidth: 240 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <TextField
                        textFieldId={`expiry-${type.name}`}
                        label={rowStrings.expiryLabel}
                        hideLabel
                        ariaLabel={rowStrings.expiryFor(title)}
                        placeholder={rowStrings.expiryPlaceholder}
                        value={expiry}
                        onChange={onChange}
                        errorText={valid ? undefined : rowStrings.invalid}
                        sx={{ width: 150 }}
                    />
                    <Button
                        variant="contained"
                        disableElevation
                        data-testid={`membership-type-save-${type.name}`}
                        aria-label={rowStrings.updateLabel(title)}
                        disabled={!valid || status === 'saving'}
                        onClick={save}
                    >
                        {status === 'saving' ? rowStrings.updating : rowStrings.update}
                    </Button>
                </Box>

                {/* The computed date and whether the field is on it or overriding it. The word carries the
                    meaning, so the colour never has to (WCAG 1.4.1). */}
                <Typography
                    variant="caption"
                    component="p"
                    data-testid={`membership-type-status-${type.name}`}
                    color={hasComputed ? (calculated ? 'success.main' : 'warning.main') : 'text.secondary'}
                    sx={{ marginTop: 0.5, marginBottom: 0 }}
                >
                    {statusText}
                </Typography>

                {status === 'saved' && (
                    <Typography
                        component="span"
                        variant="body2"
                        color="success.main"
                        data-testid={`membership-type-saved-${type.name}`}
                    >
                        <CheckCircleOutlineIcon
                            aria-hidden="true"
                            sx={{ fontSize: 16, verticalAlign: '-0.2em', marginRight: 0.375 }}
                        />
                        {rowStrings.saved}
                    </Typography>
                )}
                {status === 'error' && (
                    <Typography
                        component="span"
                        variant="body2"
                        color="error.main"
                        data-testid={`membership-type-error-${type.name}`}
                    >
                        {rowStrings.saveFailed}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

MembershipTypeSetting.propTypes = {
    type: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired,
};

/**
 * The per-type expiry settings screen: every membership type with its expiry date, each shown as the computed
 * date or an override, and each editable in place and saved on its own. Reached from the applications queue and
 * gated on the same admin group.
 */
export const MembershipSettings = ({
    actions,
    membershipTypes,
    membershipTypesLoading,
    membershipTypesError,
    membershipFormData,
    membershipFormDataLoading,
}) => {
    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.membershipadminsettings.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.membershipadminsettings.pathname);

        if (!membershipTypes && !membershipTypesLoading) {
            actions.loadMembershipTypes();
        }
        // The friendly type titles ride on the same form data the rest of the section reads.
        if (!membershipFormData && !membershipFormDataLoading) {
            actions.loadMembershipFormData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Map a type's name to its human title; a type the form data does not name falls back to its own name.
    const typeTitles = useMemo(
        () =>
            (membershipFormData?.account_types ?? []).reduce(
                (titles, accountType) => ({ ...titles, [accountType.value]: accountType.title }),
                {},
            ),
        [membershipFormData],
    );

    const onSave = type => actions.updateMembershipType(type);

    return (
        <StandardPage title={strings.title}>
            <StandardCard noHeader>
                <Button
                    component={RouterLink}
                    to={pathConfig.admin.membership}
                    startIcon={<ArrowBackIcon />}
                    data-testid="membership-settings-back"
                    sx={{ marginBottom: 1 }}
                >
                    {strings.back}
                </Button>

                {strings.intro.map(paragraph => (
                    <Typography key={paragraph} variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
                        {paragraph}
                    </Typography>
                ))}

                {!!membershipTypesLoading && <InlineLoader message={strings.loading} />}

                {!!membershipTypesError && (
                    <Alert
                        severity="error"
                        data-testid="membership-settings-error"
                        action={
                            <Button
                                color="inherit"
                                size="small"
                                onClick={() => actions.loadMembershipTypes()}
                                data-testid="membership-settings-retry"
                            >
                                {strings.retry}
                            </Button>
                        }
                    >
                        {strings.loadFailed}
                    </Alert>
                )}

                {!membershipTypesLoading && !membershipTypesError && !!membershipTypes && (
                    <Box
                        component="ul"
                        aria-label={strings.caption}
                        data-testid="membership-settings-list"
                        sx={{ listStyle: 'none', margin: 0, padding: 0 }}
                    >
                        {membershipTypes.map(type => (
                            <MembershipTypeSetting
                                key={type.name}
                                type={type}
                                title={typeTitles[type.name] ?? type.name}
                                onSave={onSave}
                            />
                        ))}
                    </Box>
                )}
            </StandardCard>
        </StandardPage>
    );
};

MembershipSettings.propTypes = {
    actions: PropTypes.object.isRequired,
    membershipTypes: PropTypes.array,
    membershipTypesLoading: PropTypes.bool,
    membershipTypesError: PropTypes.any,
    membershipFormData: PropTypes.object,
    membershipFormDataLoading: PropTypes.bool,
};

export default MembershipSettings;
