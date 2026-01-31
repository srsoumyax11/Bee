import React from 'react';

function UploadToast({ uploads, onCancel }) {
    if (!uploads || uploads.length === 0) return null;

    return (
        <div className="upload-toast-container">
            {uploads.map((upload, index) => (
                <div key={index} className="upload-toast">
                    <div className="upload-header">
                        <div className="upload-filename">
                            ⬆️ {upload.filename}
                        </div>
                        <button
                            className="upload-cancel"
                            onClick={() => onCancel(upload.id)}
                            title="Cancel upload"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="upload-stats">
                        <span className="upload-progress-text">{upload.progress}%</span>
                        {upload.speed && <span className="upload-speed">{upload.speed}</span>}
                    </div>
                    <div className="upload-progress-bar">
                        <div
                            className="upload-progress-fill"
                            style={{ width: `${upload.progress}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default UploadToast;
