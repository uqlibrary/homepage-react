import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React from "react";

export const ChooseCampus = ({selectedCampusValue, handleCampusSelection, campusList, campusLabel="Choose campus", testid="filter-by-campus"}) => {
    return <>
        <h3 id="filter-by-campus-label" htmlFor="filter-by-campus-input">
            {campusLabel}
        </h3>
        <Select
            className="sidebarSelector"
            id="filter-by-campus"
            labelId="filter-by-campus-label"
            data-testid={`${testid}`}
            value={selectedCampusValue}
            onChange={handleCampusSelection}
            inputProps={{
                id: 'filter-by-campus-input',
                title: 'Filter the displayed Spaces by campus',
            }}
        >
            <MenuItem value={0} data-testid="campus-all">
                All campuses
            </MenuItem>
            {campusList
                ?.filter(campus => campus.campus_space_count > 0)
                ?.map((campus, index) => (
                    <MenuItem
                        value={campus?.campus_id}
                        key={`filter-by-campus-menuitem-${index}`}
                        selected={campus?.campus_id === 99999}
                        data-testid={`campus-${campus?.campus_id}`}
                    >
                        {campus.campus_name}
                    </MenuItem>
                ))}
        </Select>
    </>;
}

export default ChooseCampus;
