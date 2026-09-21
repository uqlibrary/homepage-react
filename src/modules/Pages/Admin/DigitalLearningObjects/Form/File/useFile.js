import { useState, useEffect, useCallback } from 'react';

const useFile = ({ mode, dlorItem }) => {
    const [existingFile, setExistingFile] = useState();
    const [fileToBeUploaded, setFileToBeUploaded] = useState();
    const hasFile = Boolean(fileToBeUploaded || (existingFile && !existingFile?.markedForDeletion));

    // propagate dlorItem file data to local state file
    useEffect(() => {
        if (
            mode !== 'edit' ||
            !dlorItem?.object_file_name ||
            (!dlorItem?.object_file_size && dlorItem?.object_file_size !== 0) ||
            existingFile ||
            existingFile?.markedForDeletion
        ) {
            return;
        }

        setExistingFile({ name: dlorItem.object_file_name, size: dlorItem.object_file_size });
    }, [mode, dlorItem, existingFile]);

    const onFileChange = useCallback(selectedFile => setFileToBeUploaded(selectedFile), []);

    const onClearFile = useCallback(() => {
        if (fileToBeUploaded) {
            setFileToBeUploaded(null);
            return;
        }

        setExistingFile(prev => prev && { ...prev, markedForDeletion: true });
    }, [fileToBeUploaded]);

    return [hasFile, existingFile, fileToBeUploaded, onFileChange, onClearFile];
};

export default useFile;
