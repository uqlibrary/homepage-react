import React from 'react';
import PropTypes from 'prop-types';

const DashboardAuthorDetails = ({title, familyName, givenName, orgUnits, positions}) => {
    return (
        <div className="authorDetails">
                {/* Title and name */}
                <div className="authorTitleName title is-3 color-reverse">
                    {title}&nbsp;{givenName}&nbsp;{familyName}
                </div>
                {/* Author Name/Positions/OrgUnits */}
                <div className="is-paddingless is-marginless is-narrow">

                    {positions.map((item, index) => (
                        <div key={index} className="authorPositionOrg color-reverse">
                            <strong>{item}</strong>
                            {orgUnits[index] ? ', ' : ''}
                            <span className="color-reverse">{orgUnits[index]}</span>
                        </div>
                    ))}

                </div>
            </div>
    );
};

DashboardAuthorDetails.propTypes = {
    authorDetails: PropTypes.object.isRequired,
    title: PropTypes.string,
    familyName: PropTypes.string,
    givenName: PropTypes.string,
    orgUnits: PropTypes.array,
    positions: PropTypes.array
};

export default DashboardAuthorDetails;
