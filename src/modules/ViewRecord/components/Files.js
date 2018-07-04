import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import locale from 'locale/viewRecord';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';

import moment from 'moment';
import AvVolumeUp from 'material-ui/svg-icons/av/volume-up';
import InsertDriveFile from 'material-ui/svg-icons/editor/insert-drive-file';
import PictureAsPdf from 'material-ui/svg-icons/image/picture-as-pdf';
import Image from 'material-ui/svg-icons/image/image';
import AvVideocam from 'material-ui/svg-icons/av/videocam';
import {openAccessConfig, viewRecordsConfig, routes} from 'config';
import MediaPreview from './MediaPreview';
import FileName from './partials/FileName';
import OpenAccessIcon from 'modules/SharedComponents/Partials/OpenAccessIcon';
import Thumbnail from './partials/Thumbnail';

export default class Files extends Component {
    static propTypes = {
        publication: PropTypes.object.isRequired,
        hideCulturalSensitivityStatement: PropTypes.bool,
        setHideCulturalSensitivityStatement: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            preview: {
                mediaUrl: null,
                previewMediaUrl: null,
                mimeType: null
            }
        };
    }

    renderFileIcon = (pid, mimeType, fileName, thumbnailFileName, previewFileName, allowDownload, downloadableFileName = null) => {
        if (allowDownload && thumbnailFileName) {
            const thumbnailProps = {
                mimeType,
                mediaUrl: this.getUrl(pid, downloadableFileName || fileName),
                previewMediaUrl: this.getUrl(pid, previewFileName || fileName),
                thumbnailMediaUrl: this.getUrl(pid, thumbnailFileName),
                thumbnailFileName,
                onClick: this.showPreview
            };
            return (
                <Thumbnail {...thumbnailProps} />
            );
        } else if (mimeType.indexOf('audio') >= 0) {
            return <AvVolumeUp />;
        } else if (mimeType.indexOf('pdf') >= 0) {
            return <PictureAsPdf />;
        } else if (mimeType.indexOf('image') >= 0) {
            return <Image />;
        } else if (mimeType.indexOf('video') >= 0) {
            return <AvVideocam />;
        } else {
            return <InsertDriveFile />;
        }
    }

    hidePreview = () => {
        this.setState({
            preview: {
                mediaUrl: null,
                previewMediaUrl: null,
                mimeType: null
            }
        });
    }

    showPreview = (mediaUrl, previewMediaUrl, mimeType) => {
        this.setState({
            preview: {
                mediaUrl: mediaUrl,
                previewMediaUrl: previewMediaUrl,
                mimeType: mimeType
            }
        });

        setTimeout(() => {
            const files = ReactDOM.findDOMNode(this.refs.files);
            window.scrollTo(0, (files.offsetTop + files.scrollHeight - 30));
        }, 80);
    }

    formatBytes = (bytes) => {
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const decimals = 2;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const index = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, index)).toFixed(decimals)) + ' ' + sizes[index];
    }

    getFileOpenAccessStatus = (publication, embargoDate) => {
        const openAccessStatusId = (!!publication.fez_record_search_key_oa_status
            && publication.fez_record_search_key_oa_status.rek_oa_status) || null;
        if (openAccessConfig.openAccessFiles.indexOf(openAccessStatusId) < 0) {
            return {isOpenAccess: false, embargoDate: null, openAccessStatusId: openAccessStatusId};
        } else if (embargoDate && moment(embargoDate).isSameOrAfter(moment(), 'day')) {
            return {isOpenAccess: false, embargoDate: moment(embargoDate).format('Do MMMM YYYY'), openAccessStatusId: openAccessStatusId};
        }
        return {isOpenAccess: true, embargoDate: null, openAccessStatusId: openAccessStatusId};
    }

    getUrl = (pid, fileName) => {
        return fileName && routes.pathConfig.file.url(pid, fileName);
    }

    searchByKey = (list, key, value) => {
        return list && list.filter(item=>item[key] === value)[0];
    }

    isFileValid = (dataStream) => {
        const {files: {blacklist}} = viewRecordsConfig;

        return !dataStream.dsi_dsid.match(blacklist.namePrefixRegex) &&
            (!dataStream.dsi_label || !dataStream.dsi_label.match(new RegExp(blacklist.descriptionKeywordsRegex, 'gi'))) &&
            dataStream.dsi_state === 'A';
    }

    getFileData = (publication) => {
        const dataStreams = publication.fez_datastream_info;
        const {files} = viewRecordsConfig;

        return !!dataStreams && dataStreams.length > 0
            ? dataStreams.filter(this.isFileValid).map(dataStream => {
                const pid = publication.rek_pid;
                const fileName = dataStream.dsi_dsid;
                const thumbnailDataStream = this.searchByKey(dataStreams, 'dsi_dsid', files.thumbnailFileName(fileName));
                const previewDataStream = this.searchByKey(dataStreams, 'dsi_dsid', files.previewFileName(fileName));
                const downloadableDataStream = this.searchByKey(dataStreams, 'dsi_dsid', files.webFileName(fileName));
                const mimeType = dataStream.dsi_mimetype ? dataStream.dsi_mimetype : '';
                const thumbnailFileName = !!thumbnailDataStream && thumbnailDataStream.dsi_dsid;
                const previewFileName = !!previewDataStream && previewDataStream.dsi_dsid;
                const downloadableFileName = !!downloadableDataStream && downloadableDataStream.dsi_dsid;
                const openAccessStatus = this.getFileOpenAccessStatus(publication, dataStream.dsi_embargo_date);

                return {
                    pid: pid,
                    fileName: fileName,
                    description: dataStream.dsi_label,
                    mimeType: mimeType,
                    thumbnailFileName: thumbnailFileName,
                    calculatedSize: this.formatBytes(dataStream.dsi_size),
                    allowDownload: openAccessStatus.isOpenAccess || !openAccessStatus.embargoDate,
                    icon: this.renderFileIcon(pid, mimeType, fileName, thumbnailFileName, previewFileName, openAccessStatus.isOpenAccess, downloadableFileName),
                    openAccessStatus: openAccessStatus,
                    previewMediaUrl: this.getUrl(pid, previewFileName || fileName),
                    mediaUrl: this.getUrl(pid, downloadableFileName || fileName)
                };
            })
            : [];
    }

    render() {
        const {publication} = this.props;
        const fileData = this.getFileData(publication);
        if (fileData.length === 0) return null;
        return (
            <section>
                <StandardCard title={locale.viewRecord.sections.files.title}>
                    {
                        !!publication.fez_record_search_key_advisory_statement && !this.props.hideCulturalSensitivityStatement &&
                        <Alert allowDismiss type={'info'}
                            message={publication.fez_record_search_key_advisory_statement.rek_advisory_statement || locale.viewRecord.sections.files.culturalSensitivityStatement}
                            dismissAction={this.props.setHideCulturalSensitivityStatement}/>
                    }
                    <div className="files">
                        <div className="header columns is-gapless is-vcentered">
                            <div className="column filetype is-2 is-vcentered" />
                            <div className="column filename is-3 is-vcentered">
                                {locale.viewRecord.sections.files.fileName}
                            </div>
                            <div className="column description is-hidden-mobile is-vcentered">
                                {locale.viewRecord.sections.files.description}
                            </div>
                            <div className="column size is-hidden-mobile is-hidden-tablet-only is-1 is-vcentered">
                                {locale.viewRecord.sections.files.size}
                            </div>
                            <div className="column oa align-right is-2 is-vcentered" />
                        </div>
                        {
                            fileData.map((item, index) => (
                                <div className="data columns is-gapless is-vcentered" key={`file-${index}`}>
                                    <div className="column filetype fileIcon is-2 is-vcentered is-centered">
                                        {item.icon}
                                    </div>
                                    <div className="column filename is-3 is-vcentered">
                                        <FileName
                                            {...item}
                                            onFileSelect={this.showPreview}
                                        />
                                    </div>
                                    <div className="column description is-hidden-mobile is-vcentered">
                                        {item.description}
                                    </div>
                                    <div className="column size is-hidden-mobile is-hidden-tablet-only is-1 is-vcentered">
                                        {item.calculatedSize}
                                    </div>
                                    <div className="column oa align-right is-2 is-vcentered">
                                        <OpenAccessIcon {...item.openAccessStatus} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </StandardCard>
                {
                    this.state.preview.mediaUrl && this.state.preview.mimeType &&
                    <MediaPreview
                        ref="mediaPreview"
                        mediaUrl={this.state.preview.mediaUrl}
                        previewMediaUrl={this.state.preview.previewMediaUrl}
                        mimeType={this.state.preview.mimeType}
                        onClose={this.hidePreview}/>
                }
            </section>
        );
    }
}
