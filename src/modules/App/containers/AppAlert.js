import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'actions';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

const AppAlert = ({ appAlert, customAlert }) => {
    let appAlerts = [];
    if (appAlert && appAlert.length > 0) {
        appAlerts = appAlert.map(item => {
            // Strip marked down links from the body and assign to Alert props
            const linkRegex = item.body.match(/\[([^\]]+)\]\(([^)]+)\)/);
            let message = item.body;
            let canHide = true;
            if (item.body.indexOf('[permanent]') > 0) {
                console.log('ping');
                message = message.replace('[permanent]', '');
                canHide = false;
            }
            console.log(message);
            let markdownBody = {};
            if (!!linkRegex && linkRegex.length === 3) {
                markdownBody = {
                    message: message.replace(linkRegex[0], '').replace('  ', ' '),
                    action: () => (window.location.href = linkRegex[2]),
                    actionButtonLabel: linkRegex[1],
                };
            }
            return {
                title: item.title,
                message: message,
                ...markdownBody,
                type: item.urgent === 1 ? 'warning' : 'info_outline',
                canHide: canHide,
            };
        });
    }
    if (!!customAlert) {
        appAlerts.push({ ...customAlert });
    }
    if (appAlerts && appAlerts.length > 0) {
        return appAlerts.map((item, index) => (
            <div style={{ width: '100%' }} key={index}>
                <Alert {...item} alertId={`alert-${index}`} />
            </div>
        ));
    } else {
        return null;
    }
};

AppAlert.propTypes = {
    appAlert: PropTypes.array,
    customAlert: PropTypes.object,
};

const mapStateToProps = state => ({
    appAlert:
        state.get('appReducer') && state.get('appReducer').alertStatus ? state.get('appReducer').alertStatus : null,
    customAlert:
        state.get('appReducer') && state.get('appReducer').appAlert ? { ...state.get('appReducer').appAlert } : null,
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
});

const AppAlertContainer = connect(mapStateToProps, mapDispatchToProps)(AppAlert);

export default AppAlertContainer;
