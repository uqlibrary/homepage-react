function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

/**
 * the default homepage style blocks page scroll
 */
function resetDocumentScrollBar() {
    document.body.style.overflow = 'auto';
}

function removeFooter() {
    const footerExists = setInterval(() => {
        const footer = document.getElementById('full-footer-block');
        if (!!footer) {
            footer.parentNode.removeChild(footer);

            clearInterval(footerExists);
        }
    }, 300);
}

/**
 * look for the homepage link ("Library" text) and the askus button
 * move both into the primo login bar area
 * then remove the library utility area
 */
function mergeUtilityAreaAndPrimoLoginBar() {
    let homelinkComplete = false;
    let askusComplete = false;
    const mergeAreas = setInterval(() => {
        // move the link-to-homepage into primo login bar
        const homeLinkButton = document.getElementById('uq-site-header-home-button');
        if (!!homeLinkButton && !homelinkComplete) {
            // work out where to put the link-to-homepage (align with left border of content)
            // this only makes it correct on load, not on redraw. Enough for most cases
            const box1 = document.getElementsByTagName('md-content')[0] || false;
            const box1Width = !!box1 ? window.getComputedStyle(box1, null).getPropertyValue('padding-left') : 0;
            const box2 = box1.firstChild.nextSibling;
            const homeLinkLeft = (!!box2 ? box2.offsetWidth : 0) + parseInt(box1Width.replace('px', ''), 10);

            const mainMenu = document.getElementsByTagName('prm-main-menu')[0] || false;
            mainMenu.insertBefore(homeLinkButton, mainMenu.firstChild);

            !!homeLinkButton && (homeLinkButton.style.left = `${homeLinkLeft}px`);
            !!homeLinkButton && (homeLinkButton.style.position = 'absolute');

            homelinkComplete = true;
        }

        // move the askus button into primo login bar
        const askusButton = document.getElementById('askus-button-block');
        if (!!askusButton && !askusComplete) {
            askusButton.style.display = 'block';

            const qrCodeScanner = document.getElementById('qrCodeScanner');
            const parentDiv = !!qrCodeScanner && qrCodeScanner.parentNode;
            parentDiv.insertBefore(askusButton, qrCodeScanner);

            askusComplete = true;
        }

        // if _both_ have been moved, remove the original bar and stop looking
        if (!!homelinkComplete && !!askusComplete) {
            const nowEmptyHeader = document.getElementById('uq-site-header');
            !!nowEmptyHeader && (nowEmptyHeader.style.display = 'none');

            clearInterval(mergeAreas);
        }
    }, 300); // check every 100ms
}

function moveAlertsBelowPrimoLoginBar() {
    const moveAlertsArea = setInterval(() => {
        const libraryHeader = document.getElementById('content-container');
        const alertChild = document.getElementById('alert-container');
        if (!!alertChild && !!libraryHeader) {
            // the primo uq logo is invisible, but still exist in the dom
            // and can be used to get its parent, which doesnt have an id
            const primoLogo = document.getElementsByTagName('prm-logo')[0] || false;
            const primoUtilityBar = !!primoLogo && primoLogo.parentNode;
            !!primoUtilityBar && (primoUtilityBar.style.backgroundColor = '#ffffff');

            const libraryHeader = document.getElementById('content-container');
            const alertsBlock = document.getElementById('alert-container');
            !!libraryHeader &&
                !!primoUtilityBar &&
                !!alertsBlock &&
                libraryHeader.insertBefore(primoUtilityBar, alertsBlock);

            clearInterval(moveAlertsArea);
        }
    }, 300); // check every 200ms
}

function loadReusableComponents() {
    // the react root is inserted via angular in the Primo custom.js file, within the Primo View Package

    resetDocumentScrollBar();

    removeFooter();

    mergeUtilityAreaAndPrimoLoginBar();

    // no megamenu

    // no auth button

    moveAlertsBelowPrimoLoginBar();
}

ready(loadReusableComponents);
