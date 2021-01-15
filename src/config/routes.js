import { locale } from 'locale';
import { seeCourseResources } from 'helpers/access';

export const fullPath = process.env.FULL_PATH || 'https://homepage-staging.library.uq.edu.au';

export const pathConfig = {
    index: '/',
    courseresources: '/courseresources',
    paymentReceipt: '/payment-receipt',
    admin: {
        masquerade: '/admin/masquerade',
    },
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide',
};

// a duplicate list of routes for checking validity easily
export const flattedPathConfig = [
    '/',
    '/courseresources',
    '/payment-receipt',
    '/admin/masquerade',
    'https://www.library.uq.edu.au/404.js',
];

// TODO: will we even have roles?
export const roles = {
    admin: 'admin',
};

export const getRoutesConfig = ({ components = {}, account = null }) => {
    const publicPages = [
        {
            path: pathConfig.index,
            component: components.Index,
            exact: true,
            pageTitle: locale.pages.index.title,
        },
        {
            path: pathConfig.paymentReceipt,
            component: components.PaymentReceipt,
            exact: true,
            pageTitle: locale.pages.paymentReceipt.title,
        },
    ];

    const courseResoures = [
        {
            path: pathConfig.courseresources,
            component: components.CourseResources,
            exact: true,
            pageTitle: locale.pages.courseresources.title,
        },
    ];

    return [
        ...publicPages,
        ...(account && seeCourseResources(account) ? courseResoures : []),
        ...(account && account.canMasquerade
            ? [
                  {
                      path: pathConfig.admin.masquerade,
                      component: components.Masquerade,
                      exact: true,
                      access: [roles.admin],
                      pageTitle: locale.pages.masquerade.title,
                  },
              ]
            : []),
        {
            component: components.NotFound,
        },
    ];
};

export const getMenuConfig = (account, author, authorDetails, disabled) => {
    const publicPages = [];
    locale.publicmenu.map(item => {
        publicPages.push(item);
    });

    if (disabled) {
        return [...publicPages];
    }

    return [...publicPages];
};
