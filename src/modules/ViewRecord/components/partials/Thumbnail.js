import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import BrokenImage from 'material-ui/svg-icons/image/broken-image';

class Thumbnail extends PureComponent {
    static propTypes = {
        mediaUrl: PropTypes.string.isRequired,
        previewMediaUrl: PropTypes.string.isRequired,
        thumbnailMediaUrl: PropTypes.string.isRequired,
        thumbnailFileName: PropTypes.string.isRequired,
        mimeType: PropTypes.string.isRequired,
        onClick: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            thumbnailError: false
        };
    }

    showPreview = (mediaUrl, previewMediaUrl, mimeType) => (e) => {
        e.preventDefault();
        this.props.onClick(mediaUrl, previewMediaUrl, mimeType);
    };

    imageError = () => {
        this.setState({
            thumbnailError: true
        });
    };

    render() {
        const {mediaUrl, thumbnailMediaUrl, previewMediaUrl, thumbnailFileName, mimeType} = this.props;
        return (
            <a
                onClick={this.showPreview(mediaUrl, previewMediaUrl, mimeType)}
                onKeyPress={this.showPreview(mediaUrl, previewMediaUrl, mimeType)}
                className={'fileThumbnail'}>
                {
                    !this.state.thumbnailError ?
                        <img src={thumbnailMediaUrl} alt={thumbnailFileName} onError={this.imageError}/>
                        : <BrokenImage />
                }
            </a>
        );
    }
}

export default Thumbnail;
