/* istanbul ignore file */
export const FOOTER_TABS_HEIGHT = '56px';
export const HEADER_HEIGHT = '64px';

export const TAB_ICON_SX = { fontSize: '1.5rem' };
export const HEADER_LOGO_SX = { display: 'grid', padding: '1rem' };
export const HEADER_LOGO_IMAGE_SX = { height: '40px' };
export const ICON_BUTTON_SX = { fontSize: '1.5rem' };
export const CONTENT_WIDTH_SX = { width: '100%', maxWidth: 1100, mx: 'auto' };
export const CONTENT_HEIGHT_SX = { ...CONTENT_WIDTH_SX, height: '100%', maxWidth: '100%' };
export const FOOTER_CONTENT_SX = { ...CONTENT_WIDTH_SX };
export const FOOTER_NAV_SX = { height: 'var(--art-trail-footer-tabs-height)' };
export const FOOTER_TAB_ACTION_SX = { fontSize: 'var(--art-trail-font-size)' };
export const FOOTER_BUTTON_SX = { fontSize: '1rem' };
export const FOOTER_STEPPER_ROW_SX = { px: { xs: 1.5, sm: 2.5 }, py: 1.25, pt: 0, pb: 0 };

export const FOOTER_TAB_ROW_SX = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    boxSizing: 'border-box',
    px: { xs: 0.5, sm: 1.5 },
    py: 0.25,
    pb: 'calc(2px + env(safe-area-inset-bottom, 0px))',
};

export const DRAWER_PULLER_SX = {
    position: 'absolute',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    visibility: 'visible',
    right: 0,
    left: 0,
};

export const DRAWER_INNER_SX = {
    width: '100%',
    maxWidth: 1100,
    mx: 'auto',
    pt: 2,
};

export const DRAWER_CONTAINER_SX = { maxHeight: '50vh' };

export const DRAWER_SCROLL_SX = { px: { xs: 2, sm: 2.5 }, py: 2, overflowY: 'auto' };

export const SCROLL_VIEWPORT_SX = {
    mt: 'var(--art-trail-header-height)',
    height: 'calc(100dvh - var(--art-trail-header-height) - var(--art-trail-footer-safe-height) - 2px )',
    overflow: 'hidden',
};

export const FOOTER_SX = {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    height: 'var(--art-trail-footer-safe-height)',
    display: 'flex',
    flexDirection: 'column',
    borderTop: '1px solid',
    borderColor: 'divider',
    bgcolor: 'background.paper',
    overflow: 'hidden',
    boxShadow: 'none',
};

const STEPPER_SX = {
    bgcolor: 'transparent',
    px: 0,
    '& .MuiMobileStepper-dots': {
        display: undefined,
    },
    '& .MuiMobileStepper-dot': {
        mx: 0.35,
    },
    '& .MuiMobileStepper-dotActive': {
        bgcolor: 'primary.main',
    },
};

const MENU_ITEM_BASE_SX = {
    alignItems: 'center',
    px: { xs: 2, sm: 2.5 },
    py: 1.5,
    whiteSpace: 'normal',
    color: 'inherit',
    '&:not(:last-of-type)': {
        borderBottom: '1px solid rgba(255, 255, 255, 0.16)',
    },
    '&:hover': {
        bgcolor: 'rgba(255, 255, 255, 0.08)',
    },
};

export const MENU_ITEM_IMAGE_SX = {
    width: 56,
    height: 56,
    objectFit: 'cover',
    borderRadius: 1.5,
    flexShrink: 0,
};

export const MENU_ITEM_LABEL_SX = {
    minWidth: 0,
    display: 'grid',
    alignContent: 'center',
};
export const MAP_POPUP_WIDTH = 'min(320px, calc(100vw - 32px))';
export const MAP_POPUP_MAX_WIDTH = 'calc(100vw - 32px)';
export const popupClassNames = {
    container: 'artTrailMapPopup',
    media: 'artTrailMapPopupMedia',
    image: 'artTrailMapPopupImage',
    body: 'artTrailMapPopupBody',
    title: 'artTrailMapPopupTitle',
    titleLink: 'artTrailMapPopupTitleLink',
    description: 'artTrailMapPopupDescription',
    level: 'artTrailMapPopupLevel',
};
export const markerClassNames = {
    marker: 'artTrailMapMarker',
};
export const mapClassNames = {
    hiddenGeolocateControl: 'artTrailMapHiddenGeolocateControl',
};

const createMapGlobalStyles = appTheme => ({
    [`.${markerClassNames.marker}`]: {
        width: '27px',
        height: '27px',
        display: 'grid',
        placeItems: 'center',
        borderRadius: '50%',
        backgroundColor: 'var(--art-trail-marker-color)',
        border: '2px solid #ffffff',
        color: '#ffffff',
        fontSize: '1rem',
        fontWeight: 700,
        lineHeight: 1,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.24)',
    },
    [`.${mapClassNames.hiddenGeolocateControl}`]: {
        display: 'none !important',
    },
    '.mapboxgl-popup': {
        maxWidth: `${MAP_POPUP_MAX_WIDTH} !important`,
    },
    '.mapboxgl-popup-content': {
        width: MAP_POPUP_WIDTH,
        boxSizing: 'border-box',
    },
    [`.${popupClassNames.container}`]: {
        display: 'grid',
        gridTemplateColumns: '72px minmax(0, 1fr)',
        gap: '10px',
        alignItems: 'start',
        width: '100%',
        maxWidth: 'none',
    },
    [`.${popupClassNames.media}`]: {
        width: '72px',
    },
    [`.${popupClassNames.image}`]: {
        display: 'block',
        width: '72px',
        height: '72px',
        objectFit: 'cover',
        borderRadius: '8px',
    },
    [`.${popupClassNames.body}`]: {
        display: 'grid',
        gap: '4px',
        minWidth: 0,
    },
    [`.${popupClassNames.title}`]: {
        fontSize: '1rem',
        fontWeight: 700,
        lineHeight: 1.35,
    },
    [`.${popupClassNames.titleLink}`]: {
        color: appTheme.palette.primary.main,
        cursor: 'pointer',
        textDecoration: 'underline',
        textDecorationThickness: '0.08em',
        textUnderlineOffset: '0.12em',
    },
    [`.${popupClassNames.description}`]: {
        fontSize: '1rem',
        lineHeight: 1.4,
    },
    [`.${popupClassNames.description} em`]: {
        fontStyle: 'italic',
    },
    [`.${popupClassNames.level}`]: {
        fontSize: '1rem',
        fontWeight: 400,
        letterSpacing: '0.04em',
        lineHeight: 1.2,
    },
    '.mapboxgl-popup-close-button': {
        fontSize: '1.5rem',
        color: appTheme.palette.designSystem.bodyCopy,
    },
});

export const createAppRootSx = (appTheme, footerHeight) => ({
    '--art-trail-header-height': HEADER_HEIGHT,
    '--art-trail-footer-height': footerHeight,
    '--art-trail-footer-safe-height': 'calc(var(--art-trail-footer-height) + env(safe-area-inset-bottom, 0px))',
    '--art-trail-footer-tabs-height': FOOTER_TABS_HEIGHT,
    '--art-trail-font-size': `${appTheme.typography.fontSize}px`,
    '--art-trail-font-family': appTheme.typography.bodyFontFamily,
    '--art-trail-spacing': `${appTheme.typography.fontSize}px`,
    '--art-trail-content-bottom-padding': `${appTheme.typography.fontSize * 1}px`,
    minHeight: '100vh',
    height: '100dvh',
    bgcolor: appTheme.palette.white.main,
    color: appTheme.palette.designSystem.bodyCopy,
    overflow: 'hidden',
    fontSize: 'var(--art-trail-font-size)',
});

export const createGlobalStyles = appTheme => ({
    h1: {
        fontSize: '2.5rem',
        fontWeight: appTheme.typography.heavy,
        lineHeight: 1.2,
        fontFamily: appTheme.typography.headingFontFamily,
    },
    h2: {
        fontSize: '2rem',
        fontWeight: appTheme.typography.heavy,
        lineHeight: 1.2,
        fontFamily: appTheme.typography.headingFontFamily,
    },
    h3: {
        fontSize: '1.5rem',
        fontWeight: appTheme.typography.heavy,
        lineHeight: 1.2,
        fontFamily: appTheme.typography.headingFontFamily,
    },
    h4: {
        fontSize: '1.25rem',
        fontWeight: appTheme.typography.heavy,
        lineHeight: 1.2,
        fontFamily: appTheme.typography.headingFontFamily,
    },
    h5: {
        fontSize: '1.125rem',
        fontWeight: appTheme.typography.heavy,
        lineHeight: 1.2,
        fontFamily: appTheme.typography.headingFontFamily,
    },
    h6: {
        fontSize: '1rem',
        fontWeight: appTheme.typography.heavy,
        lineHeight: 1.2,
        fontFamily: appTheme.typography.headingFontFamily,
    },
    div: {
        fontSize: '1rem',
        fontWeight: appTheme.typography.fontWeightMedium,
        lineHeight: 1.5,
        fontFamily: appTheme.typography.bodyFontFamily,
    },
    p: {
        fontSize: '1rem',
        fontWeight: appTheme.typography.fontWeightMedium,
        lineHeight: 1.5,
        fontFamily: appTheme.typography.bodyFontFamily,
        marginBottom: '1rem',
    },
    li: {
        fontSize: '1rem',
        fontWeight: appTheme.typography.fontWeightMedium,
        lineHeight: 1.5,
        fontFamily: appTheme.typography.bodyFontFamily,
    },
    '[data-testid="art-trail-app"] a': {
        color: appTheme.palette.primary.main,
        '&:hover': {
            color: appTheme.palette.primary.main,
        },
        '&:active': {
            color: appTheme.palette.primary.main,
        },
        '&:visited': {
            color: appTheme.palette.primary.main,
        },
    },
    ...createMapGlobalStyles(appTheme),
});

export const createMenuSlotProps = () => ({
    root: {
        sx: {
            zIndex: currentTheme => currentTheme.zIndex.modal,
        },
    },
    paper: {
        sx: {
            position: 'fixed',
            top: {
                xs: `${HEADER_HEIGHT} !important`,
                sm: `${HEADER_HEIGHT} !important`,
            },
            bottom: {
                xs: '0 !important',
                sm: '16px !important',
            },
            left: '0 !important',
            right: { xs: '0 !important', sm: 'auto !important' },
            width: { xs: '100%', sm: 'min(420px, calc(100vw - 32px))' },
            maxWidth: { xs: '100%', sm: 420 },
            height: 'auto',
            maxHeight: {
                xs: 'none',
                sm: `min(720px, calc(100dvh - ${HEADER_HEIGHT} - 32px))`,
            },
            mt: '0 !important',
            borderRadius: 0,
            bgcolor: 'primary.main',
            color: 'white.main',
            boxShadow: 8,
            display: 'flex',
            flexDirection: 'column',
            transform: 'none !important',
            overflow: 'hidden',
            '& .MuiMenu-list': {
                boxSizing: 'border-box',
                flex: 1,
                minHeight: 0,
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
                paddingTop: 0,
                paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
            },
        },
    },
    list: {
        sx: {
            p: 0,
        },
    },
});

export const createScrollContainerSx = showStepper => ({
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    overscrollBehavior: 'contain',
    WebkitOverflowScrolling: 'touch',
    pb: showStepper ? 'calc(var(--art-trail-content-bottom-padding) + env(safe-area-inset-bottom, 0px))' : 0,
});

export const createStepperSx = isTrailWelcomeStep => ({
    ...STEPPER_SX,
    '& .MuiMobileStepper-dots': {
        display: isTrailWelcomeStep ? 'none' : undefined,
    },
});

export const createMenuItemSx = hasThumbnail => ({
    ...MENU_ITEM_BASE_SX,
    columnGap: hasThumbnail ? 1.5 : 0,
});

export const createDrawerSx = appTheme => ({
    '& .MuiPaper-root': {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        '& a': {
            color: appTheme.palette.primary.main,
            '&:hover': {
                color: appTheme.palette.primary.main,
            },
            '&:active': {
                color: appTheme.palette.primary.main,
            },
            '&:visited': {
                color: appTheme.palette.primary.main,
            },
        },
    },
});
