import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import ContributorRowHeader from './ContributorRowHeader';
import ContributorRow from './ContributorRow';
import ContributorForm from './ContributorForm';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import { locale } from 'locale';

export class ContributorsEditor extends PureComponent {
    static propTypes = {
        author: PropTypes.object,
        classes: PropTypes.object,
        disabled: PropTypes.bool,
        hideDelete: PropTypes.bool,
        hideReorder: PropTypes.bool,
        input: PropTypes.object,
        isNtro: PropTypes.bool,
        locale: PropTypes.object,
        meta: PropTypes.object,
        onChange: PropTypes.func,
        required: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        showIdentifierLookup: PropTypes.bool,
        showRoleInput: PropTypes.bool,
        initialValues: PropTypes.object,
    };

    static defaultProps = {
        hideDelete: false,
        hideReorder: false,
        isNtro: false,
        locale: {
            errorTitle: 'Error',
            errorMessage: 'Unable to add an item with the same identifier.'
        },
        showContributorAssignment: false,
        showIdentifierLookup: false,
        showRoleInput: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            contributors: this.getContributorsFromProps(props) || [],
            errorMessage: '',
            isCurrentAuthorSelected: false,
            showIdentifierLookup: false,
        };
        if (props.initialValues) {
            this.state.contributors = props.initialValues.authors || [];
        }
    }

    componentWillUpdate = (nextProps, nextState) => {
        // notify parent component when local state has been updated, eg contributors added/removed/reordered
        if (this.props.onChange) {
            this.props.onChange(nextState.contributors);
        }
    };

    getContributorsFromProps = (props) => {
        if (props.input && props.input.name && props.input.value) {
            return (
                props.input.value instanceof Immutable.List
                    ? props.input.value.toJS()
                    : props.input.value
            );
        }

        return [];
    };

    addContributor = (contributor) => {
        // only unique identifiers can be added
        if (this.state.contributors.filter(item => {
            return !!contributor.aut_id && item.aut_id === contributor.aut_id;
        }).length > 0) {
            this.setState({
                errorMessage: this.props.locale.errorMessage
            });
        } else {
            contributor.disabled = !!contributor.aut_id;

            this.setState({
                contributors: [...this.state.contributors, contributor],
                errorMessage: '',
                isCurrentAuthorSelected: this.state.isCurrentAuthorSelected || (
                    this.props.author &&
                    contributor.aut_id === this.props.author.aut_id
                )
            }, () => {
                // try to automatically select contributor if they are a current author
                if (this.props.author && contributor.aut_id === this.props.author.aut_id) {
                    this.assignContributor(contributor, this.state.contributors.length - 1);
                }
            });
        }
    };

    updateContributor = (contributor, index) => {
        const newContributor = {
            ...this.state.contributors[index],
            ...contributor,
            selected: false,
        };
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index),
                newContributor,
                ...this.state.contributors.slice(index + 1)
            ]
        });
    };

    moveUpContributor = (contributor, index) => {
        if (index === 0) return;
        const nextContributor = this.state.contributors[index - 1];
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index - 1),
                contributor, nextContributor,
                ...this.state.contributors.slice(index + 1)]
        });
    };

    moveDownContributor = (contributor, index) => {
        if (index === (this.state.contributors.length - 1)) return;
        const nextContributor = this.state.contributors[index + 1];
        this.setState({
            contributors: [
                ...this.state.contributors.slice(0, index),
                nextContributor, contributor,
                ...this.state.contributors.slice(index + 2)]
        });
    };

    deleteContributor = (contributor, index) => {
        this.setState({
            contributors: this.state.contributors.filter((_, i) => i !== index),
            isCurrentAuthorSelected: this.state.isCurrentAuthorSelected && (
                this.props.author &&
                contributor.aut_id !== this.props.author.aut_id
            )
        });
    };

    deleteAllContributors = () => {
        this.setState({
            contributors: [],
            isCurrentAuthorSelected: false
        });
    };

    assignContributor = (contributor, index) => {
        const newContributors = this.state.contributors.map((item, itemIndex) => ({
            ...item,
            selected: (
                !this.props.initialValues &&
                this.props.author &&
                item.aut_id === this.props.author.aut_id
            ) || (
                index === itemIndex &&
                !contributor.selected
            ),
            authorId: (
                !this.props.initialValues &&
                index === itemIndex &&
                this.props.author
            ) ? this.props.author.aut_id : null
        }));
        this.setState({
            contributors: newContributors
        });
    };

    renderContributorRows = () => {
        const {
            disabled,
            hideDelete,
            hideReorder,
            showContributorAssignment,
            locale,
        } = this.props;

        const {
            contributors,
            isCurrentAuthorSelected,
        } = this.state;

        return contributors.map((contributor, index) => (
            <ContributorRow
                {...((locale || {}).row || {})}
                canMoveDown={index !== contributors.length - 1}
                canMoveUp={index !== 0}
                contributor={contributor}
                contributorSuffix={locale.contributorSuffix}
                disabled={disabled}
                hideDelete={hideDelete}
                hideReorder={hideReorder}
                index={index}
                key={`ContributorRow_${index}`}
                onSelect={this.assignContributor}
                onDelete={this.deleteContributor}
                onMoveDown={this.moveDownContributor}
                onMoveUp={this.moveUpContributor}
                showContributorAssignment={showContributorAssignment && !isCurrentAuthorSelected}
            />
        ));
    };

    renderContributorForm = (onSubmit, index) => {
        const formLocale = {
            ...((this.props.locale || {}).form || {}).locale,
            global: {
                orgTitle: locale.global.orgTitle
            }
        };

        const formProps = {
            ...this.props,
            isContributorAssigned: !!this.state.contributors,
            locale: formLocale,
            onSubmit: contributor => onSubmit(contributor, index),
        };

        const contributor = this.state.contributors[index];

        if (this.props.initialValues) {
            formProps.locale.addButton = 'Update author';
            formProps.contributor = contributor;
            formProps.showIdentifierLookup = formProps.contributor.affiliation === 'UQ';
            formProps.initialValues = this.props.initialValues.authors[index];
        }

        return (
            <ContributorForm {...formProps} />
        );
    };

    render() {
        const {
            classes,
            disabled,
            hideDelete,
            isNtro,
            showContributorAssignment,
            showIdentifierLookup,
            showRoleInput,
            initialValues
        } = this.props;

        const {
            contributors,
            errorMessage,
        } = this.state;

        let error = null;
        if ((this.props.meta || {}).error) {
            error = !!this.props.meta.error.props &&
                React.Children.map(
                    this.props.meta.error.props.children,
                    (child, index) => {
                        return (
                            child.type
                                ? React.cloneElement(child, { key: index })
                                : child
                        );
                    }
                )
            ;
        }

        const selectedContributorIndex = contributors.findIndex(contributor => contributor.selected);

        return (
            <div>

                {
                    errorMessage &&
                    <Alert
                        title={this.props.locale.errorTitle}
                        message={errorMessage}
                        type="warning"
                    />
                }
                {
                    !initialValues &&
                    this.renderContributorForm(this.addContributor)
                }
                {
                    contributors.length > 0 &&
                    <Grid container spacing={8}>
                        <Grid item xs={12}>
                            <List>
                                <ContributorRowHeader
                                    {...((this.props.locale || {}).header || {})}
                                    disabled={disabled}
                                    hideDelete={hideDelete}
                                    isInfinite={contributors.length > 3}
                                    isNtro={isNtro}
                                    onDeleteAll={this.deleteAllContributors}
                                    showContributorAssignment={showContributorAssignment}
                                    showIdentifierLookup={showIdentifierLookup}
                                    showRoleInput={showRoleInput}
                                />
                            </List>
                        </Grid>
                        <Grid item xs={12}>
                            <List classes={{
                                root: `${classes.list} ${(contributors.length > 3) ? classes.scroll : ''}`
                            }}>
                                {this.renderContributorRows()}
                            </List>
                            {
                                initialValues &&
                                selectedContributorIndex > -1 &&
                                <div style={{marginTop: 24}}>
                                    {this.renderContributorForm(this.updateContributor, selectedContributorIndex)}
                                </div>
                            }
                        </Grid>
                    </Grid>
                }
                {
                    (this.props.meta || {}).error &&
                    <Typography color="error" variant="caption">
                        {
                            error || this.props.meta.error
                        }
                    </Typography>
                }
            </div>
        );
    }
}

export const mapStateToProps = (state) => {
    return {
        author: state && state.get('accountReducer')
            ? state.get('accountReducer').author
            : null
    };
};

export const styles = () => ({
    list: {
        width: '98%',
        margin: '0 1%',
        maxHeight: 200,
        overflow: 'hidden',
        marginBottom: 8
    },
    scroll: {
        overflowY: 'scroll'
    }
});

export default withStyles(styles)(connect(mapStateToProps)(ContributorsEditor));
