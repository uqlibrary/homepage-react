# HOMEPAGE-REACT

[![Codebuild Status for uqlibrary/homepage-react](https://codebuild.ap-southeast-2.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoiSUhCeGFUaW5iaHMyYjNIcnNWTGJMOTA3eThjRFFTYVhyY3NiSDVTWlJlbnl5VllnUHlvRzVyeWdhYW52VnduNUNzbDBPZUkreVFvUTFkQkhyQ0YxZUJZPSIsIml2UGFyYW1ldGVyU3BlYyI6IldlOVk5dlVxU0ROSE5IaDciLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/homepage-master/view?region=ap-southeast-2)

A repo for the Library of The University of Queensland website homepage

[Instructions for User Admins](docs/admin-howto.md)

## Technology

- Code: `React (~16.8), Javascript (ES2015 - Babel), Immutable, SASS`
- State: `Redux, ReduxForm`
- Design: `Google Material Design` - [Material UI](https://v0.material-ui.com/#/components/app-bar)
- Build and dev tools: `Webpack`
- Unit tests: `Jest`
- E2E tests: `Cypress`
- WCAG tests: `Cypress/aXe`

This project is using `npm` for dependency management. Make sure `npm` is installed on your machine.

## Installation

1. Clone from github

2. Create a .env file based on example.env

3. install npm: `nvm use 18.19.0 && npm i -g npm@10 jest webpack-dev-server` (current npm is 10.5.0)
 
4. Create these git hooks to manage branches to project standard: 

- `ln -sf "../../scripts/pre-commit" ".git/hooks/pre-commit"`

  (Prevent direct commits to the staging branches and run `prettier-eslint` automatically before every local commit)

- `ln -sf "../../scripts/prepare-commit-msg" ".git/hooks/prepare-commit-msg"`

  (Prevent accidental merges from the staging branches:)

## Development

This project is using `npm` for dependency management. Make sure `npm` is installed on your machine.

- make sure you have created a .env file based on example.env
- `nvm use 16.20.2 && npm i -g npm@8 jest webpack-dev-server` - initial setup
- `npm ci` - when weird errors happen your local npm probably doesnt match the latest project requirements, this clears & reinstalls npm packages
- `npm run start:mock` to use mock data from src/mock
  - runs <http://localhost:2020/>
- `npm run start:url` to use api
  - runs <http://dev-homepage.library.uq.edu.au:2020/#/>
  - add `dev-homepage.library.uq.edu.au` to your /etc/hosts file using your local LAN IP address - as the start script binds local port 2020 to host dev-homepage.library.uq.edu.au, this will result in binding to your local running dev environment)
  - to use staging data from the aws api as a backend set API_URL in .env to `https://api.library.uq.edu.au/staging/` (You can only access staging api if you are on a UQ IP address, eg VPN)
  - to use api locally as a backend, set API_URL in .env to `http://dev-api.library.uq.edu.au:8050/` and bring up api repo [(cf)](https://github.com/uqlibrary/api)
  - you may need to block CORS errors - eg with [Allow CORS: Access-Control-Allow-Origin](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf) Chrome Extension, or by launching the browser with CORS disabled.

      ```sh
      google-chrome --disable-web-security --user-data-dir=/tmp/chrome-dev
      ```

    - You will also need to run Chrome in no-security mode by adding the alias `alias chrome-no-cors='/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --disable-web-security --user-data-dir=~/chrome-dev-profile > /dev/null 2>&1'` and then running chrome by `chrome-no-cors`. or `open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security`

  - for Hot Reloading to work in IntelliJ products, turn "safe write" off in the settings
  - for a logged in session, add UQLID and UQLID_USER_GROUP cookies for logged-in users (values can be found under Developer Tools -> Application Tab -> Cookies after logging into https://www.library.uq.edu.au/)
    - Examples `UQLID: HJDFhjdiuere893434uieruiNMDFND90a` `UQLID_USER_GROUP: LIBRARYSTAFFB`

  - Alternative logged in session: `./scripts/dev-tools.sh start:staging-session` or `SESSION_COOKIE_NAME='mysessiontoken' npm run start:url`
    ('mysessiontoken': your session token can be seen by logging in at library.uq.edu.au then inspecting any of the api requests for the `x-uql-token` value)

- `npm run start:build`
  - runs production build version on <http://dev-homepage.library.uq.edu.au:9000/> and `http://localhost:9000/`
  - uses PRODUCTION DATA from the aws api (ie `https://api.library.uq.edu.au/v1/1) as a backend!! Careful!!
- `npm run start:build:e2e`
  - runs production build version on <http://localhost:9000/>
  - uses mock data from src/mock
  - async loading is not working since chuncks are not saved, navigate directly to required routes
- `npm run test:cs`
  - Runs Prettier and ESLint checks on all Javascript files in the project, then lists files with code style issues. Check the other npm scripts for ways to fix the issues automatically if possible.
- `npm run test:cc`
  - Runs all tests with code coverage checks. HTML report will be available under `coverage`. Needs to start localhost itself - kill any mock instance you have running before run. See Coverage notes below

Mock data is provided for all pages and actions under `src/mock/`.

### Development notes

#### Naming conventions

- React components and files of components and related files (eg scss) are to be named with upper case (eg
  MenuDrawer.js). Do not add UQ, UQLibrary or similar prefixes to components
- Other files are to be named with lower case (eg index.js, reducerX.js)
- data-testid attributes are used for tests
- data-analyticsid attributes are used for GTM/GA tagging.

##### Action types naming conventions

- _Action transformers naming_: use [verb][noun] format (if appropriate) to indicate what method returns, eg
  unclaimRecordContributorsIdSearchKey(), getRecordContributorsIdSearchKey(), etc
- Keep to the following naming format `[OBJECT]_[STATUS]` or `[NOUN]_[VERB]`:

- LATEST_PUBLICATIONS_LOADING
- LATEST_PUBLICATIONS_LOADED
- LATEST_PUBLICATIONS_FAILED

or

- APP_ALERT_SHOW
- APP_ALERT_HIDE

### Auth

The cookie that holds the UQLID token ('SESSION_COOKIE_NAME') is set by the return of the account api.

#### Optimisation

to keep initial load to a minimum following optimisation has been added to the project:

- Async (lazy) loading of non-essential (essential components are only those components user can see on public pages
  when not authenticated)
- Splitting essential vendor libraries out ('react', 'react-dom', 'react-router-dom', 'redux', 'react-redux') - those
  libraries do not change often and will be cached by the browser
- Optimise rendering of the components (in ReactJs 15 use react-addon-perf) to minimize wasteful rendering of
  components, implement PureComponent or shouldComponentUpdate()
- Locale package is split into smaller chunks to avoid loading it all at once:
  - publicationForm.js locale is loaded only when PublicationForm component is loaded
  - Other locale files are not too big, all bundled into one for now

### Webpack

#### version: 4

##### Webpack plugins

- SplitChunksPlugin

  ```javascript
  optimization: {
        splitChunks: {
            automaticNameDelimiter: '-',
            cacheGroups: {
                commons: {
                    chunks: 'all'
                }
            }
        },
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                parallel: true
            })
        ]
    },
  ```

- Terser/tree shake: used with split chunks built-in plugin in webpack 4

  ```javascript
  new TerserPlugin({ sourceMap: true });
  ```

- minify in deployment:

  ```javascript
  new webpack.DefinePlugin({
    __DEVELOPMENT__: !process.env.CI_BRANCH,                    //  always production build on CI
    'process.env.NODE_ENV': JSON.stringify('production'),       //  always production build on CI
    ...
  })
  ```

### Gotchas

- Because FE is served from Cloudfront, add a behaviour to Cloudfront to serve any css/js filename patterns. E.g. behaviours have been
  added for `main-*` and `commons-*` files.
- Content Security Policies (CSP) are provided from Cloudfront - https://github.com/uqlibrary/cffx-add-security-headers

#### Optimisation Guidelines

- try to simplify props
- components should extend React.PureComponent if props are simple (if you fallback to a Class component)
- class components should extend React.Component, shouldComponentUpdate() should be implemented if props have objects
- import explicit and specific components (do not import all):
  - _DO NOT_ `import { Button } from 'material-ui';`
  - _DO_ `import { Button } from 'material-ui/Button';`
- any set of components which is not required in the initial load, eg PublicationForm, FixForm, ClaimForm etc, should
  lazy loaded using `<Async>`

  ```jsx
  const PublicationsList = (componentProps) => (<Async load={import ('modules/SharedComponents/PublicationsList/components/PublicationsLis t')}  componentProps={componentProps} />);
  ...
  <PublicationsList {...props} />
  ```

- make sure to check BundleAnalyzerPlugin output locally by running `npm run build` or `npm run analyse`:
  - main-###.js file should not exceed 1Mb
  - main-###.js should not include any non-essential libraries

### Exception handling

- any custom reject() by promises should return an object with status and message defined
  `{status: 401, message: 'Unauthorised user'}`
  [Example](https://github.com/uqlibrary/homepage-react/blob/master/src/repositories/account.js#L13)
- any custom catch() methods of promises should process known errors and throw other errors.
  [Example](https://github.com/uqlibrary/homepage-react/blob/master/src/modules/App/actions.js#L27)

## Testing

### Unit testing

Jest is used as testing tool for unit tests. Any HTMl markup is to be tested with snapshots.

- install jest `npm install jest -g`
- run tests `npm test`

Before committing changes, locally run tests and update stapshots (if required). To update snapshots run
`npm run test:unit:update`.

[Code coverage](coverage/jest/index.html) is available (after running `npm test`)

#### Guidelines

- [Action creators](https://github.com/uqlibrary/homepage-react/blob/master/src/actions/README.md#testing)
- [Rendered components](https://github.com/uqlibrary/homepage-react/blob/master/src/modules/README.md#testing)
- [Reducers](https://github.com/uqlibrary/homepage-react/blob/master/src/reducers/README.md#testing)

### E2E testing

We are using [Cypress](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file) for
our e2e UI testing.

To run tests, first start the build, using mock data, ie `npm run start:mock`

Then:

- use `npm run cypress:run`
- or to open the Cypress UI use `npm run cypress:open`
- or to watch the tests `npm run cypress:watch`.

Note: Ensure your .env is configured to use API_URL `https://api.library.uq.edu.au/staging/` when attempting to run cypress tests for full coverage, or whilst using cypress:run or cypress:open, otherwise your cypress tests may fail to run.

Before pushing to a branch make sure to run `npm run test:all`. This runs the unit and cypress tests.

AWS pipeline runs `npm run test:e2e:ci` as it spins up a webpack-dev-server and serves the frontend with mock data to run tests for now until we have API integration with docker, but only in `master` branch.

You can watch video recordings of any failed test runs and view some debug messages via the [Cypress dashboard](https://dashboard.cypress.io/projects/mvfnrv/runs). We have open-source license which allows unlimited runs.

To manage the account, the admin username/pass is in PasswordState under "GitHub Cypress.io Admin User" (login to Github as this user, then use the github account to log into Cypress).

If you want Codeship to run cypress tests before you merge to master, include the text `cypress` in the branch name and push and cypress tests will be run on that branch (set up in bin/codeship-test.sh).

#### Standardised selectors to target elements

- We are following the best practice recommended by cypress to target elements using `data-testid` attribute

- Please have a look at below table for some current examples in eSpace frontend:

| Element   | prop for ID               | ID attached to native elements for targetting                   |
| --------- | ------------------------- | --------------------------------------------------------------- |
| TextField | `textFieldId="rek-title"` | `<input id="rek-title-input"/>` `<label id="rek-title-label"/>` |

#### Some tricks and tips

- the message 'Failed to connect to the bus' is not a problem per https://docs.cypress.io/guides/references/troubleshooting#Run-the-Cypress-app-by-itself
- When simulating clicks, use `cy.waitUntil()` to wait for the page to have loaded.
  Very rarely, you might need to eg `cy.wait(1000);` to wait 1 second after the click before posing any expectations - 
  an example is the Axe accessibility checks which seem to simply take some time before the functionality is available.
- sometimes a button is detached from the DOM when you go to click it. We have a helper called `clickButton` which usually gets around this.
  Note that we've had success by shifting the test up in the list when this happens (cypress seems to have memory problems at this scale?)
- For a input field that has a problem clearing, first try adding a `.focus()`, if that isnt sufficient try eg
  `.should('have.value', 'Example alert:')`
- Custom cypress commands can be added to `cypress/support` to abstract out common actions. For example:

  - When the form you are writing tests for has a browser alert box to prevent navigating away before its complete, add this to the top of your test to unbind the unload event handler. The issue might only present itself when trying to do another test by navigating to a new url, which never finishes loading because the browser is waiting for the alert from the previous page to be dismissed, which is actually not visible in Cypress UI!

    ```javascript
    afterEach(() => {
      cy.killWindowUnloadHandler();
    });
    ```

  - When using the MUI dialog confirmation, use the following for navigating to the homepage:

    ```javascript
    cy.navToHomeFromMenu(locale);
    ```

    where `locale` is:

    ```javascript
    {
      confirmationTitle: '(Title of the confirmation dialogue)',
      confirmButtonLabel: '(Text of the "Yes" button)'
    }
    ```

    See `cypress/support/commands.js` to see how that works.

- If a test occasionally fails as "requires a DOM element." add a `.should()` test after the `.get()`, to make it wait for the element to appear (`.should()` loops)

- example of testing a click away from the page:
```javascript
    cy.intercept(/uqbookit/, 'user has navigated to Bookit page');
    cy.visit('/');
    cy.viewport(1300, 1000);

    cy.get('[data-testid="homepage-hours-bookit-link"]')
            .should('contain', 'Book a room')
            .click();
    cy.get('body').contains('user has navigated to Bookit page');
```
- if you need to check pattern matching on an element attribute, this is one way to do it:
```javascript
    cy.get('[data-testid="computers-library-1-level-4-button"]')
        .should('have.attr', 'aria-label')
        .then(ariaLabel => {
            expect(ariaLabel).to.contains('Biological Sciences Library level 4. 72 free of 110 computers');
        });
```
### Code Coverage

We require 100% coverage, but untestable/ unvaluable sections can be exlcude with istanbul (search the code base for examples)

To run the complete test suite and get code coverage, run `npm run test:cc`

This will run unit tests (jest) and e2e tests (cypress) and then merge the coverage of the 2 to give complete coverage. Coverage reports are at `coverage/index.html` after the run.

(make sure the local mock server is NOT running before cypress begins or coverage doesnt work)

This will wipe previous coverage file.

On the server, coverage is checked on these branches: production, master, staging and any branch whose name includes the string 'coverage'

AWS Coverage checking is split between the two pipelines, both to make the run quicker, and because it reduces test flakiness. The package,json has a group of `!` lines in the nyc exclude section. The `bin/codebuild-test.sh` script will reverse some of these for each pipeline (but they are _not excluded_ in a local run, meaning we can split in pipeline on AWS and still check coverage locally!).  

## Mocking

To run website on mock data run `npm run start:mock` webserver will start on `http://localhost:2020/`

The project allows the user to "login" as any test user. Simply add `?user=<username>` to the request and it will log
you in as that user. Usernames can be found in the `src/mock/data/accounts.js` file.

- anonymous user: <http://localhost:2020/?user=anon>
- researcher user: <http://localhost:2020/?user=uqresearcher>
- staff/not author user (has admin): <http://localhost:2020/?user=uqstaff>
- undegrad student user: <http://localhost:2020/?user=s1111111>
- postgrad student user: <http://localhost:2020/?user=s2222222>
- RHD submission form: <http://localhost:2020/rhdsubmission?user=s2222222>
- user with expired token: <http://localhost:2020/?user=uqexpired>
- user who has readonly masquerade (but not admin): <http://localhost:2020/?user=uqmasquerade>
- user who can do CSV Ingest: <http://localhost:2020/?user=digiteamMember>

So an example staff link for an example admin edit page will be <http://localhost:2020/admin/edit/UQ:358319?user=uqstaff>

The following access is required:

| User type          | masquerade | admin | Resulting access                               |
| ------------------ | ---------- | ----- | ---------------------------------------------- |
| general user       | false      | false | no masquerade, no admin, no csv ingest         |
| support staff      | readonly   | false | readonly masquerade, no admin, no csv ingest   |
| admin or developer | full       | true  | full masquerade, admin, csv ingest             |
| digiteam           | false      | true  | no masquerade, admin (side effect), csv ingest |

masquerade - on account record (CURRENT_ACCOUNT_API) eg <https://api.library.uq.edu.au/staging/account>, canMasquerade = true or false; when true, masqueradeType = full or readonly

admin - on author record (AUTHOR_DETAILS_API) eg <https://api.library.uq.edu.au/staging/authors/details/uqldegro>, is_administrator = 0 or 1

(there is also is_super_administrator, 0 or 1, which gives access to the security tab)

## Reviewing

A Self-review checklist is [here](https://uq.sharepoint.com/:w:/r/teams/lbf4g4a1/LTSDevelopers%20Documents/Standards/React%20self%20code%20review%20checklist.docx?d=w0b91b7dfd85d4f14bf624da7c4de1821&csf=1&web=1&e=RZs5Ka) in
the ISRS Collection.

Ask for review from team-mates if you'd like other eyes on your changes.

## Deployment

Application deployment is 100% automated using AWS Codebuild (and Codepipeline), and is hosted in S3. All testing and deployment commands and configuration are stored in the buildspec yaml files in the repo. All secrets (access keys and tokens for PT, Cypress, Sentry and Google) are stored in AWS Parameter Store, and then populated into ENV variables in those buildspec yaml files.
Deployment pipelines are setup for branches: "master", "staging, "production" and several key branches starting with "feature-".

- You must always copy Master branch to staging/production (idally, staging before master and alow the e2es to run before yu go to master and prod)
- Deployments to production are visitable on <https://homepage-production.library.uq.edu.au/> and <https://www.library.uq.edu.au/>
- Deployments to staging are visitable on <https://homepage-staging.library.uq.edu.au/>
- Some other branches are visitable on <https://homepage-development.library.uq.edu.au/branchName/>. (Only certain branches are deployed now we are using AWS - [How to create a new CodePipeline](https://uq.sharepoint.com/:w:/r/teams/lbf4g4a1/LTSDevelopers%20Documents/How-to/(needs%20revision)%20Create%20a%20new%20CodePipeline.docx?d=wf0198aaec9ad4037b408a224cc8497b6&csf=1&web=1&e=JkoB3W))
- Note: avoid certain words in your branch name, eg exams - Cloudfront overrides these routes and you won't be able to view the deployment.
  See [Cloudfront list of reserved routes](https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-east-1&skipRegion=true#/distributions/E34LPPV7N4XONM/behaviors)
- Homepage branch staging is used to test changes to repo reusable-webcomponents that affect Homepage by calling the *staging* branch of reusable. All other branches of homepage display the *production* branch of reusable. Instructions:

    * merge your reusable-webcomponents feature branch into reusable-webcomponents staging branch & push and allow to build
    * if you have homepage changes merge them into homepage feature branch staging & push and allow to build
    * load <https://homepage-staging.library.uq.edu.au/> (View Source to confirm it is loading the staging reusable file: <https://assets.library.uq.edu.au/reusable-webcomponents-staging/uq-lib-reusable.min.js">)

Staging/production build has routing based on `createBrowserHistory()`, other branches rely on `createHashHistory()` due
to URL/Cloudfront restrictions

## Google Analytics integration

Homepage includes GTM (Google Tag Manager). GTM is set at webpack build time in webpack configuration. It can be
setup as an environmental variable at CI level if required.

GTM is very flexible and easy to configure to track required events. See more details on
[Google Analytics](https://www.google.com.au/analytics/tag-manager/)


## To work with api locally

- bring up local [api](https://github.com/uqlibrary/api) repo (cf - tl;dr `./scripts/dev-tools.sh up`), remembering to run the seeders relevant to your needs
- change .env to have value `API_URL='http://dev-api.library.uq.edu.au:8050/'`
- start `npm run start:devapi`
- possibly use a non-cors browser?
- open <http://localhost:2020/> if it didnt open automatically
- get the values of your cookies, UQLID and UQLID_USER_GROUP, from library.uq.edu.au and set them in localhost:2020
- I think thats everything

Remember to change the .env back after! (NB: You will need to restart `npm run start` for a change in .env to take effect).
