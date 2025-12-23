const noSpringshareHoursLabel = 'No Springshare opening hours will display (click to change)';
export const locale = {
    noSpringshareHoursLabel: noSpringshareHoursLabel,
    unselectedSpringshareOption: {
        id: -1,
        display_name: noSpringshareHoursLabel,
    },
    locations: {
        greatCourtCoordinates: [-27.49745, 153.01337],
    },
    form: {
        upload: {
            // the square bracket strings are swapped out for actual values - don't remove them!!
            currentDimensionsNotification: 'Dimensions: [WIDTH]px by [HEIGHT]px (aspect ratio: [RATIO]).',
            recommendedDimensionsNotification:
                'Max image size: [MAXFILESIZE] KB. Recommended dimensions: [WIDTH]px by [HEIGHT]px (aspect ratio: [RATIO]).',
            ideal: {
                width: 813,
                height: 300,
                ratio: 2.71,
            },
            minRatio: 2.55,
            maxRatio: 2.8,
            heightWidthFlex: 50, // can go plus or minus this figure without it warning
            dimensionsWarning: 'Larger images will affect page load time and smaller ones may be pixelated',
            maxSize: 400000, // 400 x 1000 bytes = 400kb
            uploadError: {
                confirmationTitle:
                    'Your image could not be uploaded. Please check or recreate the image and try again.',
                confirmButtonLabel: 'OK',
            },
            fileTooLarge: {
                confirmationTitle:
                    'The file is too large. Please reduce the file size to [MAXFILESIZE] KB or less and try again.',
                confirmButtonLabel: 'OK',
            },
        },
    },
};
