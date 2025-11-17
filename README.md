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
- E2E tests: `Playwright`
- WCAG tests: `@axe-core-npm/playwright`

This project is using `npm` for dependency management. Make sure `npm` is installed on your machine.

## Installation

1. Clone from github

2. Create a .env file based on example.env

3. install npm: `nvm use 22 && npm i -g npm jest webpack-dev-server`
 
4. Create these git hooks to manage branches to project standard: 

- `ln -sf "../../scripts/pre-commit" ".git/hooks/pre-commit"`

  (Prevent direct commits to the staging branches and run `prettier-eslint` automatically before every local commit)

- `ln -sf "../../scripts/prepare-commit-msg" ".git/hooks/prepare-commit-msg"`

  (Prevent accidental merges from the staging branches:)

## Development

This project is using `npm` for dependency management. Make sure `npm` is installed on your machine.

- make sure you have created a .env file based on example.env
- `nvm use 22 && npm i -g npm jest webpack-dev-server` - initial setup
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

#### Reusable components

`standardText` 

Apply the standard DS styles to any item. Can be used like this:

```javascript
export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
   ...standardText(theme),
}));
```

Three buttons, from the [DS](https://design-system.uq.edu.au/storybook-html/index.html?path=/docs/components-button--docs)

* `StyledPrimaryButton`
* `StyledSecondaryButton`
* `StyledTertiaryButton`

These are tags, so can be used like: `<StyledPrimaryButton>Click me</StyledPrimaryButton>`

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

Jest is used as testing tool for unit tests. 

- install jest `npm install jest -g`
- run tests `npm test`

Before committing changes, locally run tests and update any remaining stapshots (if required). To update snapshots run
`npm run test:unit:update`.

[Code coverage](coverage/jest/index.html) is available (after running `npm test`)

#### Guidelines

- [Action creators](https://github.com/uqlibrary/homepage-react/blob/master/src/actions/README.md#testing)
- [Rendered components](https://github.com/uqlibrary/homepage-react/blob/master/src/modules/README.md#testing)
- [Reducers](https://github.com/uqlibrary/homepage-react/blob/master/src/reducers/README.md#testing)

### Interactive testing

We use [Playwright](https://playwright.dev/docs/writing-tests) for our interactive testing.

To run tests, simply use `npm run test:e2e`.

To run all tests, including unit tests, use `npm run test:all`.\
Then, to generate a combined code coverage report, use `npm run cc:reportAll`.\
This workflow is useful for confidently pushing changes upstream.

#### To test data sent to the api is as-expected

In the component, save the sent data to a cookie (only when on localhost), so: just before the call to the action that sends a save request to the api, include code like:
```javascript
const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
if (!!cypressTestCookie && window.location.host === 'localhost:2020' && cypressTestCookie === 'active') {
    setCookie('CYPRESS_DATA_SAVED', valuesToSend);
}
```
eg https://github.com/uqlibrary/homepage-react/blob/8b9cd9d7902449e45c8285eabf36c0b368a34a4b/src/modules/Pages/Admin/BookableSpaces/ManageLocations/BookableSpacesManageLocations.js#L327

Then in the test, start the test function with a setup call
```javascript
await setTestDataCookie(context, page);
```
eg https://github.com/uqlibrary/homepage-react/blob/8b9cd9d7902449e45c8285eabf36c0b368a34a4b/playwright/tests/adminPages/spaces/bookablespacesAddNew.spec.ts#L70

and then test the values you are expecting were what was sent to the api:
```javascript
const expectedValues = {
    space_floor_id: 1,
    space_name: 'W12343',
    space_type: 'Computer room',
};
await assertExpectedDataSentToServer(page, expectedValues);
```
eg https://github.com/uqlibrary/homepage-react/blob/8b9cd9d7902449e45c8285eabf36c0b368a34a4b/playwright/tests/adminPages/spaces/bookablespacesAddNew.spec.ts#L90

#### Parallelism

E2E tests run in [parallel](https://playwright.dev/docs/test-parallel) by default. In CI, this also includes **horizontal parallelism**  
via test sharding, where they are split across independent CI steps to speed up execution.

Unfortunately, Playwright doesn't support splitting tests based on their estimated or historical runtime. For this reason,
to avoid test sharding imbalances, where one shard takes significantly longer than the others, please consider splitting
lengthy tests into multiple smaller ones.

#### Debugging

By default, Playwright runs tests using a headless browser.
To visualize tests in the browser, use `npm run test:e2e:show [?spec file]`.\
This disables test parallelism for convenience.

Breakpoints are handy for pausing either the test execution (via IDE integration) or the code execution (via the `debugger` keyword or manual breakpoints).
PhpStorm provides seamless integration.

##### Failed tests

To debug a failed test, use:\
`npm run test:e2e:debug playwright/.results/.../trace.zip`\
This displays a storyline of the failed test using the [Playwright Trace Viewer](https://playwright.dev/docs/trace-viewer-intro),\
where all sorts of detailed inspections are possible - network, DOM elements, etc.

###### CI

The above also applies to tests that fail on CI. In this case, the trace files need to be downloaded locally first. They
are part of the artifacts uploaded to S3 as output of each test stage - please refer to the "Artifacts" section on
the "Build Details" tab.

Instructions on how to download and use the trace files from failed tests on AWS can be found [in our Sharepoint developer docs](https://uq.sharepoint.com/:w:/r/teams/lbf4g4a1/LTSDevelopers%20Documents/How-to/Review%20failed%20AWS%20FE%20test.docx?d=wf59cd41009c94efd8492a59bd4a68df7&csf=1&web=1&e=aYBJlm)

#### Standardised selectors to target elements

- We are following the best practice recommended by playwright to target elements using `data-testid` attribute where possible

#### Gotchas

Unlike Jest, Playwright test assertions are based on [actionability checks](https://playwright.dev/docs/actionability),
which means they are not suitable for checking every possible state of a given component. For instance, if a component
displays a loading message for async actions, and those actions complete too quickly, checking for the presence of the
loading message might fail.

For assertions like the above, Jest is a better fit, as it requires adding waits to ensure the test doesn't finish
before the component reaches its final state.

### Code Coverage

We require 100% coverage, but untestable/ non-valuable sections can be exlcuded with istanbul (search the code base for examples)

To run the complete test suite and get code coverage, run `npm run test:cc`

This will run unit tests (jest) and e2e tests (playwright) and then merge the coverage of the 2 to give complete coverage. Coverage reports are at `coverage/index.html` after the run.

This will wipe any previous coverage files.

On the server, coverage is checked on these branches: production, master, staging and any branch that is listed in the Git Triggers section of pipeline `homepage-development-coverage`.

(if it doesn't appear in `homepage-development-coverage` then it needs to be includes included in the Git Triggers section of `homepage-development` to be built at all)

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

## Reviewing

A Self-review checklist is [here](https://uq.sharepoint.com/:w:/r/teams/lbf4g4a1/LTSDevelopers%20Documents/Standards/React%20self%20code%20review%20checklist.docx?d=w0b91b7dfd85d4f14bf624da7c4de1821&csf=1&web=1&e=RZs5Ka) in
the ISRS Collection.

Ask for review from team-mates if you'd like other eyes on your changes.

## Deployment

Application deployment is 100% automated using AWS Codebuild (and Codepipeline), and is hosted in S3. All testing and deployment commands and configuration are stored in the buildspec yaml files in the repo. All secrets (access keys and tokens for PT, Sentry and Google) are stored in AWS Parameter Store, and then populated into ENV variables in those buildspec yaml files.
Deployment pipelines are setup for branches: "master", "staging, "production" and several key branches starting with "feature-".

- You must always merge your change to master branch, and then merge master into staging/production branches (ideally, merge your changes into staging branch and make sure [e2e tests](https://github.com/uqlibrary/e2e-testing) pass **before** merging then into master branch)
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
[Google Analytics](https://www.google.com.au/analytics/tag-manager/).


## To work with api locally

- bring up local [api](https://github.com/uqlibrary/api) repo (cf - tl;dr `./scripts/dev-tools.sh up`), remembering to run the seeders relevant to your needs
- change .env to have value `API_URL='http://dev-api.library.uq.edu.au:8050/'`
- start `npm run start:devapi`
- possibly use a non-cors browser?
- open <http://localhost:2020/> if it didnt open automatically
- get the values of your cookies, UQLID and UQLID_USER_GROUP, from library.uq.edu.au and set them in localhost:2020
- I think thats everything

Remember to change the .env back after! (NB: You will need to restart `npm run start` for a change in .env to take effect).
