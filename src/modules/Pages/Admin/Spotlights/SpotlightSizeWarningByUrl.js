import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SpotlightSizeWarning from 'modules/Pages/Admin/Spotlights/SpotlightSizeWarning';

export const SpotlightSizeWarningByUrl = ({ spotlightImgUrl }) => {
    const [imgWidth, setImgWidth] = useState(null);
    const [imgHeight, setImgHeight] = useState(null);

    if (!spotlightImgUrl) {
        return null;
    }

    function setSizes() {
        !!this.naturalWidth && setImgWidth(this.naturalWidth);
        !!this.naturalHeight && setImgHeight(this.naturalHeight);
    }

    // from https://stackoverflow.com/questions/11442712/get-width-height-of-remote-image-from-url
    const img = new Image();
    img.addEventListener('load', setSizes);
    spotlightImgUrl.startsWith('http') && (img.src = spotlightImgUrl);

    return <SpotlightSizeWarning imgWidth={imgWidth} imgHeight={imgHeight} />;
};

SpotlightSizeWarningByUrl.propTypes = {
    spotlightImgUrl: PropTypes.string,
};

export default React.memo(SpotlightSizeWarningByUrl);
