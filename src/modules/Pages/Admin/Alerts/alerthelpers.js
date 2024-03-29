const moment = require('moment');

export function getTimeNowFormatted() {
    return moment().format('YYYY-MM-DDTHH:mm');
}

export function getTimeEndOfDayFormatted() {
    return moment()
        .endOf('day')
        .format('YYYY-MM-DDTHH:mm');
}

// so the user doesnt lose their work by clicking on the preview button,
// change the href to an alert of what the click would be
export function makePreviewActionButtonJustNotifyUser(values) {
    const popuptext = `On the live website, this button will visit ${values.linkUrl} when clicked`;
    const changeLink = setInterval(() => {
        // its a moment before it is available
        const preview = document.getElementById('alert-preview');
        const previewShadowRoot = !!preview && preview.shadowRoot;
        const link = !!previewShadowRoot && previewShadowRoot.getElementById('alert-action-desktop');
        if (!!link) {
            link.setAttribute('href', '#');
            link.setAttribute('title', popuptext);
            /* istanbul ignore next */
            link.onclick = () => {
                alert(popuptext);
                return false;
            };
            clearInterval(changeLink);
        }
    }, 100);
}

export function manuallyMakeWebComponentBePermanent(webComponent, thebody) {
    // when the alert body has the square bracket for 'permanent',
    // that enclosed string is not accepted by setattribute
    // something to do with XSS blocking for special char?
    // so we have to handle it manually :(
    webComponent.setAttribute('alertmessage', thebody.replace('[permanent]', ''));
    // manually remove the 'non-permanent' button
    const changeMessage = setInterval(() => {
        // its a moment before it is available
        const preview = document.getElementById('alert-preview');
        const previewShadowRoot = !!preview && preview.shadowRoot;
        const closeButton = !!previewShadowRoot && previewShadowRoot.getElementById('alert-close');
        if (!!closeButton) {
            closeButton.remove();
            clearInterval(changeMessage);
        }
    }, 100);
}

export const getBody = bodyValues => {
    const permanentAlert = bodyValues.permanentAlert ? '[permanent]' : '';
    const link = bodyValues.linkRequired ? `[${bodyValues.linkTitle}](${bodyValues.linkUrl})` : '';
    return `${bodyValues.enteredbody}${permanentAlert}${link}`;
};

export function extractFieldsFromBody(content) {
    const linkRegex = !!content && content.match(/\[([^\]]+)\]\(([^)]+)\)/);
    let theMessage = content || '';
    if (!!linkRegex && linkRegex.length === 3) {
        theMessage = content.replace(linkRegex[0], '').replace('  ', ' ');
        theMessage = theMessage.replace(linkRegex[0], '').replace('  ', ' ');
    }

    const permanent = theMessage.includes('[permanent]');
    if (!!permanent) {
        theMessage = theMessage.replace('[permanent]', '');
    }
    return {
        isPermanent: permanent,
        linkRequired: linkRegex?.length === 3,
        linkTitle: !!linkRegex && linkRegex.length === 3 ? linkRegex[1] : '',
        linkUrl: !!linkRegex && linkRegex.length === 3 ? linkRegex[2] : '',
        message: theMessage,
    };
}

// the slug(s) are saved to the db for the alert, the title is displayed on the form
// **
// If a system is removed at some point, add 'removed: true" as attribute instead of deleting
//      this will maintain historic info
// **
// To add a system, add an entry here and then add a system="{slug}" to the <alert-list> call, usually here:
// https://github.com/uqlibrary/reusable-webcomponents/tree/master/src/applications
// eg https://github.com/uqlibrary/reusable-webcomponents/blob/master/src/applications/drupal/load.js#L163
// add: !!alerts && alerts.setAttribute('system', 'drupal');
// below const alerts = document.createElement('alert-list');
// and slug: drupal entry below
export const systemList = [
    {
        slug: 'homepage',
        title: 'Home page',
    },
    {
        slug: 'primo',
        title: 'Primo',
    },
    {
        slug: 'espace',
        title: 'eSpace',
    },
];
