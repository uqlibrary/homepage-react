import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';
import { isCurrentSpotlight, moveItemInArray } from './spotlighthelpers';

const useStyles = makeStyles(() => ({
    reorderableThumb: {
        height: 60,
        marginRight: 5,
        maxWidth: 164,
    },
    hasBorder: {
        border: '3px solid black',
    },
    placeholderBlock: {
        height: 54,
        width: 157,
        backgroundColor: 'grey',
        border: '3px solid black',
        display: 'inline-block',
    },
    reorderableOrderNumber: {
        color: 'white',
        backgroundColor: 'rgb(128, 128, 128, 0.7)',
        textAlign: 'center',
        position: 'absolute',
        bottom: 8,
        left: 8,
        width: 30,
        height: 23,
        borderRadius: 14,
        paddingTop: 5,
        paddingRight: 1,
    },
}));

export const SpotlightFormReorderableThumbs = ({
    currentSpotlights,
    currentSpotlightsLoading,
    currentValues,
    defaultWeight,
    updateWeightInValues,
    tableType,
}) => {
    console.log('SpotlightFormReorderableThumbs TOP currentValues = ', currentValues);
    console.log('SpotlightFormReorderableThumbs TOP currentSpotlights = ', currentSpotlights);
    console.log('SpotlightFormReorderableThumbs TOP !!currentSpotlights = ', !!currentSpotlights);
    if (!!currentSpotlights) {
        console.log('SpotlightFormReorderableThumbs TOP currentSpotlights.length = ', currentSpotlights.length);
    }
    console.log('SpotlightFormReorderableThumbs TOP currentSpotlightsLoading = ', currentSpotlightsLoading);

    const classes = useStyles();

    const placeholderThumbnailId = 'placeholder-thumbnail';
    // this is an image we have uploaded for use as a placeholder - its a simple grey box
    const imgUrlPlaceholder =
        'https://app-testing.library.uq.edu.au/file/public/3530e810-40e5-11ec-b167-ad28af8d7358.png';

    const [chosenWeight, setChosenWeight] = useState(null);
    const [thumbableSpotlights, setThumbableSpotlights] = useState(
        !!currentSpotlights
            ? currentSpotlights
                  .map(s => {
                      return {
                          ...s,
                          weight: defaultWeight,
                      };
                  })
                  .sort((a, b) => {
                      console.log('sorting thumbs');
                      return a.weight - b.weight;
                  })
            : [],
    );
    console.log('SpotlightFormReorderableThumbs TOP currentValues?.weight = ', currentValues?.weight);
    console.log('SpotlightFormReorderableThumbs TOP thumbableSpotlights = ', thumbableSpotlights);

    useEffect(() => {
        console.log('currentSpotlights have updated');
        if (!!currentSpotlights) {
            if (tableType === 'edit') {
                setThumbableSpotlights(
                    currentSpotlights
                        .map(s => {
                            return { ...s, weight: s?.id === currentValues.id ? currentValues?.weight : s.weight };
                        })
                        .sort((a, b) => {
                            console.log('sorting thumbs');
                            return a.weight - b.weight;
                        }),
                );
            } else if (tableType === 'add') {
                setThumbableSpotlights(
                    [
                        ...currentSpotlights,
                        {
                            id: placeholderThumbnailId,
                            img_url: imgUrlPlaceholder,
                            img_alt: 'Grey placeholder for image-to-be-uploaded when adding',
                            weight: !!chosenWeight ? chosenWeight : defaultWeight,
                        },
                    ].sort((a, b) => {
                        console.log('sorting thumbs');
                        return a.weight - b.weight;
                    }),
                );
            } else {
                // 'clone'
                setThumbableSpotlights(
                    [
                        ...currentSpotlights,
                        {
                            id: placeholderThumbnailId,
                            // eslint-disable-next-line camelcase
                            img_url: currentValues?.img_url,
                            // eslint-disable-next-line camelcase
                            img_alt: currentValues?.img_alt,
                            weight: !!chosenWeight ? chosenWeight : defaultWeight,
                        },
                    ].sort((a, b) => {
                        console.log('sorting thumbs');
                        return a.weight - b.weight;
                    }),
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSpotlights]);

    if (!isCurrentSpotlight(currentValues)) {
        return (
            <Grid item xs={10} align="left">
                <p>{locale.form.reorderThumbs.unavailable}</p>
            </Grid>
        );
    }

    const onDragEnd = result => {
        console.log('onDragEnd ', result);
        // must synchronously update state to reflect drag result
        const { destination, source, draggableId } = result;
        if (!destination) {
            console.log('onDragEnd: result.destination was not set');
            return;
        }
        console.log('DRAGGING ', source.index + 1, ' TO ', destination.index + 1);
        console.log('destination = ', destination);
        console.log('source = ', source);

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            console.log('onDragEnd: result.destination was unchanged');
            return;
        }
        const thisspotlight = thumbableSpotlights.find(s => s.id === draggableId);
        console.log('thisspotlight = ', thisspotlight);

        // set the weight on the edited spotlight to +5/+15, then let the Backend resort it to 10s on save
        const isDraggingToRight = destination.index > source.index;
        const newWeight = destination.index * 10 + (tableType === 'edit' && isDraggingToRight ? 15 : 5);

        // react-beautiful-dnd relies on the order of the array, rather than an index
        // reorder the array so we dont get a flash of the original order while we wait for the new array to load
        console.log('before array fix ', [...thumbableSpotlights]);
        moveItemInArray(thumbableSpotlights, source.index, destination.index);
        console.log('after array fix ', [...thumbableSpotlights]);
        console.log('weight was ', thisspotlight?.weight || 'weight missing', '; will be ', newWeight);
        updateWeightInValues(newWeight);
        setChosenWeight(newWeight);
    };

    if (!!currentSpotlightsLoading) {
        return (
            <Grid
                item
                xs={'auto'}
                style={{
                    width: 80,
                    marginRight: 20,
                    marginBottom: 6,
                    opacity: 0.3,
                }}
            >
                <CircularProgress color="primary" size={20} />
            </Grid>
        );
    }

    const isUploadProvided = values => {
        return !!values.uploadedFile && !!values.uploadedFile[0] && !!values.uploadedFile[0].preview;
    };

    console.log('SpotlightFormReorderableThumbs xx currentValues = ', currentValues);

    // if they drag a new image in, reuse this as the thumb
    const currentImage = (values, defaultImage) => {
        const firstFile = !!values.uploadedFile && !!values.uploadedFile[0] ? values.uploadedFile[0] : false;
        if (!!firstFile && !!firstFile.preview) {
            return firstFile.preview;
        }
        // eslint-disable-next-line camelcase
        return defaultImage;
    };

    function getCurrentImage(isThisImage, spotlight) {
        if (tableType !== 'add') {
            return isThisImage ? currentImage(currentValues, currentValues.img_url) : spotlight.img_url;
        }
        return isThisImage ? currentImage(currentValues, spotlight.img_url) : spotlight.img_url;
    }

    if (!!thumbableSpotlights) {
        console.log('thumbableSpotlights = ', thumbableSpotlights);
        console.log('isUploadProvided(currentValues) = ', isUploadProvided(currentValues));
        return (
            <Grid item xs={'auto'} style={{ maxWidth: '100%', overflow: 'auto', whiteSpace: 'nowrap' }}>
                <h3>{locale.form.reorderThumbs.header}</h3>
                <p>
                    {tableType === 'add'
                        ? locale.form.reorderThumbs.usesPlaceholder
                        : locale.form.reorderThumbs.usesCurrentImage}
                </p>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="spotlights-thumbs-reorder" direction="horizontal">
                        {droppableProvided => (
                            <div
                                data-testid="spotlights-thumbs-reorder"
                                ref={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                            >
                                {thumbableSpotlights.map((s, thumbIndex) => {
                                    console.log('thumbableSpotlights.map s = ', s);
                                    const isThisImage =
                                        tableType === 'edit'
                                            ? s?.id === currentValues.id
                                            : s?.id === placeholderThumbnailId;
                                    return (
                                        <Draggable
                                            draggableId={s.id}
                                            index={thumbIndex}
                                            key={`reorder-img-${s.id}`}
                                            isDragDisabled={!isThisImage}
                                        >
                                            {draggableProvided => (
                                                <span style={{ position: 'relative' }}>
                                                    <img
                                                        id={`reorder-img-${s.id}`}
                                                        data-testid={`reorder-img-${s.id}`}
                                                        alt={`${isThisImage ? currentValues.img_alt : s.img_alt}`}
                                                        src={getCurrentImage(isThisImage, s)}
                                                        title={isThisImage ? currentValues.img_alt : s.img_alt}
                                                        className={`${classes.reorderableThumb} ${
                                                            isThisImage ? classes.hasBorder : ''
                                                        }`}
                                                        {...draggableProvided.draggableProps}
                                                        {...draggableProvided.dragHandleProps}
                                                        ref={draggableProvided.innerRef}
                                                    />
                                                    <span className={classes.reorderableOrderNumber}>
                                                        {thumbIndex + 1}
                                                    </span>
                                                </span>
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {droppableProvided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Grid>
        );
    }

    console.log('currentSpotlights = ', currentSpotlights);

    return <p>No current spotlights</p>;
};

SpotlightFormReorderableThumbs.propTypes = {
    currentSpotlights: PropTypes.any,
    currentSpotlightsLoading: PropTypes.any,
    currentValues: PropTypes.any,
    defaultWeight: PropTypes.any,
    updateWeightInValues: PropTypes.any,
    tableType: PropTypes.string,
};

export default React.memo(SpotlightFormReorderableThumbs);
