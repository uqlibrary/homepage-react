import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ClearIcon from '@material-ui/icons/Clear';
import { default as defaultLocale } from './locale';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { PropTypes } from 'prop-types';
import Grid from '@material-ui/core/Grid';

export const VoiceToText = ({ sendHandler }) => {
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
                        <IconButton onClick={SpeechRecognition.startListening} size={'small'}>
                            <MicIcon />
                        </IconButton>
                    </Grid>
                )}
                {listening && (
                    <Grid item xs={'auto'}>
                        <IconButton onClick={sendTranscript} size={'small'}>
                            <MicOffIcon />
                        </IconButton>
                    </Grid>
                )}
                <Grid item xs={'auto'}>
                    <IconButton onClick={handleReset} size={'small'}>
                        <ClearIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Grid>
    );
};

VoiceToText.propTypes = {
    sendHandler: PropTypes.func,
};

VoiceToText.defaultProps = {
    locale: defaultLocale,
};

export default React.memo(VoiceToText);
