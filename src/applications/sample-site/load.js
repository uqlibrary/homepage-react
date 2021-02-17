function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// unfortunately, all these functions must repeat in every load.js - I couldnt get them to include from a common file
function resetDocumentScrollBar() {
    document.body.style.overflow = 'auto'; // the default homepage style blocks page scroll
}

function showElement(button) {
    button.style.display = 'block';
}

function showAskusButtonBlock() {
    const showForeignAskUsButton = setInterval(() => {
        const button = document.getElementById('askus-button-block');
        if (!!button) {
            showElement(button);
            clearInterval(showForeignAskUsButton);
        }
    }, 100); // check every 100ms
}

const isLoggedInButtonShowing = () => {
    return !!document.getElementById('logged-in-icon');
};

function showMyLibraryButtonBlock() {
    const showForeignMylibraryButton = setInterval(() => {
        const button = document.getElementById('mylibrary-button-block');
        if (!!button) {
            showElement(button);
            clearInterval(showForeignMylibraryButton);
        }
    }, 100);
}

function showAuthButtonBlock(isMyLibraryButtonRequired = false) {
    const showForeignAuthButton = setInterval(() => {
        const button = document.getElementById('auth-button-block');
        if (!!button) {
            showElement(button);
            clearInterval(showForeignAuthButton);

            !!isMyLibraryButtonRequired && isLoggedInButtonShowing() && showMyLibraryButtonBlock();
        }
    }, 100);
}

function showMegaMenuBlock() {
    const showMegaMenuButtonDesktop = setInterval(() => {
        const button = document.getElementById('desktop-megamenu-block');
        if (!!button) {
            button.style.display = 'flex';
            clearInterval(showMegaMenuButtonDesktop);
        }
    }, 100);
    const showMegaMenuButtonMobile = setInterval(() => {
        const button = document.getElementById('mobile-megamenu');
        if (!!button) {
            button.style.display = 'flex';
            clearInterval(showMegaMenuButtonMobile);
        }
    }, 100);
}

function showConnectFooterBlock() {
    const showConnectFooter = setInterval(() => {
        const elem = document.getElementById('connect-footer-block');
        if (!!elem) {
            elem.style.display = 'flex';
            clearInterval(showConnectFooter);
        }
    }, 100);
}

function showFooter() {
    const footerExists = setInterval(() => {
        const footer = document.getElementById('full-footer-block');
        if (!!footer) {
            clearInterval(footerExists);

            footer.style.display = 'block';

            document.body.append(footer.firstElementChild);

            const footerChild = document.getElementById('full-footer-block-child');
            !!footerChild && (footerChild.style.display = 'flex');
        }
    }, 100);
}

function loadReusableComponents() {
    // insert elements, even before React is loaded

    // first element of the original document
    const firstElement = document.body.children[0];

    // insert the react root for the react code to grab onto
    const reactRoot = document.createElement('div');
    reactRoot.setAttribute('id', 'headerfooter-react-root');
    reactRoot.setAttribute('class', 'layout-fill');
    reactRoot.setAttribute('style', 'height:auto');
    document.body.insertBefore(reactRoot, firstElement);

    resetDocumentScrollBar();

    // to have the Ask Us button appear, call this function
    // showAskusButtonBlock();

    // to have the login/logout button appear, call this function;
    // to also have the My Library button appear (when logged in), pass a parameter of true
    showAuthButtonBlock(true);

    // to have the mega menu appear, call this function;
    showMegaMenuBlock();

    showFooter();
    showConnectFooterBlock(); // dont try to show the connect footer if you dont also show the main footer
}

ready(loadReusableComponents);
