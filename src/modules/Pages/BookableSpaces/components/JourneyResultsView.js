import React from 'react';
import PropTypes from 'prop-types';

import { Box, Button, Chip, Stack, Typography, useTheme } from '@mui/material';

import BookingLink from 'modules/Pages/BookableSpaces/BookingLink';
import SpaceFavouriteIcon from 'modules/Pages/BookableSpaces/Shared/SpaceFavouriteIcon';
import SidebarFilters from 'modules/Pages/BookableSpaces/SidebarFilters';
import SpacesPagination from 'modules/Pages/BookableSpaces/Shared/SpacesPagination';

import { defaultChipStyles, SpaceOpenStatusChip } from 'modules/Pages/BookableSpaces/spacesHelpers';
import { getVisibleSpaceOutage } from 'modules/Pages/Admin/BookableSpaces/Spaces/Form/spaceOutageHelpers';
import { StyledSecondaryButton } from 'helpers/general';
import { serialiseJourneyUrl } from 'modules/Pages/BookableSpaces/journeyHelpers';

import {
    StyledJourneyPanel,
    StyledResultsSidebarPanel,
    StyledResultsSplitLayout,
    StyledListItemStack,
} from './journeyViewStyles';

export const JourneyResultsView = ({
    intentSpaceLocations,
    totalSpaceCount,
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
    isDesktopResultsLayout,
    setShowAdvancedFilters,
    weeklyHours,
    weeklyHoursLoading,
    weeklyHoursError,
    isFavouriteActionInProgress,
    onFavouriteToggle,
    spacesFavouritesList,
    showFavouriteSpacesOnly,
    setShowFavouriteSpacesOnly,
    isLoggedIn,
    hasFavouriteSpaces,
}) => {
    const theme = useTheme();

    const spaces = Array.isArray(intentSpaceLocations) ? intentSpaceLocations : [];
    const [page, setPage] = React.useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.max(1, Math.ceil(spaces.length / itemsPerPage));
    const visibleSpaces = React.useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return spaces.slice(start, start + itemsPerPage);
    }, [page, spaces]);

    React.useEffect(() => {
        setPage(prevPage => (prevPage > totalPages ? totalPages : prevPage));
    }, [totalPages]);

    return (
        <StyledJourneyPanel data-testid="bookable-spaces-journey-results-view" hasTopSpacing>
            <StyledResultsSplitLayout>
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
                        showFavouriteSpacesOnly={showFavouriteSpacesOnly}
                        setShowFavouriteSpacesOnly={setShowFavouriteSpacesOnly}
                        isLoggedIn={isLoggedIn}
                        hasFavouriteSpaces={hasFavouriteSpaces}
                    />
                </StyledResultsSidebarPanel>

                <Box>
                    <Typography component="h2" variant="h5" sx={{ fontWeight: 700, color: '#1f1230' }}>
                        Search results
                    </Typography>
                    <Typography data-testid="spaces-results-summary" variant="body2" sx={{ color: '#666', mt: 1.5 }}>
                        {spaces.length}
                        {typeof totalSpaceCount === 'number' ? ` of ${totalSpaceCount}` : ''} spaces
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                        <StyledSecondaryButton onClick={handleClearJourneyFilters}>
                            Reset quick filters
                        </StyledSecondaryButton>
                        <StyledSecondaryButton onClick={goToLegacyBrowse}>View on map</StyledSecondaryButton>
                    </Stack>

                    {spaces.length > 0 && (
                        <Stack spacing={4} sx={{ mt: 1.5 }}>
                            {visibleSpaces.map(space => {
                                const detailId = String(space?.space_uuid || space?.space_id || '');
                                const visibleOutage = getVisibleSpaceOutage(space?.space_outages);
                                const detailUrl = serialiseJourneyUrl({
                                    view: 'details',
                                    spaceId: space?.space_uuid || space?.space_id || null,
                                });
                                return (
                                    <StyledListItemStack key={detailId || space?.space_id} spacing={1}>
                                        <Button
                                            component="a"
                                            className="cardBody"
                                            href={detailUrl}
                                            data-testid={`spaces-result-list-item-${space?.space_id}`}
                                        >
                                            <Box sx={{ position: 'relative' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    {isLoggedIn && <span className="spaceHolderForFavouriteStar" />}

                                                    <Typography
                                                        component={'h3'}
                                                        variant={'h6'}
                                                        data-testid={`spaces-${space?.space_id}-name`}
                                                    >
                                                        {space?.space_name || 'Unnamed space'}
                                                    </Typography>
                                                </div>
                                                <Typography
                                                    sx={{ color: theme.palette.designSystem.bodyCopy, mb: 0.5 }}
                                                >
                                                    {space?.space_library_name}
                                                </Typography>
                                                <Typography sx={{ color: theme.palette.designSystem.bodyCopy }}>
                                                    {space?.space_type_details?.space_type_name || space?.space_type}
                                                </Typography>
                                                <Box sx={{ mt: 0.75, mb: 1 }}>
                                                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
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
                                                                    ...defaultChipStyles(theme),
                                                                    backgroundColor:
                                                                        theme.palette.designSystem.alert.warning,
                                                                }}
                                                            />
                                                        )}
                                                    </Stack>
                                                </Box>
                                                {!!space?.space_type_details?.space_type_description && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: theme.palette.designSystem.bodyCopy,
                                                            mb: space?.space_description ? 0.75 : 0,
                                                        }}
                                                    >
                                                        {space.space_type_details.space_type_description}
                                                    </Typography>
                                                )}
                                                {!!space?.space_description && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: theme.palette.designSystem.bodyCopy,
                                                            fontStyle: 'italic',
                                                        }}
                                                    >
                                                        {String(space.space_description)
                                                            .replace(/<[^>]*>/g, ' ')
                                                            .trim()}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Button>
                                        {isLoggedIn && (
                                            <SpaceFavouriteIcon
                                                bookableSpace={space}
                                                isFavourite={spacesFavouritesList?.some(
                                                    fav => fav.space_id === space?.space_id,
                                                )}
                                                onFavouriteToggle={() => onFavouriteToggle?.(space)}
                                                isFavouriteActionInProgress={isFavouriteActionInProgress}
                                                iconPosition="topLeft"
                                            />
                                        )}
                                        {!!space?.space_external_book_url && (
                                            <Box className="bookingLink">
                                                <BookingLink bookableSpace={space} hideNoBookingRequired />
                                            </Box>
                                        )}
                                    </StyledListItemStack>
                                );
                            })}
                        </Stack>
                    )}

                    {spaces.length > 0 && totalPages > 1 && (
                        <SpacesPagination
                            page={page}
                            count={totalPages}
                            onPageChange={setPage}
                            totalItems={spaces.length}
                            itemsPerPage={itemsPerPage}
                        />
                    )}

                    {spaces.length === 0 && (
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
                            <Typography sx={{ fontWeight: 700, color: '#1f1230' }}>
                                No results match your criteria
                            </Typography>
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
    intentSpaceLocations: PropTypes.array,
    totalSpaceCount: PropTypes.number,
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
    weeklyHours: PropTypes.any,
    weeklyHoursLoading: PropTypes.bool,
    weeklyHoursError: PropTypes.any,
    isFavouriteActionInProgress: PropTypes.bool,
    onFavouriteToggle: PropTypes.func,
    spacesFavouritesList: PropTypes.any,
    showFavouriteSpacesOnly: PropTypes.bool,
    setShowFavouriteSpacesOnly: PropTypes.func,
    isLoggedIn: PropTypes.bool,
    hasFavouriteSpaces: PropTypes.bool,
};

export default JourneyResultsView;
