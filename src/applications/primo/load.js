function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// unfortunately, all these functions must repeat in every load.js - I couldnt get them to include from a common file
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

function showConnectFooterBlock() {
    const showConnectFooter = setInterval(() => {
        const elem = document.getElementById('connect-footer-block');
        if (!!elem) {
            elem.style.display = 'flex';
            clearInterval(showConnectFooter);
        }
    }, 100);
}

function showFooter(isFooterRequired = true, isConnectFooterRequired = true) {
    const footerExists = setInterval(() => {
        const footer = document.getElementById('full-footer-block');
        if (!!footer) {
            clearInterval(footerExists);

            if (!!isFooterRequired) {
                document.body.append(footer.firstElementChild);

                const footerChild = document.getElementById('full-footer-block-child');
                !!footerChild && (footerChild.style.display = 'flex');

                !!isConnectFooterRequired && showConnectFooterBlock();
            } else {
                footer.style.display = 'none';
            }
        }
        document.body.style.overflow = 'auto'; // the default homepage style blocks page scroll
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

    showAskusButtonBlock();

    // no auth button

    showFooter(false); // no footer

    ready(loadReusableComponents);
}

ready(loadReusableComponents);
