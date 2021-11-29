This document describes how changes can be made to various areas of the Homepage.

# General instructions:

1. Edit the file specific to the area you want to change (see below) in the correct branch and commit your change.
The correct branch to use is `user-admin-manage`
If you are using Github to edit, then your screen should look like this:
![Demonstrating selecting the UX Services branch](https://raw.githubusercontent.com/uqlibrary/homepage-react/user-admin-manage/docs/demo-user-edit.png "Demonstrating selecting the UX Services branch")
2. Check the build passes on Amazon by checking the `System - Deployments` channel on Teams (if you have access, you can also check it on [Amazon](https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/homepage-user-admin-manage/view?region=ap-southeast-2))
3. Preview the change at <http://homepage-development.library.uq.edu.au/user-admin-manage/#/>
4. Let devs know that you have a change to be merged in

* If it does not pass on first go and you do not have permissions to view the error in AWS, it is suggested you immediately get a dev to fix it for you as they can fix code layout errors very simply. Worry about getting the words right :)

## To edit the Promo Panel on the homepage

Edit [promoPanel.locale.js](https://github.com/uqlibrary/homepage-react/blob/user-admin-manage/src/modules/Index/components/subComponents/promoPanel.locale.js) and then follow the steps above

Notes:

* html on this page must be Really Tidy, or the build will not pass. 
* Indent everything by exactly 4 spaces
* each HTML item gets its own line 

## To edit the Mega menu

Visit the [Reusable Webcomponents instructions](https://github.com/uqlibrary/reusable-webcomponents/blob/user-admin-manage/docs/admin-howto.md)

## To edit the Footer

Visit the [Reusable Webcomponents instructions](https://github.com/uqlibrary/reusable-webcomponents/blob/user-admin-manage/docs/admin-howto.md)

## Viewing what each user type sees

Visit [the homepage test file](https://github.com/uqlibrary/homepage-react/blob/user-admin-manage/cypress/integration/homepage.spec.js#L9) to view what elements many user types can see on the Homepage. (Developers can add remaining types on request) 

## Alerts Admin system

Need to add or remove a user? Ask Work Station Support to add or remove the "SpotlightAdmins" AD group for the user (the one group covers Spotlights and Alerts). Include the username in the request (eg uqjtilse).

## Spotlights Admin system

Need to add or remove a user?  Ask Work Station Support to add or remove the "SpotlightAdmins" AD group for the user. Include the username in the request (eg uqjtilse). These users will also be able to load the Alerts Admin system.


