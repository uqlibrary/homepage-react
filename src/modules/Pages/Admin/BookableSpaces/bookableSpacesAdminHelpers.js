import { breadcrumbs, fullPath } from 'config/routes';
import { isSpacesAdminUser } from 'helpers/access';
import { ASKUS_SPRINGSHARE_ID } from 'config/locale';
import { addClass, removeClass } from '../../../../helpers/general';

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
    if (isSpacesAdminUser(account)) {
        return `${getPathRoot()}${spacesPath}${userString}`;
    }
    return '';
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

export function displayToastMessage(message, isError = true) {
    const messageLocal = !!message && !message.startsWith('<') ? `<p>${message}</p>` : message;
    const backgroundColor = isError ? '#D62929' : '#4aa74e';
    const icon = isError
        ? 'url("data:image/svg+xml,%3csvg viewBox=%270 0 24 24%27 fill=%27none%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3cpath d=%27M20.127 18.545a1.18 1.18 0 0 1-1.055 1.706H4.929a1.18 1.18 0 0 1-1.055-1.706l7.072-14.143a1.179 1.179 0 0 1 2.109 0l7.072 14.143Z%27 stroke=%27%23fff%27 stroke-width=%271.5%27%3e%3c/path%3e%3cpath d=%27M12 9v4%27 stroke=%27%23fff%27 stroke-width=%271.5%27 stroke-linecap=%27round%27%3e%3c/path%3e%3ccircle cx=%2711.9%27 cy=%2716.601%27 r=%271.1%27 fill=%27%23fff%27%3e%3c/circle%3e%3c/svg%3e")'
        : 'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27%23fff%27 viewBox=%270 0 16 16%27%3E%3Cg stroke=%27%23fff%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%27.75%27%3E%3Cpath fill=%27none%27 d=%27M9.258 10.516h-.43A.829.829 0 0 1 8 9.687V7.602c0-.23-.2-.43-.43-.43h-.425%27/%3E%3Cpath d=%27M7.8 5.059a.194.194 0 0 0-.198.199c0 .113.085.199.199.199a.195.195 0 0 0 .199-.2.195.195 0 0 0-.2-.198zm0 0%27/%3E%3Cpath fill=%27none%27 d=%27M8 1.715c3.457 0 6.285 2.828 6.285 6.285 0 3.457-2.828 6.285-6.285 6.285-3.457 0-6.285-2.828-6.285-6.285 0-3.457 2.828-6.285 6.285-6.285zm0 0%27/%3E%3C/g%3E%3C/svg%3E")';
    const html = `
            <style id="locations-toast-styles">
                body {
                    position: relative;
                }
                .toast {
                    background-color: ${backgroundColor};
                    color: #fff;
                    inset: .5rem .5rem auto;
                    padding: 0.5rem 1rem 0.5rem 3rem;
                    margin-inline: auto;
                    inline-size: fit-content;
                    background-image: ${icon};
                    background-repeat: no-repeat;
                    background-size: 1.5rem;
                    background-position: 0.75rem center;
                    border-radius: 0.5rem;
                    position: fixed;
                    transition: opacity 500ms ease-out;
                    z-index: 99;
                    p, ul {
                        font-family: 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                        font-size: 1rem;
                        font-weight: 400;
                        letter-spacing: 0.16px;
                        line-height: 25.6px;
                        margin-block: 0.5rem;
                    }
                }
            </style>
            <div id="toast-corner-message" class="toast" data-testid="toast-corner-message">
                ${messageLocal}
            </div>
        `;

    const template = document.createElement('template');
    !!html && !!template && (template.innerHTML = html);
    const body = document.querySelector('body');
    !!body && !!template && body.appendChild(template.content.cloneNode(true));
    const hideDelay = 3000;
    setTimeout(() => {
        const toast = document.getElementById('toast-corner-message');
        !!toast && (toast.style.opacity = 0);
    }, hideDelay);
    setTimeout(() => {
        const toast = document.getElementById('toast-corner-message');
        !!toast && toast.remove();
        const styles = document.getElementById('locations-toast-styles');
        !!styles && styles.remove();
    }, hideDelay + 1000);
}
export const springshareLocations = weeklyHours => {
    return (
        !!weeklyHours?.locations &&
        weeklyHours.locations.length > 0 &&
        weeklyHours.locations
            .filter(l => l.lid !== ASKUS_SPRINGSHARE_ID)
            .sort((a, b) => a.display_name.localeCompare(b.display_name))
            // eslint-disable-next-line camelcase
            .map(({ lid, display_name }) => ({
                id: lid,
                // eslint-disable-next-line camelcase
                display_name,
            }))
    );
};

export const getFlatFacilityTypeList = facilityTypes => {
    return (
        facilityTypes?.data?.facility_type_groups?.flatMap(group =>
            group.facility_type_children.map(child => ({
                facility_type_id: child.facility_type_id,
                facility_type_name: child.facility_type_name,
            })),
        ) || []
    );
};

export function removeAnyListeners(element) {
    if (!element) {
        return false;
    }
    // we cant actually generically remove listeners - but we can start from scratch
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
}

export function closeDeletionConfirmation() {
    const dialog = document.getElementById('confirmationDialog');
    !!dialog && dialog.close();

    const confirmationMessageElement = document.getElementById('confDialogMessage');
    !!confirmationMessageElement && (confirmationMessageElement.innerHTML = '');

    const confirmationCancelButton = document.getElementById('confDialogCancelButton');
    removeAnyListeners(confirmationCancelButton);

    const confirmationOKButton = document.getElementById('confDialogOkButton');
    removeAnyListeners(confirmationOKButton);
}

export function showGenericConfirmAndDeleteDialog(line1, line2 = '') {
    const confirmationMessageElement = document.getElementById('confDialogMessage');
    let innerHTML = `<p>${line1}</p>`;
    !!line2 && (innerHTML += `<p>${line2}</p>`);
    !!confirmationMessageElement && (confirmationMessageElement.innerHTML = innerHTML);

    const confirmationCancelButton = document.getElementById('confDialogCancelButton');
    !!confirmationCancelButton && confirmationCancelButton.addEventListener('click', closeDeletionConfirmation);

    const dialog = document.getElementById('confirmationDialog');
    !!dialog && dialog.showModal();
}

export function closeDialog(e = null) {
    const dialog = !e ? document.getElementById('popupDialog') : e.target.closest('dialog');
    !!dialog && dialog.close();

    const dialogMessageElement = document.getElementById('dialogMessageContent');
    !!dialogMessageElement && (dialogMessageElement.innerHTML = '');

    const warningIcon = document.getElementById('warning-icon');
    addClass(warningIcon, 'hidden');

    const dialogBodyElement = document.getElementById('dialogBody');
    !!dialogBodyElement && (dialogBodyElement.innerHTML = '');

    const addNewButton = document.getElementById('addNewButton');
    !!addNewButton && (addNewButton.innerText = 'Add new');
    !!addNewButton && (addNewButton.style.display = 'inline');
    removeAnyListeners(addNewButton);

    const deleteButton = document.getElementById('deleteButton');
    !!deleteButton && (deleteButton.style.display = 'inline');
    removeAnyListeners(deleteButton);

    const saveButton = document.getElementById('saveButton');
    removeAnyListeners(saveButton);
}
