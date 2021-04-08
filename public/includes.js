function insertScript(url) {
    let script = document.querySelector("script[src*='" + url + "']");
    if (!script) {
        const heads = document.getElementsByTagName('head');
        if (heads && heads.length) {
            const head = heads[0];
            if (head) {
                script = document.createElement('script');
                script.setAttribute('src', url);
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('defer', '');
                head.appendChild(script);
            }
        }
    }
}

/*
 * valid paths:
 * http://localhost:2020/ will load https://localhost:8080/uq-lib-reusable.min.js
 * http://localhost:2020/?reusablebranch=master will load https://assets.library.uq.edu.au/reusable-webcomponents-development/master/uq-lib-reusable.min.js
 * https://homepage-development.library.uq.edu.au/feature-drupal/#/ will load https://assets.library.uq.edu.au/reusable-webcomponents-development/feature-drupal/uq-lib-reusable.min.js
 * https://homepage-development.library.uq.edu.au/feature-leadegroot-1/#/?reusablebranch=primo-prod-dev will load https://assets.library.uq.edu.au/reusable-webcomponents-development/primo-prod-dev/uq-lib-reusable.min.js
 * https://homepage-staging.library.uq.edu.au/ loads https://assets.library.uq.edu.au/reusable-webcomponents-staging/uq-lib-reusable.min.js
 * https://www.library.uq.edu.au/ loads https://assets.library.uq.edu.au/reusable-webcomponents/uq-lib-reusable.min.js
 */

const isLocal = window.location.hostname === 'localhost';

const isDev = window.location.hostname === 'homepage-development.library.uq.edu.au';
// list of valid branches found in reusable-webcomponents AWS pipeline deployments (if not in AWS you will get a 404)
const branchList = [
    'feature-leadegroot',
    'feature-drupal',
    'master',
    'primo-prod-dev',
    'primo-sandbox',
    'primo-sandbox-dev',
    'production',
    'staging',
];
const devBranch = branchList.filter(branchName => {
    const regex = new RegExp(`reusablebranch=${branchName}`);
    return window.location.pathname.startsWith(`/${branchName}/`) || regex.test(window.location.search);
});
const branch = devBranch.length === 1 ? devBranch.pop() : 'master';

const devPath = `reusable-webcomponents-development/${branch}`;

const isStaging = window.location.hostname === 'homepage-staging.library.uq.edu.au';
const stagingPath = 'reusable-webcomponents-staging';

const prodPath = 'reusable-webcomponents';

// eslint-disable-next-line no-nested-ternary
const path = isDev ? devPath : isStaging ? stagingPath : prodPath;
const assetRoot = 'https://assets.library.uq.edu.au';

const remoteFile = `${assetRoot}/${path}/uq-lib-reusable.min.js`;
const localFile = new RegExp('reusablebranch=').test(window.location.search)
    ? `${assetRoot}/${devPath}/uq-lib-reusable.min.js`
    : 'http://localhost:8080/uq-lib-reusable.min.js';

const scriptUrl = isLocal ? localFile : remoteFile;
insertScript(scriptUrl);
