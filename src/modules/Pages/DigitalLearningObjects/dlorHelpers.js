import React from 'react';

export const displayDownloadInstructions = (downloadInstructions, theClass) => {
    const content = downloadInstructions
        .replace(/\[([^\]]+)\]\(([^\)]+)\)/, '<a rel="noreferrer noopener" href="$2">$1</a>')
        .split('\n');

    return (
        <div data-testid="dlor-massaged-download-instructions" className={theClass}>
            {content.map((line, index) => (
                <p
                    key={index}
                    dangerouslySetInnerHTML={{
                        __html: line,
                    }}
                />
            ))}
        </div>
    );
};
