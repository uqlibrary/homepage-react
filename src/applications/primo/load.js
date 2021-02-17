function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function removeFooter() {
    const footerExists = setInterval(() => {
        const footer = document.getElementById('full-footer-block');
        if (!!footer) {
            footer.parentNode.removeChild(footer);

            clearInterval(footerExists);
        }
        document.body.style.overflow = 'auto'; // the default homepage style blocks page scroll
    }, 100);
}

function mergeUtilityAreaAndPrimoLoginBar() {
    let utilityCounter = 20; // avoid 'maximum call stack size exceeded' if element never becomes available
    const mergeAreas = setInterval(() => {
        const homeLink = document.getElementById('uq-site-header-home-button');
        if (!!homeLink) {
            // work out where to make the home link sit
            const box1 = (document.getElementsByTagName('md-content') || [])[0];
            const box1Width = window.getComputedStyle(box1, null).getPropertyValue('padding-left');
            const box2 = box1.firstChild.nextSibling;
            const homeLinkLeft = box2.offsetWidth + parseInt(box1Width.replace('px', ''), 10);

            const mainMenu = (document.getElementsByTagName('prm-main-menu') || [])[0];
            mainMenu.insertBefore(homeLink, mainMenu.firstChild);

            homeLink.style.left = `${homeLinkLeft}px`;
            homeLink.style.position = 'absolute';
        }

        const askusButton = document.getElementById('askus-button-block');
        if (!!askusButton) {
            const qrCodeScanner = document.getElementById('qrCodeScanner');
            const parentDiv = qrCodeScanner.parentNode;
            parentDiv.insertBefore(askusButton, qrCodeScanner);
        }

        if (!!homeLink && !!askusButton) {
            const nowEmptyHeader = document.getElementById('uq-site-header');
            nowEmptyHeader.style.display = 'none';
        }

        if ((!!homeLink && !!askusButton) || !utilityCounter) {
            const nowEmptyHeader = document.getElementById('uq-site-header');
            nowEmptyHeader.style.display = 'none';

            clearInterval(mergeAreas);
        }
        utilityCounter--;
    }, 100); // check every 100ms
}

function moveAlertsBelowPrimoLoginBar() {
    let alertsCounter = 20; // avoid 'maximum call stack size exceeded' if element never becomes available
    const moveAlertsArea = setInterval(() => {
        const libraryHeader = document.getElementById('content-container');
        const alertChild = document.getElementById('alert-container');
        if (!!alertChild && !!libraryHeader) {
            const primoLogo = (document.getElementsByTagName('prm-logo') || [])[0];
            const primoUtilityBar = primoLogo.parentNode;
            primoUtilityBar.style.backgroundColor = '#ffffff';
            const libraryHeader = document.getElementById('content-container');
            const alertChild = document.getElementById('alert-container');
            libraryHeader.insertBefore(primoUtilityBar, alertChild);
        }
        if ((!!alertChild && !!libraryHeader) || !alertsCounter) {
            clearInterval(moveAlertsArea);
        }
        alertsCounter--;
    }, 100); // check every 100ms
}

function loadReusableComponents() {
    // the react root is inserted via angular in the Primo custom.js file, within the Primo View Package

    mergeUtilityAreaAndPrimoLoginBar();

    // no megamenu

    // no auth button

    moveAlertsBelowPrimoLoginBar();

    removeFooter();

    ready(loadReusableComponents);
}

ready(loadReusableComponents);
