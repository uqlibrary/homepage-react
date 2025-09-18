import { breadcrumbs, fullPath } from 'config/routes';
import { isSpacesAdminUser } from 'helpers/access';

export const getPathRoot = () => {
    /* istanbul ignore next */
    if (fullPath === 'https://homepage-production.library.uq.edu.au') {
        return 'https://www.library.uq.edu.au';
    }
    return fullPath;
};

/**
 * extract the username from the url
 * return prefixed by the correct character, which should be either '?' or '&'
 * @param appendType
 * @returns {string}
 */
export function getUserPostfix(appendType = '?') {
    let userString = '';
    /* istanbul ignore next */
    if (window.location.hostname === 'localhost') {
        const queryString = new URLSearchParams(
            window.location.search || window.location.hash.substring(location.hash.indexOf('?')),
        );

        // Get user from query string
        const user = !!queryString && queryString.get('user');
        userString = !!user ? `${appendType}user=${user}` : '';
    }
    return userString;
}

export const spacesAdminLink = (spacesPath = '', /* istanbul ignore next */ account = null) => {
    const userString = getUserPostfix();
    return isSpacesAdminUser(account)
        ? `${getPathRoot()}/admin/spaces${spacesPath}${userString}`
        : `${getPathRoot()}/spaces${spacesPath}${userString}`;
};

export function addBreadcrumbsToSiteHeader(localChildren) {
    const awaitSiteHeader = setInterval(() => {
        const siteHeader = document.querySelector('uq-site-header');
        const siteHeaderShadowRoot = siteHeader.shadowRoot;

        if (!!siteHeaderShadowRoot) {
            clearInterval(awaitSiteHeader);

            const breadcrumbParent = !!siteHeaderShadowRoot && siteHeaderShadowRoot.getElementById('breadcrumb_nav');
            if (breadcrumbParent.children.length > 2) {
                return; // already added
            }

            !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.bookablespaces.title);
            !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.bookablespaces.pathname);

            const listItems = [
                `<li class="uq-breadcrumb__item">
                     <a class="uq-breadcrumb__link" id="secondlevel-site-breadcrumb-link" data-testid="secondlevel-site-title" href="/admin/spaces">Admin</a>
                 </li>`,
                ...localChildren,
            ];
            !!listItems &&
                listItems.length > 0 &&
                listItems.forEach(item => {
                    breadcrumbParent.insertAdjacentHTML('beforeend', item);
                });
        }
    }, 100);
}
