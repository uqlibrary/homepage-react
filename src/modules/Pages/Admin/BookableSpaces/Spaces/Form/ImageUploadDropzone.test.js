import React from 'react';

import { fireEvent } from '@testing-library/react';

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
                this._src = '';
                this.listeners = {};
            }

            addEventListener(eventName, callback) {
                this.listeners[eventName] = callback;
            }

            removeEventListener(eventName) {
                delete this.listeners[eventName];
            }

            set src(value) {
                this._src = value;
                if (this.onload && this.listeners.load) {
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
});
