import React from 'react';
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

        let counter = 1;
        let reweightedRows = [];
        currentSpotlights.forEach((row, index) => {
            // newrow is an array that has an updated weight for the affected rows
            // the shifted row will end in 5 and the unmoved rows be a multiple of 10, eg drop row 2 between 5 and 6
            // and the new row will have weight 45, was-row 5 will have weight 40 and was-row 6 will have weight 50
            const newWeight =
                row.id !== draggableId
                    ? counter * 10 // apart from the moved item, we just count through the items, in 10s
                    : destination.index * 10 + 5; // set moved item to the nearest item plus 5 to insert between 2 rows
            const newrow = {
                ...row,
                weight: newWeight,
            };
            if (row.id !== draggableId) {
                counter++;
            }
            reweightedRows[index] = newrow;
        });

        // now make them all even 10s (so future drags also works by putting '5' on a record)
        reweightedRows = reweightedRows.sort((a, b) => {
            return a.weight - b.weight;
        });
        reweightedRows.forEach((row, index) => {
            row.weight = (index + 1) * 10;
        });

        // react-beautiful-dnd relies on the order of the array, rather than an index
        // reorder the array so we dont get a flash of the original order while we wait for the new array to load
        const oldIndex = currentSpotlights.find(r => r.id === draggableId).weight / 10 - 1;
        const newIndex = reweightedRows.find(r => r.id === draggableId).weight / 10 - 1;
        console.log('reorder ', draggableId, ' from ', oldIndex, ' to ', newIndex);
        moveItemInArray(currentSpotlights, oldIndex, newIndex);

        // set the weight on the edited spotlight to one-to-the-left + 5, then let the Backend resort it on save
        console.log('will set weight to ', reweightedRows.find(r => r.id === draggableId).weight - 5);
        setValues(prevState => {
            return { ...prevState, ['weight']: reweightedRows.find(r => r.id === draggableId).weight - 5 };
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
    if (!!currentSpotlights) {
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
                                {currentSpotlights.map((s, thumbIndex) => {
                                    const isThisImage = s.id === currentValues.id && tableType !== 'clone';
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
                                    <Draggable draggableId="reorder-img-placeholder" index={currentSpotlights.length}>
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
                                    <Draggable draggableId="reorder-img-placeholder" index={currentSpotlights.length}>
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
                                {tableType === 'clone' && (
                                    <Draggable draggableId="reorder-img-placeholder" index={currentSpotlights.length}>
                                        {draggableProvided => (
                                            <img
                                                id="reorder-img-new"
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
