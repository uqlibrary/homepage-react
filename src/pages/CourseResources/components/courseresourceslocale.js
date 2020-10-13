import React from 'react';

// find an appropriate icon from https://material-ui.com/components/material-icons/ to use
import REPLACEMEIcon from '@material-ui/icons/AcUnit';
import InfoIcon from '@material-ui/icons/ErrorOutline';
import CourtHouseIcon from '@material-ui/icons/AccountBalance';

export default {
    title: 'Course Resources',
    studyHelpLinks: [
        {
            icon: <REPLACEMEIcon style={{ marginRight: 6 }} />,
            id: 'referencingGuides',
            linkLabel: 'Referencing guides',
            linkTo: 'https://guides.library.uq.edu.au/referencing',
        },
        {
            icon: <REPLACEMEIcon style={{ marginRight: 6 }} />,
            id: 'digitalessentials',
            linkLabel: 'Digital Essentials',
            linkTo: 'https://web.library.uq.edu.au/research-tools-techniques/digital-essentials',
        },
        {
            icon: <CourtHouseIcon style={{ marginRight: 6 }} />,
            id: 'legalResearchEssentials',
            linkLabel: 'Legal Research Essentials',
            linkTo: 'https://web.library.uq.edu.au/library-services/training/legal-research-essentials',
        },
        {
            icon: <InfoIcon style={{ marginRight: 6 }} />,
            id: 'libraryTraining',
            linkLabel: 'Library training',
            linkTo: 'https://web.library.uq.edu.au/library-services/training',
        },
    ],
};
