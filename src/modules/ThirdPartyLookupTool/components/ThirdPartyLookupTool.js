import React, {Fragment, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';

import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import {InlineLoader} from 'modules/SharedComponents/Toolbox/Loaders';

import {ThirdPartyLookupForm} from './ThirdPartyLookupForm';
import {ThirdPartyLookupFormResult} from './ThirdPartyLookupFormResult';

/**
 * This component is intended to replace https://espace.library.uq.edu.au/misc/api_view_info.php
 * but only an additional form (incites) has been done at this point
 * As each form comes in:
 * - add an entry to locale/components.js under .thirdPartyLookupTools.forms as a sibling to .incites;
 *          - match the contents of the incites entry
 *          - the secondary field is optional
 *          - add a new form entry below (once we have more than one component use the default isMinimised value so they load minimised)
 * - create a new api (use FezCoreLookupController) that returns the desired data, with a url of:
 *    tool/lookup/[components.thirdPartyLookupTools.forms.sibling]/[keys to search for]/[possible other field you need]
 *    ie the api url that incites calls is: eg
 *    "https://api.library.uq.edu.au/staging/tool/lookup/incites/A1979HY31900010,A1979HY31900068/[APIKEY]".
 * - and that should be all that is required (but do examine how the result is displayed...)
 */
export class ThirdPartyLookupTool extends PureComponent {
    static propTypes = {
        actions: PropTypes.object,
        lookupResults: PropTypes.array,
        loadingResults: PropTypes.bool,
    };
    static defaultProps = {
        lookupResults: [],
        loadingResults: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            primaryValue: '',
            secondaryValue: '',
        };
    }

    recordInputs = (primaryValue, secondaryValue) => {
        this.state.primaryValue = primaryValue;
        this.state.secondaryValue = secondaryValue;
    };

    render() {
        const localeContent = locale.components.thirdPartyLookupTools;
        // console.log('1');
        // console.log(localeContent);
        // delete localeContent.forms; // cleanup so we dont pass the forms values twice / dont give the form access to a non-current form...
        // console.log('2');
        // console.log(localeContent);
        return (
            <StandardPage title={localeContent.title}>
                {
                    this.props.loadingResults &&
                    <InlineLoader message={localeContent.loadingMessage}/>
                }
                {
                    !this.props.loadingResults && !!locale.components.thirdPartyLookupTools.forms &&
                    !!this.props.lookupResults && this.props.lookupResults.length > 0 &&
                    <ThirdPartyLookupFormResult
                        lookupResults={this.props.lookupResults}
                        actions={this.props.actions}
                        localeform={locale.components.thirdPartyLookupTools.forms.incites}
                        primaryValue={this.state.primaryValue}
                        secondaryValue={this.state.secondaryValue}
                    />
                }

                {
                    !this.props.loadingResults && !!locale.components.thirdPartyLookupTools.forms &&
                    !!this.props.lookupResults && this.props.lookupResults.length === 0 &&
                    <Fragment>
                        {/* incites */}
                        <ThirdPartyLookupForm
                            isMinimised={false}
                            locale={localeContent}
                            localeform={locale.components.thirdPartyLookupTools.forms.incites}
                            actions={this.props.actions}
                            sendInputsToResultComponent={this.recordInputs} // function
                        />

                        {/* put more forms here */}

                    </Fragment>
                }
            </StandardPage>
        );
    }
}

export default ThirdPartyLookupTool;
