import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { styled } from '@mui/material/styles';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';

import { dlorAdminLink } from 'modules/Pages/Admin/DigitalLearningObjects/dlorAdminHelpers';
import DlorAdminBreadcrumbs from 'modules/Pages/Admin/DigitalLearningObjects/SharedDlorComponents/DlorAdminBreadcrumbs';

import { scrollToTopOfPage } from 'helpers/general';
import {
    convertSnakeCaseToKebabCase,
    getDlorViewPageUrl,
    toTitleCase,
} from 'modules/Pages/DigitalLearningObjects/dlorHelpers';
import { breadcrumbs } from 'config/routes';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const StyledDraggableListItem = styled('li')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px', // Add margin to the bottom
    padding: '10px', // Add padding for better spacing
    backgroundColor: '#f9f9f9', // Optional: Add background color for better visibility
    border: '1px solid #ddd', // Optional: Add border for better visibility
    borderRadius: '4px', // Optional: Add border radius for better visibility
    [theme.breakpoints.up('lg')]: {
        marginLeft: '-50px',
        marginRight: '50px',
    },
}));

const StyledSeriesEditForm = styled('form')(() => ({
    width: '100%',
}));

const StyledSeriesList = styled('ul')(() => ({
    listStyleType: 'none',
}));

const StyledErrorMessageBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.up('lg')]: {
        marginLeft: '-50px',
        marginRight: '50px',
    },
}));

const DraggableListItem = React.memo(({ item, index, moveItem, handleChange }) => {
    const ref = React.useRef(null);
    const [, drop] = useDrop({
        accept: 'LIST_ITEM',
        hover(draggedItem) {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'LIST_ITEM',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <StyledDraggableListItem ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <span data-testid={`dlor-series-edit-draggable-title-${item?.object_public_uuid}`}>
                {item.object_title}{' '}
                {item.object_status !== 'current' && <b>{`(${toTitleCase(item.object_status)})`}</b>}
            </span>
            <div>
                <Input
                    id={`object_series_order-${item.object_public_uuid}`}
                    data-testid={`object-series-order-${convertSnakeCaseToKebabCase(item.object_public_uuid)}`}
                    required
                    value={item.object_series_order}
                    onChange={handleChange(`linked_object_series_order-${item.object_public_uuid}`)}
                    sx={{ marginRight: '10px' }}
                />
                <a href={getDlorViewPageUrl(item?.object_public_uuid)} data-testid={`dlor-series-edit-view-${item.object_id}`} target="_blank">
                    <VisibilityIcon sx={{ color: 'black' }} />
                </a>
            </div>
        </StyledDraggableListItem>
    );
});

export const DLOSeriesEdit = ({
    actions,
    dlorItemUpdating,
    dlorUpdatedItemError,
    dlorUpdatedItem,
    dlorList,
    dlorListLoading,
    dlorListError,
    dlorSeries,
    mode
}) => {
    const handleEditorChange = (fieldname, newContent) => {
        const newValues = { ...formValues, [fieldname]: newContent };
        setFormValues(newValues);
    };

    const { dlorSeriesId } = useParams();
    const [cookies, setCookie] = useCookies();

    const [originalSeriesDetails, setOriginalSeriesDetails] = useState({
        series_id: '',
        series_name: '',
    });
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        series_name: '',
        series_description: '',
        object_list_linked: [],
        object_list_unassigned: [],
    });

    const moveItem = (fromIndex, toIndex) => {
        const updatedList = [...formValues.object_list_linked];
        const [movedItem] = updatedList.splice(fromIndex, 1);
        updatedList.splice(toIndex, 0, movedItem);

        // Update the object_series_order property
        updatedList.forEach((item, index) => {
            item.object_series_order = index + 1;
        });

        setFormValues({ ...formValues, object_list_linked: updatedList });
    };

    const editorConfig = {
        removePlugins: [
            'Image',
            'ImageCaption',
            'ImageStyle',
            'ImageToolbar',
            'ImageUpload',
            'EasyImage',
            'CKFinder',
            'BlockQuote',
            'Table',
            'MediaEmbed',
        ],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading2', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            ],
        },
    };

    useEffect(() => {
        setConfirmationOpen(!dlorItemUpdating && (!!dlorUpdatedItemError || !!dlorUpdatedItem));
    }, [dlorItemUpdating, dlorUpdatedItemError, dlorUpdatedItem]);

    const isValidSeriesName = seriesName => {
        return seriesName?.trim() !== '';
    };

    const isValidForm = currentValues => {
        return isValidSeriesName(currentValues?.series_name);
    };

    useEffect(() => {
        const siteHeader = document.querySelector('uq-site-header');
        !!siteHeader && siteHeader.setAttribute('secondleveltitle', breadcrumbs.dloradmin.title);
        !!siteHeader && siteHeader.setAttribute('secondLevelUrl', breadcrumbs.dloradmin.pathname);

        if (!dlorListError && !dlorListLoading && !dlorList) {
            actions.loadAllDLORs();
            if (dlorSeriesId) {
                console.log("Loading DLOR Series");
                actions.loadDlorSeries(dlorSeriesId)
            }
        }
    }, []);

    useEffect(() => {
        console.log("DLOR SERIES", dlorSeries)
        if (!dlorListLoading && !dlorListError && (!!dlorList || !!dlorSeries?.series_name)) {
            setConfirmationOpen(false);
            let seriesDetail = !!dlorList && dlorList?.find(s => s.object_series_id === Number(dlorSeriesId)) || {};
            if (Object.keys(seriesDetail).length === 0) {
                console.log("Doing the things")
                seriesDetail.object_series_id = dlorSeriesId;
                seriesDetail.object_series_name = dlorSeries?.series_name,
                seriesDetail.object_series_description = dlorSeries?.series_description
            }
            mode === "EDIT" && setOriginalSeriesDetails({
                series_id: seriesDetail?.object_series_id,
                series_name: seriesDetail?.object_series_name,
                series_description: seriesDetail?.object_series_description
            });
            console.log("About to set the values", seriesDetail, dlorSeries)
            setFormValues({
                series_name: seriesDetail?.object_series_name,
                series_description: seriesDetail?.object_series_description,
                object_list_linked:
                    dlorList?.length > 0
                        ? dlorList?.filter(o => {
                              return o.object_series_id === Number(dlorSeriesId);
                          })
                        : [],
                object_list_unassigned:
                    dlorList?.length > 0
                        ? dlorList?.filter(d => {
                              return !(d?.object_series_id > 0);
                          })
                        : [],
            });
        }
    }, [dlorSeriesId, dlorList, dlorListError, dlorListLoading, actions, dlorSeries]);

    function closeConfirmationBox() {
        setConfirmationOpen(false);
    }

    const navigateToSeriesManagementHomePage = () => {
        closeConfirmationBox();
        window.location.href = dlorAdminLink('/series/manage');
        scrollToTopOfPage();
    };
    const navigateToPreviousPage = () => {
        window.location.href = dlorAdminLink('/series/manage');
    };

    const clearForm = () => {
        closeConfirmationBox();
        window.location.reload(false);
    };

    const locale = {
        successMessage: {
            confirmationTitle: mode == "EDIT" ? 'Changes have been saved' : 'Series has been created',
            confirmationMessage: '',
            cancelButtonLabel: mode == "EDIT" ? 'Re-edit Series' : 'Add a new Series',
            confirmButtonLabel: 'Return to Admin Series page',
        },
        errorMessage: {
            confirmationTitle: dlorUpdatedItemError,
            confirmationMessage: '',
            confirmButtonLabel: 'Close',
        },
    };

    const handleChange = prop => e => {
        const theNewValue = e.target.value;
        let newValues;
        let linked = formValues.object_list_linked;
        let unassigned = formValues.object_list_unassigned;
        if (prop.startsWith('linked_object_series_order-')) {
            const uuid = prop.replace('linked_object_series_order-', '');
            const thisdlor = linked.find(d => d.object_public_uuid === uuid);
            const indexToRemove = linked.findIndex(d => d.object_public_uuid === uuid);
            thisdlor.object_series_order = e.target.value;
            if (e.target.value === "0") {
                if (indexToRemove !== -1) {
                    linked.splice(indexToRemove, 1);
                }
                thisdlor.object_series_order = null;
                unassigned.push(thisdlor);
            } else {
                linked.map(d => d.object_public_uuid === uuid && (d.object_series_order = e.target.value));
            }
            linked = linked.sort((a, b) => a.object_series_order - b.object_series_order);
            unassigned.sort((a, b) => a.object_title.localeCompare(b.object_title));
            newValues = {
                series_name: formValues.series_name,
                series_description: formValues.series_description,
                object_list_linked: linked,
                object_list_unassigned: unassigned,
            };
        } else if (prop.startsWith('unassigned_object_series_order-')) {
            const uuid = prop.replace('unassigned_object_series_order-', '');
            const thisdlor = unassigned.find(d => d.object_public_uuid === uuid);
            const indexToRemove = unassigned.findIndex(d => d.object_public_uuid === uuid);
            thisdlor.object_series_order = e.target.value;

            if (e.target.value !== 0) {
                if (indexToRemove !== -1) {
                    unassigned.splice(indexToRemove, 1);
                }
                linked.push(thisdlor);
            }
            linked = linked.sort((a, b) => a.object_series_order - b.object_series_order);
            unassigned.sort((a, b) => a.object_title.localeCompare(b.object_title));
            newValues = {
                series_name: formValues.series_name,
                series_description: formValues.series_description,
                object_list_linked: linked,
                object_list_unassigned: unassigned,
            };
        } else {
            newValues = { ...formValues, [prop]: theNewValue };
        }

        setFormValues(newValues);
    };

    const saveChanges = () => {
        const valuesToSend = {
            series_name: formValues.series_name,
            series_description: formValues.series_description,
            series_list: formValues.object_list_linked
                .filter(item => Number(item.object_series_order) > 0)
                .map(item => ({
                    object_public_uuid: item.object_public_uuid,
                    object_series_order: Number(item.object_series_order),
                })),
        };

        const cypressTestCookie = cookies.hasOwnProperty('CYPRESS_TEST_DATA') ? cookies.CYPRESS_TEST_DATA : null;
        if (!!cypressTestCookie && location.host === 'localhost:2020' && cypressTestCookie === 'active') {
            setCookie('CYPRESS_DATA_SAVED', valuesToSend);
        }
        if (mode === "EDIT") {
            actions.updateDlorSeries(dlorSeriesId, valuesToSend);
        } else {
            actions.createDlorSeries(valuesToSend);
        }
    };

    function toProperCase(text) {
        return text.replace(/\w\S*/g, function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); 
        });
      }

    return (
        <DndProvider backend={HTML5Backend}>
            <StandardPage title={`Digital Learning Hub - ${toProperCase(mode)} Series`}>
                <DlorAdminBreadcrumbs
                    breadCrumbList={[
                        {
                            link: dlorAdminLink('/series/manage'),
                            title: 'Series management',
                        },
                        {
                            title: `${toProperCase(mode)} series: ${originalSeriesDetails.series_name || ''}`,
                            id: 'edit-series',
                        },
                    ]}
                />
                <Grid container spacing={2}>
                    {(() => {
                        if (!!dlorItemUpdating || !!dlorListLoading) {
                            return (
                                <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                    <Box sx={{ minHeight: '600sx=' }}>
                                        <InlineLoader message="Loading" />
                                    </Box>
                                </Grid>
                            );
                        } else if (!!dlorListError) {
                            return (
                                <Grid item xs={12} md={9} sx={{ marginTop: '12px' }}>
                                    <Typography variant="body1" data-testid="dlor-seriesItem-error">
                                        {dlorListError}
                                    </Typography>
                                </Grid>
                            );
                        } else if (!!originalSeriesDetails) {
                            return (
                                <>
                                    <Grid item xs={12} data-testid="dlor-series-item-list">
                                        <Grid container key={`list-series-${originalSeriesDetails.series_id}`}>
                                            <ConfirmationBox
                                                actionButtonColor="primary"
                                                actionButtonVariant="contained"
                                                confirmationBoxId="dlor-series-save-outcome"
                                                onAction={() => {
                                                    !!dlorUpdatedItemError
                                                        ? closeConfirmationBox()
                                                        : navigateToSeriesManagementHomePage();
                                                }}
                                                hideCancelButton={
                                                    !!dlorUpdatedItemError || !locale.successMessage.cancelButtonLabel
                                                }
                                                cancelButtonLabel={locale.successMessage.cancelButtonLabel}
                                                onCancelAction={() => clearForm()}
                                                onClose={closeConfirmationBox}
                                                isOpen={confirmationOpen}
                                                locale={
                                                    !!dlorUpdatedItemError ? locale.errorMessage : locale.successMessage
                                                }
                                            />
                                            <StyledSeriesEditForm id={`dlor-${mode.toLowerCase()}Series-form`}>
                                                <Grid item xs={12}>
                                                    <FormControl variant="standard" fullWidth>
                                                        <InputLabel htmlFor="series_name">Series name *</InputLabel>
                                                        <Input
                                                            id="series_name"
                                                            data-testid="series-name"
                                                            required
                                                            value={formValues?.series_name}
                                                            onChange={handleChange('series_name')}
                                                            error={!isValidSeriesName(formValues?.series_name)}
                                                        />
                                                    </FormControl>
                                                    {!!dlorList && !isValidSeriesName(formValues?.series_name) && (
                                                        <StyledErrorMessageBox data-testid="error-message-series-name">
                                                            This series name is not valid.
                                                        </StyledErrorMessageBox>
                                                    )}
                                                </Grid>
                                                {!!dlorList && !!isValidSeriesName(formValues?.series_name) && (
                                                    <FormControl variant="standard" fullWidth sx={{ paddingTop: '50px' }}>
                                                        <InputLabel htmlFor="object_description">Description of Series</InputLabel>
                                                        <CKEditor
                                                            id="object_description"
                                                            data-testid="object-description"
                                                            sx={{ width: '100%' }}
                                                            editor={ClassicEditor}
                                                            config={editorConfig}
                                                            data={formValues?.series_description || ""}
                                                            onReady={editor => {
                                                                editor.editing.view.change(writer => {
                                                                    writer.setStyle('height', '200px', editor.editing.view.document.getRoot());
                                                                });
                                                            }}
                                                            onChange={(event, editor) => {
                                                                const htmlData = editor.getData();
                                                                handleEditorChange('series_description', htmlData);
                                                            }}
                                                        />
                                                    </FormControl>
                                                )}
                                            </StyledSeriesEditForm>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <h2>Objects in this series</h2>
                                        <div id="dragLandingAarea">
                                            {formValues?.object_list_linked?.length === 0 && <p>(None yet)</p>}
                                            <StyledSeriesList>
                                                {formValues?.object_list_linked
                                                    ?.sort((a, b) => a.object_series_order - b.object_series_order)
                                                    .map((item, index) => (
                                                        <DraggableListItem
                                                            key={item.object_id}
                                                            item={item}
                                                            index={index}
                                                            moveItem={moveItem}
                                                            handleChange={handleChange}
                                                        />
                                                    ))}
                                            </StyledSeriesList>
                                        </div>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <details>
                                            <Typography
                                                component={'summary'}
                                                sx={{
                                                    fontSize: '1.3em',
                                                    fontWeight: 'bold',
                                                }}
                                                data-testid="admin-dlor-series-summary-button"
                                            >
                                                Objects available to add to this series
                                            </Typography>
                                            <StyledSeriesList>
                                                {formValues?.object_list_unassigned?.map(f => {
                                                    return (
                                                        <StyledDraggableListItem
                                                            key={f.object_id}
                                                        >
                                                            <span
                                                                data-testid={`dlor-series-${mode.toLowerCase()}-draggable-title-${convertSnakeCaseToKebabCase(
                                                                    f?.object_public_uuid,
                                                                )}`}
                                                            >
                                                                {f.object_title}{' '}
                                                                {f.object_status !== 'current' && (
                                                                    <b>{`(${toTitleCase(f.object_status)})`}</b>
                                                                )}
                                                            </span>
                                                            <div>
                                                                <Input
                                                                    id={`object_series_order-${f.object_public_uuid}`}
                                                                    data-testid={`object-series-order-${convertSnakeCaseToKebabCase(
                                                                        f.object_public_uuid,
                                                                    )}`}
                                                                    required
                                                                    value={f.object_series_order}
                                                                    onChange={handleChange(
                                                                        `unassigned_object_series_order-${f.object_public_uuid}`,
                                                                    )}
                                                                    sx={{ marginRight: '10px' }}
                                                                />
                                                                <a href={getDlorViewPageUrl(f?.object_public_uuid)}>
                                                                    <VisibilityIcon sx={{ color: 'black' }} />
                                                                </a>
                                                            </div>
                                                        </StyledDraggableListItem>
                                                    );
                                                })}
                                            </StyledSeriesList>
                                        </details>
                                    </Grid>

                                    <Grid item xs={3} align="left">
                                        <Button
                                            color="secondary"
                                            children="Cancel"
                                            data-testid="admin-dlor-series-form-button-cancel"
                                            onClick={() => navigateToPreviousPage()}
                                            variant="contained"
                                        />
                                    </Grid>
                                    <Grid item xs={9} align="right">
                                        <Button
                                            color="primary"
                                            data-testid="admin-dlor-series-form-save-button"
                                            variant="contained"
                                            children="Save"
                                            disabled={!isValidForm(formValues)}
                                            onClick={saveChanges}
                                        />
                                    </Grid>
                                </>
                            );
                        }
                        return <></>;
                    })()}
                </Grid>
            </StandardPage>
        </DndProvider>
    );
};

DLOSeriesEdit.propTypes = {
    actions: PropTypes.any,
    dlorItemUpdating: PropTypes.bool,
    dlorUpdatedItemError: PropTypes.any,
    dlorUpdatedItem: PropTypes.object,
    dlorList: PropTypes.array,
    dlorListLoading: PropTypes.bool,
    dlorListError: PropTypes.any,
    mode: PropTypes.string
};

export default DLOSeriesEdit;
