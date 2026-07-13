import React from 'react';
import PropTypes from 'prop-types';
import { Box, Chip, Stack, Typography } from '@mui/material';

import SidebarFilters from 'modules/Pages/BookableSpaces/SidebarFilters';
import { SpaceOpenStatusChip } from 'modules/Pages/BookableSpaces/spacesHelpers';
import { getVisibleSpaceOutage } from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
import { StyledPrimaryButton, StyledSecondaryButton } from 'helpers/general';
import {
    StyledJourneyPanel,
    StyledResultCardButton,
    StyledResultsSidebarPanel,
    StyledResultsSplitLayout,
} from './journeyViewStyles';

export const JourneyResultsView = ({
    selectedIntent,
    intentSpaceLocations,
    totalSpaceCount,
    selectedIntentId,
    setSelectedSpace,
    navigateToView,
    handleClearJourneyFilters,
    goToLegacyBrowse,
    selectedFacilityTypes,
    setSelectedFacilityTypes,
    filteredFacilityTypeList,
    facilityTypeList,
    facilityTypeListLoading,
    facilityTypeListError,
    minimumSpaceCapacity,
    maximumSpaceCapacity,
    capacityFilterValue,
    setCapacityFilterValue,
    campusList,
    selectedCampus,
    handleCampusSelection,
    activeFilterCount,
    librariesForCampus,
    selectedLibrary,
    handleLibrarySelection,
    shouldShowAdvancedFilters,
    isDesktopResultsLayout,
    setShowAdvancedFilters,
    favouriteSpaceIds,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
}) => {
    const spaces = Array.isArray(intentSpaceLocations) ? intentSpaceLocations : [];

    return (
        <StyledJourneyPanel data-testid="bookable-spaces-journey-results-view" hasTopSpacing>
            <StyledResultsSplitLayout>
                {shouldShowAdvancedFilters && (
                    <StyledResultsSidebarPanel>
                        <SidebarFilters
                            facilityTypeList={facilityTypeList}
                            facilityTypeListLoading={facilityTypeListLoading}
                            facilityTypeListError={facilityTypeListError}
                            selectedFacilityTypes={selectedFacilityTypes}
                            setSelectedFacilityTypes={setSelectedFacilityTypes}
                            filteredFacilityTypeList={filteredFacilityTypeList}
                            suppliedClassName="journeyFilterSidebar"
                            minimumSpaceCapacity={minimumSpaceCapacity}
                            maximumSpaceCapacity={maximumSpaceCapacity}
                            capacityFilterValue={capacityFilterValue}
                            setCapacityFilterValue={setCapacityFilterValue}
                            campusList={campusList}
                            selectedCampus={selectedCampus}
                            handleCampusSelection={handleCampusSelection}
                            activeFilterCount={activeFilterCount}
                            librariesForCampus={librariesForCampus}
                            selectedLibrary={selectedLibrary}
                            handleLibrarySelection={handleLibrarySelection}
                            onApplyAllFilters={() => {
                                if (!isDesktopResultsLayout) {
                                    setShowAdvancedFilters(false);
                                }
                            }}
                            showBottomActionButtons
                        />
                    </StyledResultsSidebarPanel>
                )}

                <Box>
                    <Typography component="h2" variant="h5" sx={{ fontWeight: 700, color: '#1f1230' }}>
                        {selectedIntent?.label || 'Matching spaces'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mt: 1.5 }}>
                        Showing {spaces.length}
                        {typeof totalSpaceCount === 'number' ? ` of ${totalSpaceCount}` : ''} spaces
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <StyledSecondaryButton onClick={handleClearJourneyFilters}>Reset quick filters</StyledSecondaryButton>
                        <StyledSecondaryButton onClick={goToLegacyBrowse}>View on map</StyledSecondaryButton>
                    </Stack>

                    {spaces.length > 0 ? (
                        <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                            {spaces.map(space => {
                                const detailId = String(space?.space_uuid || space?.space_id || '');
                                const visibleOutage = getVisibleSpaceOutage(space?.space_outages);
                                return (
                                    <Stack key={detailId || space?.space_id} spacing={1}>
                                        <StyledResultCardButton
                                            data-testid={`spaces-result-list-item-${space?.space_id}`}
                                            onClick={() => {
                                                setSelectedSpace?.(space);
                                                navigateToView?.('details', {
                                                    intentId: selectedIntentId,
                                                    spaceId: detailId,
                                                });
                                            }}
                                        >
                                            <Box sx={{ p: '1.5rem', width: '100%', textAlign: 'left' }}>
                                                <Typography sx={{ fontWeight: 700, color: '#1f1230', mb: 0.5 }}>
                                                    {space?.space_name || 'Unnamed space'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                                                    {space?.space_library_name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#999' }}>
                                                    {space?.space_type_details?.space_type_name || space?.space_type}
                                                </Typography>
                                                <Box sx={{ mt: 0.75, mb: 1 }}>
                                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                                        {favouriteSpaceIds?.has(String(space?.space_id)) && (
                                                            <Chip
                                                                data-testid={`spaces-journey-favourite-chip-${space?.space_id}`}
                                                                label="Favourite"
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: '#fff8e1',
                                                                    color: '#7a5a00',
                                                                    borderColor: '#ffe082',
                                                                    border: '1px solid',
                                                                    fontWeight: 700,
                                                                }}
                                                            />
                                                        )}
                                                        <SpaceOpenStatusChip
                                                            space={space}
                                                            weeklyHours={weeklyHours}
                                                            weeklyHoursLoading={weeklyHoursLoading}
                                                            weeklyHoursError={weeklyHoursError}
                                                        />
                                                        {!!visibleOutage && visibleOutage.status !== 'Current' && (
                                                            <Chip
                                                                data-testid={`spaces-journey-outage-chip-${space?.space_id}`}
                                                                label="Upcoming closure"
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: '#fff8e1',
                                                                    color: '#7a5a00',
                                                                    border: '1px solid #ffe082',
                                                                    fontWeight: 700,
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>
                                                </Box>
                                                {!!space?.space_type_details?.space_type_description && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ color: '#4f4d57', mb: space?.space_description ? 0.75 : 0 }}
                                                    >
                                                        {space.space_type_details.space_type_description}
                                                    </Typography>
                                                )}
                                                {!!space?.space_description && (
                                                    <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                                                        {String(space.space_description)
                                                            .replace(/<[^>]*>/g, ' ')
                                                            .trim()}
                                                    </Typography>
                                                )}
                                                {!!space?.space_external_book_url && (
                                                    <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #e0e0e0' }}>
                                                    <StyledPrimaryButton
                                                        component="a"
                                                        href={space.space_external_book_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        size="small"
                                                        sx={{ textTransform: 'none' }}
                                                    >
                                                        Book this space
                                                    </StyledPrimaryButton>
                                                    </Box>
                                                )}
                                            </Box>
                                        </StyledResultCardButton>
                                    </Stack>
                                );
                            })}
                        </Stack>
                    ) : (
                        <Box
                            sx={{
                                mt: 1.5,
                                p: 2,
                                width: '100%',
                                boxSizing: 'border-box',
                                border: '1px dashed #c8bed6',
                                borderRadius: '12px',
                                backgroundColor: '#faf7ff',
                            }}
                        >
                            <Typography sx={{ fontWeight: 700, color: '#1f1230' }}>No results match your criteria</Typography>
                            <Typography variant="body2" sx={{ color: '#666', mt: 0.75 }}>
                                Try clearing some filters or selecting a different campus to widen your search.
                            </Typography>
                        </Box>
                    )}
                </Box>
            </StyledResultsSplitLayout>
        </StyledJourneyPanel>
    );
};

JourneyResultsView.propTypes = {
    selectedIntent: PropTypes.object,
    intentSpaceLocations: PropTypes.array,
    totalSpaceCount: PropTypes.number,
    selectedIntentId: PropTypes.any,
    setSelectedSpace: PropTypes.func,
    navigateToView: PropTypes.func,
    handleClearJourneyFilters: PropTypes.func,
    goToLegacyBrowse: PropTypes.func,
    selectedFacilityTypes: PropTypes.array,
    setSelectedFacilityTypes: PropTypes.func,
    filteredFacilityTypeList: PropTypes.object,
    facilityTypeList: PropTypes.object,
    facilityTypeListLoading: PropTypes.bool,
    facilityTypeListError: PropTypes.any,
    minimumSpaceCapacity: PropTypes.number,
    maximumSpaceCapacity: PropTypes.number,
    capacityFilterValue: PropTypes.array,
    setCapacityFilterValue: PropTypes.func,
    campusList: PropTypes.array,
    selectedCampus: PropTypes.number,
    handleCampusSelection: PropTypes.func,
    activeFilterCount: PropTypes.number,
    librariesForCampus: PropTypes.array,
    selectedLibrary: PropTypes.number,
    handleLibrarySelection: PropTypes.func,
    shouldShowAdvancedFilters: PropTypes.bool,
    isDesktopResultsLayout: PropTypes.bool,
    setShowAdvancedFilters: PropTypes.func,
    favouriteSpaceIds: PropTypes.object,
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
};

export default JourneyResultsView;
