/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

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
const useStyles = makeStyles(theme => ({
    contentBox: {
        minWidth: '90%',
        paddingTop: 20,
        '& img': {
            maxWidth: 800,
            height: 800,
            border: '1px solid grey',
            textAlign: 'center',
        },
        '& li': {
            marginBottom: 10,
            padding: 10,
            '&:hover': {
                backgroundColor: theme.palette.secondary.main,
                transition: 'background-color 1s ease',
            },
            '& p': {
                marginBottom: 0,
                marginTop: 1,
            },
        },
        '& [aria-labelledby="lightboxTitle"]': {
            color: 'blue',
        },
    },
    dialogPaper: {
        // make the block take up more of the page
        width: 500,
    },
    link: {
        marginBottom: 10,
        marginRight: 10,
        cursor: 'pointer',
    },
}));
export const PromoPanelAddNewDefault = ({
    isAddingDefault,
    groupName,
    promoPanelList,
    handleAddGroupDefault,
    handleCloseGroupDefault,
}) => {
    const classes = useStyles();

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
            <Dialog
                open={isAddingDefault}
                aria-labelledby="lightboxTitle"
                PaperProps={{ classes: { root: classes.dialogPaper } }}
            >
                <DialogTitle
                    id="lightboxTitle"
                    data-testid="panel-edit-date-title"
                    style={{ position: 'relative', borderBottom: '1px solid #d7d1cc', fontSize: 12 }}
                    children={<p style={{ lineHeight: 1, margin: 0 }}>{`Set a new default panel for ${groupName}`}</p>}
                />
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <FormControl className={classes.dropdown} fullWidth title={'Panel'}>
                                <InputLabel id="group-selector">Panel</InputLabel>
                                <Select
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

PromoPanelAddNewDefault.defaultProps = {
    isAddingDefault: false,
    userPanelList: [],
    promoPanelList: [],
};

export default PromoPanelAddNewDefault;
