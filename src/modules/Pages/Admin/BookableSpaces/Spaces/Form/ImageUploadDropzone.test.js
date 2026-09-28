import React from 'react';

import { fireEvent, waitFor } from '@testing-library/react';

import { rtlRender, screen } from 'test-utils';

import { ImageUploadDropzone } from './ImageUploadDropzone';

describe('ImageUploadDropzone', () => {
    beforeEach(() => {
        global.URL.createObjectURL = jest.fn(() => 'blob:mock-image');
        global.URL.revokeObjectURL = jest.fn();
        global.Image = class {
            constructor() {
                this.width = 1200;
                this.height = 800;
                this.naturalWidth = 1200;
                this.naturalHeight = 800;
                this._src = '';
                this.listeners = {};
                this.onload = null;
            }

            addEventListener(eventName, callback) {
                this.listeners[eventName] = callback;
            }

            removeEventListener(eventName) {
                delete this.listeners[eventName];
            }

            set src(value) {
                this._src = value;
                if (this.onload) {
                    this.onload.call(this);
                }
                if (this.listeners.load) {
                    this.listeners.load.call(this);
                }
            }

            get src() {
                return this._src;
            }
        };
    });

    it('renders the initial upload guidance and handles clearing an existing image', () => {
        const onClearFile = jest.fn();

        rtlRender(
            <ImageUploadDropzone
                onAddFile={jest.fn()}
                onClearFile={onClearFile}
                currentImage="https://example.com/existing-image.png"
            />,
        );

        expect(screen.getByTestId('dropzone-preview')).toBeInTheDocument();
        expect(screen.getByTestId('spaces-form-remove-image')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('spaces-form-remove-image'));
        expect(onClearFile).toHaveBeenCalledTimes(1);
    });

    it('calls onAddFile when a file is selected', async () => {
        const onAddFile = jest.fn();

        rtlRender(<ImageUploadDropzone onAddFile={onAddFile} onClearFile={jest.fn()} currentImage={null} />);

        const file = new File(['hello world'], 'sample.png', { type: 'image/png' });
        const input = screen.getByTestId('dropzone-dragarea');

        fireEvent.change(input, {
            target: {
                files: [file],
            },
        });

        await Promise.resolve();
        expect(onAddFile).toHaveBeenCalledWith([file]);
    });

    it('loads size metadata for a freshly uploaded file and the preview warning', async () => {
        const onAddFile = jest.fn();

        rtlRender(<ImageUploadDropzone onAddFile={onAddFile} onClearFile={jest.fn()} currentImage={null} />);

        const file = new File(['hello world'], 'sample-upload.png', { type: 'image/png' });

        fireEvent.change(screen.getByTestId('dropzone-dragarea'), {
            target: {
                files: [file],
            },
        });

        await waitFor(() => {
            expect(screen.getByTestId('dropzone-preview')).toBeInTheDocument();
        });
        expect(screen.getByTestId('dropzone-dimension-warning')).toBeInTheDocument();
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-image');
    });

    it('reads natural dimensions from an existing image so the warning renders from the currentImage load effect', async () => {
        rtlRender(
            <ImageUploadDropzone
                onAddFile={jest.fn()}
                onClearFile={jest.fn()}
                currentImage="https://example.com/existing-image.png"
            />,
        );

        await waitFor(() => {
            expect(screen.getByTestId('dropzone-dimension-warning')).toBeInTheDocument();
        });
        expect(screen.getByText(/Recommended dimensions/i)).toBeInTheDocument();
    });
});
