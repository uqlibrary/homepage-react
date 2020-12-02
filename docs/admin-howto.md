This document describes how changes can be made to various areas of the Homepage.

# General instructions:

1. Edit the file specific to the area you want to change (see below) in the correct branch and commit your change.
The branch to use is `user-admin-manage`
If you are using Github to edit, then your screen should look like this:
![Demonstrating selecting the UX Services branch](https://raw.githubusercontent.com/uqlibrary/homepage-react/user-admin-manage/docs/demo-user-edit.png "Demonstrating selecting the UX Services branch")
2. Check the build passes on Amazon by checking the `System - Deployments` channel on Teams (if you have access, you can also check it on [Amazon](https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/homepage-user-admin-manage/view?region=ap-southeast-2))
3. Preview the change at <http://homepage-development.library.uq.edu.au/user-admin-manage/#/>
4. Let devs know that you have a change to be merged in

## To edit the Promo Panel on the homepage

Edit [promoPanel.locale.js](https://github.com/uqlibrary/homepage-react/blob/user-admin-manage/src/modules/Index/components/subComponents/promoPanel.locale.js) and then follow the steps above

Notes:

* html on this page must be Really Tidy, or the build will not pass. 
* Indent everything by exactly 4 spaces
* each HTML item gets its own line 

## To edit the Mega menu

(This also covers, eg the list of services in the Connect Footer that matches the headers in the mega menu)

Edit [menu.js](https://github.com/uqlibrary/homepage-react/blob/user-admin-manage/src/locale/menu.js) and then follow the steps above

Please leave the datatestid elements in place

## To edit the Footer

Edit [footerLocale.js](https://github.com/uqlibrary/homepage-react/blob/user-admin-manage/src/modules/SharedComponents/Footer/footerLocale.js) and then follow the steps above

(Note that only the Connect Footer items are working - Minimal Footer is controlled by ITS markup)
