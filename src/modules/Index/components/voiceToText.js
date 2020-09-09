import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MicIcon from '@material-ui/icons/Mic';
import ClearIcon from '@material-ui/icons/Clear';
import { default as defaultLocale } from './locale';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { PropTypes } from 'prop-types';
import Grid from '@material-ui/core/Grid';

export const VoiceToText = ({ sendHandler, clearSuggestions }) => {
    const { transcript, resetTranscript, listening } = useSpeechRecognition({
        clearTranscriptOnListen: true,
    });
    const sendTranscript = event => {
        event && event.preventDefault();
        console.log(transcript);
        SpeechRecognition.stopListening();
        if (transcript && transcript.length > 3) {
            sendHandler(null, transcript);
        }
        document.getElementById('primo-autocomplete').focus();
        document.getElementById('primo-autocomplete').value = transcript;
        resetTranscript;
    };

    const handleReset = event => {
        event && event.preventDefault();
        resetTranscript();
        sendHandler(null, '');
        clearSuggestions();
        document.getElementById('primo-autocomplete').focus();
    };
    React.useEffect(() => {
        sendHandler(null, transcript);
    }, [transcript, sendHandler]);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }
    return (
        <Grid item xs={'auto'} style={{ width: 120, marginLeft: -70, marginRight: -50, marginBottom: 6 }}>
            <Grid container spacing={0}>
                {!listening && (
                    <Grid item xs={'auto'}>
                        <Tooltip title={'Use your microphone to search'}>
                            <IconButton onClick={SpeechRecognition.startListening} size={'small'}>
                                <MicIcon style={{ color: '#CCCCCC' }} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                )}
                {listening && (
                    <Grid item xs={'auto'}>
                        <Tooltip title={'Stop recording'}>
                            <IconButton onClick={sendTranscript} size={'small'}>
                                <MicIcon style={{ color: '#a8ff00' }} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                )}
                <Grid item xs={'auto'}>
                    <Tooltip title={'Clear your search term'}>
                        <IconButton onClick={handleReset} size={'small'}>
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        </Grid>
    );
};

VoiceToText.propTypes = {
    sendHandler: PropTypes.func,
    clearSuggestions: PropTypes.func,
};

VoiceToText.defaultProps = {
    locale: defaultLocale,
};

export default React.memo(VoiceToText);
