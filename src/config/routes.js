import { locale } from 'locale';
import { createHash } from 'crypto';

export const fullPath = process.env.FULL_PATH || 'https://homepage-staging.library.uq.edu.au';
export const pidRegExp = 'UQ:[a-z0-9]+';
export const isFileUrl = route => new RegExp('\\/view\\/UQ:[a-z0-9]+\\/.*').test(route);

// const isAdmin = authorDetails => {
//     return authorDetails && (!!authorDetails.is_administrator || !!authorDetails.is_super_administrator);
// };

export const getDatastreamVersionQueryString = (fileName, checksum) => {
    if (!checksum) {
        return '';
    }

    const hash = createHash('md5')
        .update(`${fileName}${checksum.trim()}`)
        .digest('hex');

    return hash;
};

export const pathConfig = {
    index: '/',
    // I dont think this is needed as contact is handled through web.library, but keep it for the notfound test for now
    contact: '/contact',
    courseresources: '/courseresources',
    admin: {
        masquerade: '/admin/masquerade',
    },
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide',
};

// a duplicate list of routes for checking validity easily
export const flattedPathConfig = ['/', '/contact', '/courseresources', '/admin/masquerade'];

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
            path: pathConfig.contact,
            render: () => components.StandardPage({ ...locale.pages.contact }),
            pageTitle: locale.pages.contact.title,
        },
    ];

    const loggedinPages = [
        {
            path: pathConfig.courseresources,
            component: components.CourseResources,
            exact: true,
            pageTitle: locale.pages.courseresources.title,
        },
    ];

    return [
        ...publicPages,
        ...(account ? loggedinPages : []),
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
