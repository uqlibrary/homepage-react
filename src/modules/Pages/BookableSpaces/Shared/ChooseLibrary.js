import React from 'react';
import { PropTypes } from 'prop-types';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export const ChooseLibrary = ({
    librariesForCampus,
    selectedLibrary,
    handleLibrarySelection,
    libraryLabel = 'Choose library',
}) => {
    return (
        <>
            {librariesForCampus?.length > 2 && (
                // show the selector whenever there is more than two library options available
                <>
                    <h3 id="filter-by-library-label" htmlFor="filter-by-library-input">
                        {libraryLabel}
                    </h3>
                    <Select
                        className="sidebarSelector"
                        id="filter-by-library"
                        labelId="filter-by-library-label"
                        data-testid="filter-by-library"
                        value={librariesForCampus?.find(c => c.library_id === selectedLibrary)?.library_id || 0}
                        onChange={handleLibrarySelection}
                        inputProps={{
                            id: 'filter-by-library-input',
                            title: 'Filter the displayed Spaces by library',
                        }}
                    >
                        {librariesForCampus?.map((library, index) => (
                            <MenuItem
                                value={library?.library_id}
                                key={`filter-by-library-menuitem-${index}`}
                                selected={library?.library_id === 99999}
                                data-testid={`library-${library?.library_id}`}
                            >
                                {library.library_name}
                            </MenuItem>
                        ))}
                    </Select>
                </>
            )}
        </>
    );
};
ChooseLibrary.propTypes = {
    librariesForCampus: PropTypes.any,
    selectedLibrary: PropTypes.any,
    handleLibrarySelection: PropTypes.func,
    libraryLabel: PropTypes.string,
};

export default ChooseLibrary;
