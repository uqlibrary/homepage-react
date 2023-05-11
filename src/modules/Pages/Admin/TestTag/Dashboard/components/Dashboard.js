import React from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';

import TestTagHeader from '../../SharedComponents/TestTagHeader/TestTagHeader';
import locale from '../../testTag.locale';

const Dashboard = () => {
    const initConfig = {};
    const headerDepartmentText = React.useMemo(
        () =>
            initConfig?.user
                ? locale?.form?.pageSubtitle?.(
                      initConfig?.user?.department_display_name ??
                          /* istanbul ignore next */ initConfig?.user?.user_department ??
                          /* istanbul ignore next */ '',
                  )
                : /* istanbul ignore next */ '',
        [initConfig],
    );

    return (<StandardPage title={locale.form.pageTitle}>
         <TestTagHeader
                departmentText={headerDepartmentText}
                requiredText={locale?.form?.requiredText ?? /* istanbul ignore next */ ''}
            />
    </StandardPage>);
};

export default React.memo(Dashboard);
