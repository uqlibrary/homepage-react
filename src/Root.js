import React from 'react';
import { RouterProvider, Outlet } from 'react-router';
import { createRouter } from 'config/router';
import { mui1theme } from 'config';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { App } from 'modules/App/components';

const router = createRouter([
    {
        path: '*',
        element: (
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={mui1theme}>
                    <App>
                        <Outlet />
                    </App>
                </ThemeProvider>
            </StyledEngineProvider>
        ),
        ...(process.env.HASH_ROUTER ? { basename: process.env.CI_BRANCH } : {}),
    },
]);

const Root = () => {
    return <RouterProvider router={router} />;
};

export default Root;
