import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

const BookableSpacesPageLayout = ({ children }) => (
	<Box sx={{ width: '100%', backgroundColor: '#fff' }}>
		{children}
	</Box>
);

BookableSpacesPageLayout.propTypes = {
	children: PropTypes.node,
};

export default BookableSpacesPageLayout;
