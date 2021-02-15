# Offsite Applications

Our headers and footers can be included in third party sites, such as search.library.uq.edu.au.

Each of the folders in this directory map to one install.

For each install:
- create a custom-styles.scss file containing sass for special styling on the site (the general homepage css will be automatically loaded)
- create a load.js following the instructions in sample-site/load.js (you can include/not include each of mylibrary button, auth button, footer generally, connect footer)

How this works:
- webpack has a object that lists these folders