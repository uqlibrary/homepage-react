import { locale } from 'locale';
import { createHash } from 'crypto';

export const fullPath = process.env.FULL_PATH || 'https://fez-staging.library.uq.edu.au';
export const pidRegExp = 'UQ:[a-z0-9]+';
export const isFileUrl = route => new RegExp('\\/view\\/UQ:[a-z0-9]+\\/.*').test(route);

const isAdmin = authorDetails => {
    return authorDetails && (!!authorDetails.is_administrator || !!authorDetails.is_super_administrator);
};

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
    contact: '/contact',
    admin: {
        masquerade: '/admin/masquerade',
    },
    help: 'https://guides.library.uq.edu.au/for-researchers/research-publications-guide',
};

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

    return [
        ...publicPages,
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
    ];
};

export const getMenuConfig = (account, author, authorDetails, disabled) => {
    const homePage = [
        {
            linkTo: pathConfig.index,
            ...locale.menu.index,
            public: true,
        },
    ];
    const publicPages = [
        {
            ...locale.menu.libraryServices,
            public: true,
        },
        {
            ...locale.menu.researchToolsTechniques,
            public: true,
        },
        {
            ...locale.menu.collections,
            public: true,
        },
        {
            ...locale.menu.borrowingRequesting,
            public: true,
        },
        {
            ...locale.menu.locationsHours,
            public: true,
        },
        {
            ...locale.menu.about,
            public: true,
        },
        {
            ...locale.menu.contactUs,
            public: true,
        },
    ];

    if (disabled) {
        return [...homePage, ...publicPages];
    }

    return [
        ...homePage,
        ...(account && account.canMasquerade
            ? [
                  {
                      linkTo: pathConfig.admin.masquerade,
                      ...locale.menu.masquerade,
                  },
              ]
            : []),
        ...((account && account.canMasquerade) || isAdmin(authorDetails)
            ? [
                  {
                      divider: true,
                      path: '/234234234242',
                  },
              ]
            : []),
        ...publicPages,
    ];
};
