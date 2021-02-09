# Web Components

This is to include Library Headers and Footers in foreign sites, eg search.library.uq.edu.au, just as the Polymer reusables do now.

## Method

A site eg search.library.uq.edu.au includes components.
This can be previewed locally in public/dummywebsite.html, which includes:
- a load.js file
- dist/offSiteAppWrapper.js

The concept is that we insert a react root into the foreign website, then include a homepage react build and the  header etc elements are inserted.

The build process should do an `npm run build` then do a `npm run build:offSiteApps`.

The first will build the regular components for the Library homepage, mostly into /dist/.../frontend-js/

The second command will build a version meant to be used on other sites, mostly into /dist/.../offSiteApps-js/.

