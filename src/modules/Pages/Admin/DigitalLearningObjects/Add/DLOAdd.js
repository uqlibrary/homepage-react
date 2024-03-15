import React from 'react';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

export const DLOAdd = ({}) => {
    return (
        <StandardPage>
            <StandardCard title="Add Dlor">initial page loaded</StandardCard>
        </StandardPage>
    );
};

export default React.memo(DLOAdd);
