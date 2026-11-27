/* eslint-disable no-var */
var browserUpdate = require('browser-update');
var buConfig;

function showBrowserOutdatedError(browserDesc) {
    var reactRoot = document.getElementById('react-root');
    var browserUpdateOrgMessage = document.getElementById('buorg');
    if (reactRoot && !reactRoot.hasChildNodes()) {
        document.body.removeChild(browserUpdateOrgMessage);
        document.getElementById('browser-name').innerHTML = browserDesc;
        document.getElementById('old-browser-error').setAttribute('style', '');
    }
}

function triggerBrowserUpdate() {
    browserUpdate(buConfig);
}

function configureBu() {
    // customisation details at https://browser-update.org/customize.html
    buConfig = {
        required: { e: -1, i: 12, f: -1, s: -1, c: -1 },
        insecure: true,
        style: 'top',
        shift_page_down: true,
        api: 2021.03,
        onshow: function f(buObj) {
            var browserDesc = 'This version of your browser (' + buObj.browser.t + ')';
            if (buObj.browser.t.indexOf('Internet Explorer') > -1) {
                browserDesc = 'Internet Explorer';
            }
            showBrowserOutdatedError(browserDesc);
        },
    };

    try {
        document.addEventListener('DOMContentLoaded', triggerBrowserUpdate, false);
    } catch (e) {
        window.attachEvent('onload', triggerBrowserUpdate);
    }
}

configureBu();

export default configureBu;
