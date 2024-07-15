/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
export const PromoPanelAddNewDefault = ({
    isAddingDefault = false,
    groupName,
    promoPanelList = [],
    handleAddGroupDefault,
    handleCloseGroupDefault,
}) => {
    const [selectedPanel, setSelectedPanel] = useState('');
    const [AvailablePanels, setAvailablePanels] = useState(promoPanelList);
    // const [showError, setShowError] = useState(false);
    // const [errorMessage, setErrorMessage] = useState('');

    const handlePanelChange = event => {
        const {
            target: { value },
        } = event;
        setSelectedPanel(value);
    };

    useEffect(() => {
        const available = [];
        promoPanelList.length > 0 &&
            promoPanelList.map(item => {
                if (item.panel_schedule.length < 1) {
                    available.push(item);
                }
            });
        setAvailablePanels(available);
    }, [promoPanelList]);

    const handleGroupDefault = () => {
        handleAddGroupDefault(selectedPanel, groupName);
    };

    return (
        <React.Fragment>
            <Dialog open={isAddingDefault} aria-labelledby="lightboxTitle" PaperProps={{ style: { width: 500 } }}>
                <DialogTitle
                    id="lightboxTitle"
                    data-testid="panel-edit-date-title"
                    style={{ position: 'relative', borderBottom: '1px solid #d7d1cc', fontSize: 12 }}
                    children={
                        <h2 style={{ lineHeight: 1, margin: 0 }}>{`Set a new default panel for ${groupName}`}</h2>
                    }
                />
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <FormControl variant="standard" className={'dropdown'} fullWidth title={'Panel'}>
                                <InputLabel id="group-selector">Panel</InputLabel>
                                <Select
                                    variant="standard"
                                    labelId="group-selector"
                                    id="new-default-panel-for-group"
                                    label="Panel"
                                    value={selectedPanel}
                                    onChange={handlePanelChange}
                                    MenuProps={MenuProps}
                                >
                                    {AvailablePanels.map(item => (
                                        <MenuItem key={item.panel_id} value={item.panel_id}>
                                            <ListItemText primary={item.panel_title} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {/* {showError && (
                        <Grid item xs={12}>
                            {errorMessage}
                        </Grid>
                    )} */}

                    <Grid item xs={12} align="right">
                        <Button
                            style={{ marginTop: 10 }}
                            color="secondary"
                            children="Cancel"
                            data-testid="admin-promopanel-group-button-cancel"
                            variant="contained"
                            onClick={handleCloseGroupDefault}
                        />
                        <Button
                            style={{ marginTop: 10 }}
                            color="primary"
                            children="Save"
                            data-testid="admin-promopanel-group-button-save"
                            variant="contained"
                            disabled={selectedPanel === ''}
                            onClick={handleGroupDefault}
                        />
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
};

PromoPanelAddNewDefault.propTypes = {
    isAddingDefault: PropTypes.bool,
    groupName: PropTypes.string,
    userPanelList: PropTypes.array,
    promoPanelList: PropTypes.array,
    handleAddGroupDefault: PropTypes.func,
    handleCloseGroupDefault: PropTypes.func,
};

export default PromoPanelAddNewDefault;
