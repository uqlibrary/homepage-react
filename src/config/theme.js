import { createTheme } from '@mui/material/styles';
import { orange, red } from '@mui/material/colors';
import { renderTimeViewClock } from '@mui/x-date-pickers';

const palette = {
    primary: {
        light: '#51247A', // uqpurple
        main: '#51247A', // uqpurple
        dark: '#195794',
        gradient: {
            horizontal: {
                background: 'linear-gradient(to right, rgb(81,36,122) 55%,rgb(150,42,139) 100%)',
                filter:
                    'progid:DXImageTransform.Microsoft.gradient( startColorstr="#51247a", ' +
                    'endColorstr="#962a8b",GradientType=1 )',
            },
            diagonal: {
                background: 'linear-gradient(135deg, rgb(81,36,122) 55%,rgb(150,42,139) 100%)',
                filter:
                    'progid:DXImageTransform.Microsoft.gradient( startColorstr="#51247a", ' +
                    'endColorstr="#962a8b",GradientType=1 )',
            },
        },
    },
    secondary: {
        light: '#595959',
        main: '#3B383E', // design system grey-900
        dark: '#19151c', // design system $black
    },
    accent: {
        light: '#962A8B',
        main: '#3881cb',
        dark: '#3b1a59',
    },
    white: {
        main: '#FFFFFF',
    },
    warning: {
        light: '#fbb800',
        main: '#bf5000',
        dark: '#542400',
    },
    success: {
        light: '#00a700',
        main: '#007200',
        dark: '#005000',
    },
    error: {
        light: '#ff0000',
        main: '#951126',
        dark: '#790000',
    },
};

export const mui1theme = createTheme({
    breakpoints: {
        values: {
            xs: 0, // Phone
            sm: 600, // Tablet
            md: 900, // Small Desktop
            lg: 1280, // Large Desktop
            xl: 1536, // Extra Large Desktop
            uqDsMobile: 390,
            uqDsTablet: 640,
            uqDsDesktop: 848,
            uqDsDesktopXL: 1024,
        },
    },
    palette: palette,
    components: {
        MuiDesktopTimePicker: {
            defaultProps: {
                viewRenderers: {
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                },
            },
        },
        MuiDesktopDateTimePicker: {
            defaultProps: {
                viewRenderers: {
                    hours: renderTimeViewClock,
                    minutes: renderTimeViewClock,
                    seconds: renderTimeViewClock,
                },
            },
        },
    },
    status: {
        danger: red[500],
        warning: orange[500],
    },
    typography: {
        fontWeightLight: 200,
        fontWeightRegular: 300,
        fontWeightMedium: 400,
        useNextVariants: true,
        suppressDeprecationWarnings: true,
        caption: {
            color: '#000',
        },
    },
    overrides: {
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    width: '100%',
                    textOverflow: 'ellipsis',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: '#4085C6 !important',
                        color: '#FFFFFF',
                    },
                },
            },
        },
        MUIDataTable: {
            styleOverrides: {
                paper: {
                    boxShadow: 'none',
                    padding: 0,
                    margin: 0,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                containedSecondary: {
                    '&:hover': {
                        backgroundColor: '#aca7a3',
                        borderColor: '#aca7a3',
                        color: '#000',
                    },
                },
            },
        },
    },
    graphs: {
        color1: '#d72865',
        color2: '#1e7d94',
        color3: '#49075E',
        color4: '#468fcc',
        color5: '#f28620',
        color6: '#333333',
        color7: '#595959',
    },
    // Converts a color hex code to RGBA when referenced from a component
    hexToRGBA: (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        if (alpha) {
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
        } else {
            return 'rgb(' + r + ', ' + g + ', ' + b + ')';
        }
    },
});
