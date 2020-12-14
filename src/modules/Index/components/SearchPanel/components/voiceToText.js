import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MicIcon from '@material-ui/icons/Mic';
import ClearIcon from '@material-ui/icons/Clear';
import { default as defaultLocale } from 'modules/Index/components/locale';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { PropTypes } from 'prop-types';
import Grid from '@material-ui/core/Grid';

export const VoiceToText = ({ sendHandler, clearSuggestions, elementId = 'homepage-search' }) => {
    const { transcript, resetTranscript, listening } = useSpeechRecognition({
        clearTranscriptOnListen: true,
    });
    const sendTranscript = event => {
        event && event.preventDefault();
        SpeechRecognition.stopListening();
        if (transcript && transcript.length > 3) {
            sendHandler(null, transcript);
        }
        document.getElementById(elementId).focus();
        document.getElementById(elementId).value = transcript;
        resetTranscript;
    };

    const handleReset = event => {
        event && event.preventDefault();
        resetTranscript();
        sendHandler(null, '');
        clearSuggestions();
        document.getElementById(elementId).focus();
    };
    React.useEffect(() => {
        sendHandler(null, transcript);
    }, [transcript, sendHandler]);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }
    return (
        <Grid container spacing={0}>
            {!listening && (
                <Grid item xs={'auto'}>
                    <Tooltip
                        title={'Use your microphone to search'}
                        id={`${elementId}-voice-record`}
                        data-testid={`${elementId}-voice-record`}
                    >
                        <IconButton onClick={SpeechRecognition.startListening} size={'small'}>
                            <MicIcon />
                        </IconButton>
                    </Tooltip>
                </Grid>
            )}
            {listening && (
                <Grid item xs={'auto'}>
                    <Tooltip
                        title={'Stop recording'}
                        id={`${elementId}-voice-stop`}
                        data-testid={`${elementId}-voice-stop`}
                    >
                        <IconButton onClick={sendTranscript} size={'small'}>
                            <MicIcon style={{ color: '#a8ff00' }} />
                        </IconButton>
                    </Tooltip>
                </Grid>
            )}
            <Grid item xs={'auto'}>
                <Tooltip
                    title={'Clear your search term'}
                    id={`${elementId}-voice-clear`}
                    data-testid={`${elementId}-voice-clear`}
                >
                    <IconButton onClick={handleReset} size={'small'}>
                        <ClearIcon />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    );
};

VoiceToText.propTypes = {
    clearSuggestions: PropTypes.func,
    elementId: PropTypes.string,
    sendHandler: PropTypes.func,
};

VoiceToText.defaultProps = {
    locale: defaultLocale,
};

export default React.memo(VoiceToText);
