import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Fuse from 'fuse.js';
import useDebounce from './hooks';

const DEFAULT_FUSE_OPTIONS = {
    keys: ["keyword", "synonyms"],
    threshold: 0.6,
    includeScore: true,
    ignoreCase: true,
};

const FuzzySearch = ({ data, fuseOptions = DEFAULT_FUSE_OPTIONS, delay = 800, onSelectedItemsChange }) => {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState(data || []);
    const [selectedItems, setSelectedItems] = useState([]);

    console.log("selectedItems", selectedItems);
    const debouncedInputValue = useDebounce(inputValue, delay);

    const fuse = useMemo(() => new Fuse(data, fuseOptions), [data, fuseOptions]);

    const fuseResults = useMemo(() => {
        if (debouncedInputValue) {
            return fuse.search(debouncedInputValue);
        }
        return [];
    }, [debouncedInputValue, fuse]);

    useEffect(() => {
        if (debouncedInputValue) {
            const newOptions = fuseResults.map(result => result.item);
            setOptions(newOptions);
        } else {
            setOptions(data || []);
        }
    }, [debouncedInputValue, fuseResults, data]);

    useEffect(() => {
        // Call the callback function whenever selectedItems changes
        onSelectedItemsChange(selectedItems);
    }, [selectedItems, onSelectedItemsChange]);

    const getOptionLabel = (option) => {
        return option?.keyword || '';
    };

    const handleSelectionChange = (event, newValue) => {
        if (!newValue) return;

        const fuseResult = fuseResults.length > 0
            ? fuseResults.find(
                (result) => result.item.keyword === newValue.keyword
            )
            : fuse.search(newValue.keyword).find(result => result.item.keyword === newValue.keyword);

        const score = fuseResult?.score || 1;

        // Check for existing item using the keyword_id
        const existingItemIndex = selectedItems.findIndex(
            (item) => item.keyword_id === newValue.keyword_id
        );

        // Create a flat object with only the needed properties
        const newItem = {
            keyword: newValue.keyword,
            keyword_id: newValue.keyword_id,
            score: score,
        };

        let updatedItems;
        if (existingItemIndex > -1) {
            // Compare scores on the flat object
            if (newItem.score < selectedItems[existingItemIndex].score) {
                updatedItems = [...selectedItems];
                updatedItems[existingItemIndex] = newItem;
            } else {
                updatedItems = selectedItems;
            }
        } else {
            updatedItems = [...selectedItems, newItem];
        }

        // Sort the updated array by score (ascending) and then alphabetically
        const sortedItems = updatedItems.sort((a, b) => {
            const roundedA = parseFloat(a.score.toFixed(4));
            const roundedB = parseFloat(b.score.toFixed(4));

            const scoreComparison = roundedA - roundedB;

            if (scoreComparison === 0) {
                return a.keyword.trim().localeCompare(b.keyword.trim());
            }

            return scoreComparison;
        });

        setSelectedItems(sortedItems);
        setInputValue('');
    };

    const handleChipDelete = (itemToDelete) => () => {
        // Filter the array using the keyword_id from the flat object
        setSelectedItems((selectedItems) =>
            selectedItems.filter((item) => item.keyword_id !== itemToDelete.keyword_id)
        );
    };

    const filterOptions = (options, { inputValue }) => options;

    return (
        <>
            <Autocomplete
                value={null}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                onChange={handleSelectionChange}
                options={options}
                getOptionLabel={getOptionLabel}
                filterOptions={filterOptions}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search and select keywords"
                        variant="outlined"
                    />
                )}
            />

            <div style={{ marginTop: '20px' }}>
                <h3>Selected Keywords:</h3>
                {selectedItems.length > 0 ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {selectedItems.map((item, index) => (
                            <Chip
                                key={index}
                                // Use the simplified keyword and score properties
                                label={`${item.keyword}`}
                                onDelete={handleChipDelete(item)}
                            />
                        ))}
                    </Box>
                ) : (
                    <p>No keywords selected yet.</p>
                )}
            </div>
        </>
    );
};

FuzzySearch.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        keyword: PropTypes.string.isRequired,
        synonyms: PropTypes.arrayOf(PropTypes.string),
        keyword_id: PropTypes.number.isRequired,
    })).isRequired,
    fuseOptions: PropTypes.object,
    delay: PropTypes.number,
    onSelectedItemsChange: PropTypes.func.isRequired, // Add the new prop
};

export default FuzzySearch;