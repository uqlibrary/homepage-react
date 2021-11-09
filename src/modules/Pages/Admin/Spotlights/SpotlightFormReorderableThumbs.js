import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import { default as locale } from 'modules/Pages/Admin/Spotlights/spotlightsadmin.locale';
import { isCurrentSpotlight, moveItemInArray } from './spotlighthelpers';

const useStyles = makeStyles(() => ({
    hasBorder: {
        height: 60,
        marginRight: 5,
        border: '3px solid black',
    },
    noBorder: {
        height: 60,
        marginRight: 5,
    },
    placeholderBlock: {
        height: 54,
        width: 157,
        backgroundColor: 'grey',
        border: '3px solid black',
        display: 'inline-block',
    },
}));

export const SpotlightFormReorderableThumbs = ({
    currentSpotlights,
    currentSpotlightsLoading,
    currentValues,
    setValues,
    tableType,
}) => {
    console.log('SpotlightFormReorderableThumbs currentValues = ', currentValues);
    console.log('SpotlightFormReorderableThumbs currentSpotlights = ', currentSpotlights);
    console.log('SpotlightFormReorderableThumbs !!currentSpotlights = ', !!currentSpotlights);
    !!currentSpotlights &&
        console.log('SpotlightFormReorderableThumbs currentSpotlights.length = ', currentSpotlights.length);
    console.log('SpotlightFormReorderableThumbs currentSpotlightsLoading = ', currentSpotlightsLoading);
    const classes = useStyles();

    const imgUrlPlaceholder =
        'https://app-testing.library.uq.edu.au/file/public/3530e810-40e5-11ec-b167-ad28af8d7358.png';

    const [thumbableSpotlights, setThumbableSpotlights] = useState(currentSpotlights);

    const placeholderThumbnailId = 'placeholder-thumbnail';

    useEffect(() => {
        if (!!currentSpotlights) {
            if (tableType === 'edit') {
                setThumbableSpotlights([...currentSpotlights]);
            } else {
                if (tableType === 'add') {
                    setThumbableSpotlights([
                        ...currentSpotlights,
                        {
                            id: placeholderThumbnailId,
                            img_url: imgUrlPlaceholder,
                            img_alt: 'Grey placeholder for image-to-be-uploaded when adding',
                            weight: 1000,
                        },
                    ]);
                } else {
                    // clone
                    setThumbableSpotlights([
                        ...currentSpotlights,
                        {
                            id: placeholderThumbnailId,
                            // eslint-disable-next-line camelcase
                            img_url: currentValues?.img_url,
                            // eslint-disable-next-line camelcase
                            img_alt: currentValues?.img_alt,
                            weight: 1000,
                        },
                    ]);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSpotlights]);

    if (!isCurrentSpotlight(currentValues)) {
        return (
            <Grid item xs={10} align="left">
                <p>Reordering only available for current spotlights</p>
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
        // set the weight on the edited spotlight to + 5, then let the Backend resort it to 10s on save
        let newWeight;
        if (destination.index > source.index) {
            // moving right
            newWeight = destination.index * 10 + 15;
        } else {
            // moving  left
            newWeight = destination.index * 10 + 5;
        }
        // const newWeight = destination.index * 10 + 5;

        // react-beautiful-dnd relies on the order of the array, rather than an index
        // reorder the array so we dont get a flash of the original order while we wait for the new array to load
        moveItemInArray(thumbableSpotlights, source.index, destination.index);
        console.log('weight was ', thisspotlight.weight);
        setValues(prevState => {
            console.log('setting current values to ', newWeight);
            return { ...prevState, ['weight']: newWeight };
        });
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

    // if they drag a new image in, reuse this as the thumb
    const currentImage = values => {
        const firstFile = !!values.uploadedFile && !!values.uploadedFile[0] ? values.uploadedFile[0] : false;
        if (!!firstFile && !!firstFile.preview) {
            return firstFile.preview;
        }
        return values.img_url;
    };

    const isUploadProvided = values => {
        return !!values.uploadedFile && !!values.uploadedFile[0] && !!values.uploadedFile[0].preview;
    };

    console.log('SpotlightFormReorderableThumbs xx currentValues = ', currentValues);
    if (!!thumbableSpotlights) {
        console.log('thumbableSpotlights = ', thumbableSpotlights);
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
                                ref={droppableProvided.innerRef} // innerRef={droppableProvided.innerRef}
                                {...droppableProvided.droppableProps}
                            >
                                {thumbableSpotlights.map((s, thumbIndex) => {
                                    console.log('thumbableSpotlights.map s = ', s);
                                    const isThisImage =
                                        s?.id === placeholderThumbnailId ||
                                        (s?.id === currentValues.id && tableType !== 'clone');
                                    return (
                                        <Draggable
                                            draggableId={s.id}
                                            index={thumbIndex}
                                            key={`reorder-img-${s.id}`}
                                            isDragDisabled={!isThisImage}
                                        >
                                            {draggableProvided => (
                                                <img
                                                    id={`reorder-img-${s.id}`}
                                                    data-testid={`reorder-img-${s.id}`}
                                                    alt={isThisImage ? currentValues.img_alt : s.img_alt}
                                                    src={isThisImage ? currentImage(currentValues) : s.img_url}
                                                    title={isThisImage ? currentValues.img_alt : s.img_alt}
                                                    className={`${isThisImage ? classes.hasBorder : classes.noBorder}`}
                                                    {...draggableProvided.draggableProps}
                                                    {...draggableProvided.dragHandleProps}
                                                    ref={draggableProvided.innerRef}
                                                />
                                            )}
                                        </Draggable>
                                    );
                                })}
                                {/* now add extra displays outside the list of current spotlights */}
                                {tableType === 'add' && !isUploadProvided(currentValues) && (
                                    <Draggable draggableId="reorder-img-placeholder" index={thumbableSpotlights.length}>
                                        {draggableProvided => (
                                            <span
                                                id="reorder-img-placeholder"
                                                className={classes.placeholderBlock}
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                                ref={draggableProvided.innerRef}
                                            >
                                                {' '}
                                            </span>
                                        )}
                                    </Draggable>
                                )}
                                {tableType === 'add' && isUploadProvided(currentValues) && (
                                    <Draggable draggableId="reorder-img-placeholder" index={thumbableSpotlights.length}>
                                        {draggableProvided => (
                                            <img
                                                id={`reorder-img-${currentValues.id}`}
                                                alt={currentValues.img_alt}
                                                key={`reorder-img-${currentValues.id}`}
                                                src={currentImage(currentValues)}
                                                title={currentValues.img_alt}
                                                className={classes.hasBorder}
                                                {...draggableProvided.draggableProps}
                                                {...draggableProvided.dragHandleProps}
                                                ref={draggableProvided.innerRef}
                                            />
                                        )}
                                    </Draggable>
                                )}
                                {/* {tableType === 'clone' && (*/}
                                {/*    <Draggable draggableId="reorder-img-placeholder"
                                index={thumbableSpotlights.length}>*/}
                                {/*        {draggableProvided => (*/}
                                {/*            <img*/}
                                {/*                id="reorder-img-new"*/}
                                {/*                alt={currentValues.img_alt}*/}
                                {/*                key={`reorder-img-${currentValues.id}`}*/}
                                {/*                src={currentImage(currentValues)}*/}
                                {/*                title={currentValues.img_alt}*/}
                                {/*                className={classes.hasBorder}*/}
                                {/*                {...draggableProvided.draggableProps}*/}
                                {/*                {...draggableProvided.dragHandleProps}*/}
                                {/*                ref={draggableProvided.innerRef}*/}
                                {/*            />*/}
                                {/*        )}*/}
                                {/*    </Draggable>*/}
                                {/* )}*/}
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
    setValues: PropTypes.any,
    tableType: PropTypes.string,
};

export default SpotlightFormReorderableThumbs;
