import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import Popper from '@mui/material/Popper';
import { styled } from '@mui/material/styles';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { linkToDrupal } from 'helpers/general';

const StyledPrintBalanceButton = styled(Button)(({ theme }) => ({
    '&[aria-expanded="true"] span': {
        // when the menu is open, the button looks hovered
        backgroundColor: theme.palette.primary.light,
        color: '#fff',
    },
    '&:focus-visible': {
        outline: '-webkit-focus-ring-color auto 1px',
    },
}));

const StyledMenuList = styled(List)(({ theme }) => ({
    backgroundColor: '#fff',
    zIndex: 2,
    border: '1px solid #dcdcdd',
    paddingBlock: '20px',
    '& li': {
        fontWeight: 400,
        padding: '8px 24px',
        '&:focus-visible': {
            backgroundColor: '#fff',
            '& span': {
                backgroundColor: theme.palette.primary.light,
                color: '#fff',
            },
        },
        '&:hover': {
            backgroundColor: 'inherit',
            color: 'inherit',
            '& span': {
                backgroundColor: theme.palette.primary.light,
                color: '#fff',
            },
        },
        '& span': {
            lineHeight: 'normal',
        },
        '&.has-error': {
            textDecoration: 'underline',
        },
    },
    '& .MuiTouchRipple-root': {
        display: 'none', // remove mui ripple
    },
}));

const dsDiscountDollarDashIcon = (
    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
        <g id="Discount-Dollar-Dash--Streamline-Streamline--3.0 1" clipPath="url(#clip0_1183_3145)">
            <path
                d="M1.01562 10C1.01563 12.3828 1.96219 14.668 3.64709 16.3529C5.33198 18.0378 7.6172 18.9844 10 18.9844C12.3828 18.9844 14.668 18.0378 16.3529 16.3529C18.0378 14.668 18.9844 12.3828 18.9844 10C18.9844 7.6172 18.0378 5.33198 16.3529 3.64709C14.668 1.96219 12.3828 1.01563 10 1.01562C7.6172 1.01563 5.33198 1.96219 3.64709 3.64709C1.96219 5.33198 1.01563 7.6172 1.01562 10Z"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8.20313 11.7969C8.20313 12.1523 8.30851 12.4997 8.50595 12.7952C8.7034 13.0907 8.98403 13.321 9.31237 13.457C9.6407 13.593 10.002 13.6286 10.3506 13.5592C10.6991 13.4899 11.0193 13.3188 11.2706 13.0675C11.5219 12.8162 11.693 12.496 11.7623 12.1474C11.8317 11.7989 11.7961 11.4376 11.6601 11.1092C11.5241 10.7809 11.2938 10.5003 10.9983 10.3028C10.7028 10.1054 10.3554 10 10 10C9.64461 10 9.29721 9.89462 9.00171 9.69717C8.70622 9.49973 8.47591 9.2191 8.33991 8.89076C8.2039 8.56242 8.16832 8.20113 8.23765 7.85257C8.30698 7.50401 8.47812 7.18384 8.72942 6.93254C8.98072 6.68125 9.30089 6.51011 9.64945 6.44078C9.99801 6.37144 10.3593 6.40703 10.6876 6.54303C11.016 6.67903 11.2966 6.90934 11.494 7.20484C11.6915 7.50033 11.7969 7.84774 11.7969 8.20313"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M10 5.20825V6.40617" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 13.5938V14.7917" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
            <clipPath>
                <rect width="20" height="20" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export const PaperCutMenu = ({ account, printBalance, printBalanceLoading, printBalanceError }) => {
    function markedPrintBalance() {
        if (!!printBalanceLoading || !printBalance?.hasOwnProperty('balance') || !!printBalanceError) {
            return null;
        }
        return <> (${printBalance?.balance})</>;
    }

    const [menuAnchorElement, setMenuAnchorElement] = useState(null);
    const popperRef = useRef(null);

    const isOpenpapercutMenu = Boolean(menuAnchorElement);
    useEffect(() => {
        if (!!isOpenpapercutMenu) {
            const findLink = setInterval(() => {
                const firstMenuItem = document.querySelector('#papercut-menu li:first-of-type');
                if (!!firstMenuItem) {
                    clearInterval(findLink);
                    firstMenuItem.focus();
                }
            }, 100);
        }
    }, [isOpenpapercutMenu]);

    const handleClose = () => {
        setMenuAnchorElement(null);
    };
    const handleToggle = event => {
        if (menuAnchorElement === null) {
            setMenuAnchorElement(event.currentTarget);
        } else {
            handleClose();
        }
    };
    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        const handleMouseClick = event => {
            if (
                menuAnchorElement &&
                !menuAnchorElement.contains(event.target) &&
                popperRef.current &&
                !popperRef.current.contains(event.target)
            ) {
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleMouseClick);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleMouseClick);
        };
    }, [menuAnchorElement]);

    /* istanbul ignore next */
    const handlePapercutTabNextKeyDown = e => {
        if (e?.key !== 'Tab') {
            return;
        }

        e.preventDefault();

        const elementPrefix = 'papercut-item-button-';
        const elementCount = parseInt(e.target.id.replace(elementPrefix, ''), 10);
        const nextElementId = e.shiftKey
            ? `${elementPrefix}${elementCount - 1}`
            : `${elementPrefix}${elementCount + 1}`;

        let tabTo = document.getElementById(nextElementId);
        if (!tabTo) {
            handleClose();
            tabTo = document.getElementById('papercut-menu-button');
        }
        !!tabTo && tabTo.focus();
    };

    /* istanbul ignore next */
    const handlePapercutTabOutKeyDown = e => {
        if (e?.key !== 'Tab') {
            return;
        }

        e.preventDefault();

        let tabTo;
        if (e.shiftKey) {
            const elementPrefix = 'papercut-item-button-';
            const elementCount = parseInt(e.target.id.replace(elementPrefix, ''), 10);
            const nextElementId = `${elementPrefix}${elementCount - 1}`;
            tabTo = document.getElementById(nextElementId);
        } else {
            handleClose();

            tabTo = document.getElementById('fines-and-charges-link');
            if (!tabTo) {
                tabTo = document.getElementById('training-event-detail-more-training-button');
            }
        }
        !!tabTo && tabTo.focus();
    };
    const navigateToAboutPage = () => {
        window.location.href = linkToDrupal('/library-and-student-it-help/print-scan-and-copy/your-printing-account ');
        handleClose();
    };
    const navigateToTopUpUrl = topupAmount => {
        const papercutAddress =
            'https://payments.uq.edu.au/OneStopWeb/aspx/TranAdd.aspx?TRAN-TYPE=W361&username=[id]&unitamountinctax=[topupAmount]&email=[email]';
        window.location.href = papercutAddress
            .replace('[id]', account.id)
            .replace('[topupAmount]', topupAmount)
            .replace('[email]', printBalance.email);
    };
    const topupAmounts = [5, 10, 20];

    return (
        <>
            <StyledPrintBalanceButton
                fullWidth
                classes={{ root: 'menuItemRoot' }}
                onClick={handleToggle}
                id={'papercut-menu-button'}
                data-testid={'papercut-menu-button'}
                data-analyticsid={'papercut-tooltip'}
                title="Click to manage your print balance"
                aria-haspopup="true"
                aria-expanded={menuAnchorElement !== null ? 'true' : 'false'}
                aria-controls="papercut-menu"
                aria-label="Show/hide Locations and hours panel"
            >
                {dsDiscountDollarDashIcon}{' '}
                <span data-testid="papercut-print-balance" data-analyticsid="papercut-accordion-label">
                    Print balance {markedPrintBalance()}
                </span>
                {menuAnchorElement !== null ? (
                    <ExpandLessIcon data-analyticsid="papercut-accordion-arrow-opener" />
                ) : (
                    <ExpandMoreIcon data-analyticsid="papercut-accordion-arrow-closer" />
                )}
            </StyledPrintBalanceButton>
            <Popper
                id={'papercut-menu'}
                data-testid={'papercut-menu'}
                anchorEl={menuAnchorElement}
                open={!!menuAnchorElement}
                placement="bottom-start"
                disablePortal={false}
                modifiers={[
                    {
                        name: 'flip',
                        enabled: true,
                        options: {
                            altBoundary: true,
                            rootBoundary: 'viewport',
                            padding: 8,
                        },
                    },
                    {
                        name: 'preventOverflow',
                        enabled: true,
                        options: {
                            altAxis: true,
                            altBoundary: true,
                            tether: true,
                            rootBoundary: 'document',
                            padding: 8,
                        },
                    },
                ]}
                ref={popperRef}
            >
                <StyledMenuList>
                    {(() => {
                        if (!!printBalanceLoading) {
                            return <MenuItem>Loading...</MenuItem>;
                        } else if (!!printBalanceError || !printBalance?.email) {
                            return <MenuItem>Top up is currently unavailable - please try again later.</MenuItem>;
                        } else {
                            return topupAmounts.map((topupAmount, index) => {
                                const topUpLabel = topupAmount => 'Top up your print balance - $' + topupAmount;
                                return (
                                    <MenuItem
                                        id={`papercut-item-button-${index + 1}`}
                                        key={`papercut-item-button-${index + 1}`}
                                        data-testid={`papercut-item-button-${index + 1}`}
                                        onClick={() => navigateToTopUpUrl(topupAmount)}
                                        onKeyDown={handlePapercutTabNextKeyDown}
                                    >
                                        <span>{topUpLabel(topupAmount)}</span>
                                    </MenuItem>
                                );
                            });
                        }
                    })()}

                    <MenuItem
                        id={`papercut-item-button-${topupAmounts.length + 1}`}
                        data-testid={`papercut-item-button-${topupAmounts.length + 1}`}
                        data-analyticsid={`papercut-item-button-${topupAmounts.length + 1}`}
                        onClick={() => navigateToAboutPage()}
                        onKeyDown={handlePapercutTabOutKeyDown}
                        className={!!printBalanceError || !printBalance?.email ? 'has-error' : ''}
                    >
                        <span>More about your printing account</span>
                    </MenuItem>
                </StyledMenuList>
            </Popper>
        </>
    );
};
PaperCutMenu.propTypes = {
    account: PropTypes.object,
    printBalance: PropTypes.object,
    printBalanceLoading: PropTypes.bool,
    printBalanceError: PropTypes.bool,
};

export default PaperCutMenu;
