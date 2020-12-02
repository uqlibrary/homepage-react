## To edit the Promo Panel on the homepage

1. Edit [user-admin-manage](https://github.com/uqlibrary/homepage-react/blob/user-admin-manage/src/modules/Index/components/subComponents/PersonalisedPanel.locale.js) in the correct branch and commit your change
2. Check the build passes at [AWS](https://ap-southeast-2.console.aws.amazon.com/codesuite/codepipeline/pipelines/user-admin-manage/view?region=ap-southeast-2)
3. Preview the change at http://homepage-development.library.uq.edu.au/user-admin-manage/#/
4. Let devs know that you have a change to be merged in

Notes:

* html on this page must be Really Tidy, or the build will not pass. 
* Indent everything by exactly 4 spaces
* each HTML item gets its own line 
