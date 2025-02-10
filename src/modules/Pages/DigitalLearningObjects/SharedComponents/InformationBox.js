import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const StyledInformationBox = styled(Box)(() => ({
    backgroundColor: '#dcedfd',
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: 400,
    lineHeight: 1.5,
    margin: 0,
    marginBottom: 20,
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    '& span': {
        marginLeft: 10,
        display: 'flex',
        alignItems: 'center',
    },
}));

const InformationBox = ({narrower = false, prompt = 'No help is available', linkUrl=null, linkText=null, identifier='default'}) => {
    return (
        <>
                <StyledInformationBox
                    data-testid={`dlor-${identifier}-helper`}
                    sx={{ margin: !!narrower ? /* istanbul ignore next */ '0 12px' : undefined }}
                >
                    <InfoIcon />
                    <p style={{margin: '0 5px 0', padding: 0}}>
                        {prompt}
                    
                        {linkUrl && linkText && (
                            <>
                                <br />
                                
                                    <a
                                        href={linkUrl}
                                        target="_blank"
                                    >
                                        {linkText}
                                    </a>
                                
                            </>
                        )}
                    </p>
                </StyledInformationBox>
            
        </>
    );
};

InformationBox.propTypes = {
    narrower: PropTypes.bool,
    prompt: PropTypes.string,
    linkUrl: PropTypes.string,
    linkText: PropTypes.string,
    identifier: PropTypes.string,
};

export default InformationBox;
