function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function removeFooter() {
    // It looks like there is a weird thing happening where the footer appears as a shadow sometimes
    // Rather than just hide the footer, delete it completely
    const footerExists = setInterval(() => {
        const footer = document.getElementById('full-footer-block');
        if (!!footer) {
            footer.parentNode.removeChild(footer);

            clearInterval(footerExists);
        }
    }, 300); // check for div periodically
}

function placeHomepageLinkNicely(calledonResize = false) {
    // calledonResize temp for debugging
    console.log('placeHomepageLinkNicely called - calledonResize = ', calledonResize);

    const homeLinkButton = document.getElementById('uq-site-header-home-button');
    console.log('placeHomepageLinkNicely: homeLinkButton = ', homeLinkButton);

    if (!!homeLinkButton) {
        // align the link-to-homepage with left border of content
        const box1 = document.getElementsByTagName('md-content')[0] || false;
        const box1WidthAttribute = !!box1 ? window.getComputedStyle(box1, null).getPropertyValue('padding-left') : 0;
        console.log('placeHomepageLinkNicely: box1WidthAttribute = ', box1WidthAttribute);
        const box1Width = parseInt(box1WidthAttribute.replace('px', ''), 10);
        console.log('placeHomepageLinkNicely: box1Width = ', box1Width);
        let box2 = box1.firstChild.nextSibling;
        console.log('placeHomepageLinkNicely: box2 = ', box2);
        if (JSON.stringify(box2) === '{}') {
            // detect <!----> left by angular
            box2 = box2.nextSibling;
            console.log('placeHomepageLinkNicely: got comment - now box2 = ', box2);
        }
        const box2Width = !!box2 ? box2.offsetWidth : 0;
        console.log('placeHomepageLinkNicely: box2Width = ', box2Width);

        const mainMenu = document.getElementsByTagName('prm-main-menu')[0] || false;
        const mainMenuLeft = mainMenu.offsetLeft || 0;
        console.log('placeHomepageLinkNicely: mainMenuLeft = ', mainMenuLeft);

        const homeLinkMarginLeft = mainMenuLeft - (box2Width + box1Width);
        console.log('placeHomepageLinkNicely: homeLinkMarginLeft = ', homeLinkMarginLeft);
        // const homeLinkLeft = box2Width + box1Width;
        // console.log('placeHomepageLinkNicely: homeLinkLeft = ', homeLinkLeft);

        // const uqheader = document.getElementById('uqheader');
        // const uqheaderheight =
        //     !!uqheader && !!uqheader.getBoundingClientRect() ? uqheader.getBoundingClientRect().height : 0;
        // console.log('placeHomepageLinkNicely: uqheaderheight = ', uqheaderheight);

        // const alertContainer = document.getElementById('alert-container');
        // const alertHeight =
        //     !!alertContainer && !!alertContainer.getBoundingClientRect()
        //         ? alertContainer.getBoundingClientRect().height
        //         : 0;
        // console.log('placeHomepageLinkNicely: alertHeight = ', alertHeight);
        // const homeLinkTop = uqheaderheight + alertHeight + 6; // it needs a little offset within the div
        // console.log('placeHomepageLinkNicely: homeLinkTop = ', homeLinkTop);

        // !!homeLinkButton && (homeLinkButton.style.left = `${homeLinkLeft}px`);
        !!homeLinkButton && (homeLinkButton.style.marginLeft = `-${homeLinkMarginLeft}px`);
        // !calledonResize && !!homeLinkButton && (homeLinkButton.style.top = `${homeLinkTop}px`);
        // !!homeLinkButton && (homeLinkButton.style.position = 'absolute');
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
        console.log('mergeUtilityAreaAndPrimoLoginBar: homeLinkButton = ', homeLinkButton);
        if (!!homeLinkButton && !homelinkComplete) {
            const mainMenu = document.getElementsByTagName('prm-main-menu')[0] || false;
            console.log('mergeUtilityAreaAndPrimoLoginBar: mainMenu = ', mainMenu);

            // put position relative on the  homepage button parent so button absolute is relative to it
            // !!mainMenu && (mainMenu.style.position = 'relative');

            // move the link-to-homepage into primo login bar
            let firstchild = mainMenu.firstChild;
            if (JSON.stringify(firstchild) === '{}') {
                // detect <!----> left by angular
                firstchild = firstchild.nextSibling;
                console.log('mergeUtilityAreaAndPrimoLoginBar: got comment - now firstchild = ', firstchild);
            }
            !!firstchild && console.log('mainMenu.firstChild = ', firstchild);
            !!mainMenu && !!mainMenu.firstChild && mainMenu.insertBefore(homeLinkButton, firstchild);

            placeHomepageLinkNicely();

            homelinkComplete = true;
        }

        // move the askus button into primo login bar
        const askusButton = document.getElementById('askus-button-block');
        console.log('mergeUtilityAreaAndPrimoLoginBar: askusButton = ', askusButton);
        if (!!askusButton && !askusComplete) {
            askusButton.style.display = 'block';

            const qrCodeScanner = document.getElementById('qrCodeScanner');
            console.log('mergeUtilityAreaAndPrimoLoginBar: qrCodeScanner = ', qrCodeScanner);
            // const parentDiv = !!qrCodeScanner && qrCodeScanner.parentNode;
            const parentDiv = document.getElementsByTagName('prm-search-bookmark-filter')[0] || false;
            console.log('mergeUtilityAreaAndPrimoLoginBar: parentDiv = ', parentDiv);

            // I think its this one that is problematic
            // !!parentDiv && !!qrCodeScanner && parentDiv.insertBefore(askusButton, qrCodeScanner);

            askusComplete = true;
        }

        // if _both_ have been moved, remove the original bar and stop looking
        if (!!homelinkComplete && !!askusComplete) {
            const nowEmptyHeader = document.getElementById('uq-site-header');
            console.log('mergeUtilityAreaAndPrimoLoginBar: nowEmptyHeader = ', nowEmptyHeader);
            !!nowEmptyHeader && (nowEmptyHeader.style.display = 'none');

            clearInterval(mergeAreas);
        }
    }, 300); // check for div periodically
}

function moveAlertsBelowPrimoLoginBar() {
    const moveAlertsArea = setInterval(() => {
        console.log('looking for alerts');
        const libraryHeader = document.getElementById('content-container');
        const alertChild = document.getElementById('alert-container');
        if (!!alertChild && !!libraryHeader) {
            console.log('found alerts');
            // the primo uq logo is invisible, but still exist in the dom
            // and can be used to get its parent, which doesnt have an id
            const primoLogo = document.getElementsByTagName('prm-logo')[0] || false;
            const primoUtilityBar = !!primoLogo && primoLogo.parentNode;
            console.log('moveAlertsBelowPrimoLoginBar: primoUtilityBar = ', primoUtilityBar);
            !!primoUtilityBar && (primoUtilityBar.style.backgroundColor = '#ffffff');

            const libraryHeader = document.getElementById('content-container');
            console.log('moveAlertsBelowPrimoLoginBar: libraryHeader = ', libraryHeader);
            const alertsBlock = document.getElementById('alert-container');
            console.log('moveAlertsBelowPrimoLoginBar: alertsBlock = ', alertsBlock);
            // !!libraryHeader &&
            //     !!primoUtilityBar &&
            //     !!alertsBlock &&
            //     libraryHeader.insertBefore(primoUtilityBar, alertsBlock);

            placeHomepageLinkNicely();

            // try putting the listeners on when the page is mostly done
            window.onresize = placeHomepageLinkNicely(true);
            // window.addEventListener('resize', placeHomepageLinkNicely(true));
            console.log("window.addEventListener('resize', placeHomepageLinkNicely(true)); set");

            window.onload = console.log('window onload event noted');
            // check it is running with getEventListeners(document);

            clearInterval(moveAlertsArea);
        }
    }, 300); // check for div periodically
}

function loadReusableComponents() {
    // the react root is inserted via angular in the Primo custom.js file, within the Primo View Package

    removeFooter();

    mergeUtilityAreaAndPrimoLoginBar();

    // no megamenu

    // no auth button

    moveAlertsBelowPrimoLoginBar();
}

ready(loadReusableComponents);
