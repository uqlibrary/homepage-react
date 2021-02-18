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
    console.log('reset document scroll');
    document.body.style.overflow = 'auto';
    document.body.style.overflowY = 'auto';
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

function placeHomepageLinkNicely() {
    const homeLinkButton = document.getElementById('uq-site-header-home-button');

    if (!!homeLinkButton) {
        // align the link-to-homepage with left border of content
        const box1 = document.getElementsByTagName('md-content')[0] || false;
        const box1Width = !!box1 ? window.getComputedStyle(box1, null).getPropertyValue('padding-left') : 0;
        console.log('box1Width = ', box1Width);
        let box2 = box1.firstChild.nextSibling;
        console.log('box2 = ', box2);
        if (JSON.stringify(box2) === '{}') {
            // a results page for an item will have <!----> as the next element
            box2 = box2.nextSibling;
            console.log('got comment - now box2 = ', box2);
        }
        const box2Width = !!box2 ? box2.offsetWidth : 0;
        console.log('box2Width = ', box2Width);
        const homeLinkLeft = box2Width + parseInt(box1Width.replace('px', ''), 10);
        console.log('homeLinkLeft = ', homeLinkLeft);

        !!homeLinkButton && (homeLinkButton.style.left = `${homeLinkLeft}px`);
    }
}

/**
 * look for the homepage link ("Library" text) and the askus button
 * move both into the primo login bar area
 * then remove the library utility area
 */
function mergeUtilityAreaAndPrimoLoginBar() {
    console.log('mergeUtilityAreaAndPrimoLoginBar');
    let homelinkComplete = false;
    let askusComplete = false;
    const mergeAreas = setInterval(() => {
        const homeLinkButton = document.getElementById('uq-site-header-home-button');
        console.log('homeLinkButton = ', homeLinkButton);
        if (!!homeLinkButton && !homelinkComplete) {
            // move the link-to-homepage into primo login bar
            const mainMenu = document.getElementsByTagName('prm-main-menu')[0] || false;
            console.log('mainMenu = ', mainMenu);
            !!mainMenu.firstChild && console.log('mainMenu.firstChild = ', mainMenu.firstChild);
            !!mainMenu && !!mainMenu.firstChild && mainMenu.insertBefore(homeLinkButton, mainMenu.firstChild);

            placeHomepageLinkNicely();

            homelinkComplete = true;
        }

        // move the askus button into primo login bar
        const askusButton = document.getElementById('askus-button-block');
        console.log('askusButton = ', askusButton);
        if (!!askusButton && !askusComplete) {
            askusButton.style.display = 'block';

            const qrCodeScanner = document.getElementById('qrCodeScanner');
            console.log('qrCodeScanner = ', qrCodeScanner);
            const parentDiv = !!qrCodeScanner && qrCodeScanner.parentNode;
            console.log('parentDiv = ', parentDiv);
            !!parentDiv && !!qrCodeScanner && parentDiv.insertBefore(askusButton, qrCodeScanner);

            askusComplete = true;
        }

        // if _both_ have been moved, remove the original bar and stop looking
        if (!!homelinkComplete && !!askusComplete) {
            const nowEmptyHeader = document.getElementById('uq-site-header');
            console.log('nowEmptyHeader = ', nowEmptyHeader);
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
            console.log('primoUtilityBar = ', primoUtilityBar);
            !!primoUtilityBar && (primoUtilityBar.style.backgroundColor = '#ffffff');

            const libraryHeader = document.getElementById('content-container');
            console.log('libraryHeader = ', libraryHeader);
            const alertsBlock = document.getElementById('alert-container');
            console.log('alertsBlock = ', alertsBlock);
            // !!libraryHeader &&
            //     !!primoUtilityBar &&
            //     !!alertsBlock &&
            //     libraryHeader.insertBefore(primoUtilityBar, alertsBlock);

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

window.onresize = placeHomepageLinkNicely;

window.onload = console.log('window onload event noted');
