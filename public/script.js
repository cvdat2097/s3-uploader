const ID = {
    FILE_PICKER: 'file-picker',
    UPLOAD_BUTTON: 'upload-button',
    LINK_CONTAINER: 'link-container',
    UPLOAD_STATUS: 'upload-status',
};

const ELEMENT = {
    filePicker: document.getElementById(ID.FILE_PICKER),
    uploadButton: document.getElementById(ID.UPLOAD_BUTTON),
    linkContainer: document.getElementById(ID.LINK_CONTAINER),
    uploadStatus: document.getElementById(ID.UPLOAD_STATUS),
};

let UPLOAD_FILE, UPLOAD_URL, UPLOAD_FIELDS;

const getFile = filePickerElement => {
    if (filePickerElement.files.length) {
        return filePickerElement.files[0];
    }

    return null;
};

const getUploadEndpointFields = async filename => {
    const { data: res } = await axios.post('/getPresignedUrlPOST', {
        filename,
    });

    return res;
};

const uploadFile = async (file, uploadUrl, s3PostFields) => {
    const formData = new FormData();

    formData.append('key', s3PostFields.key);
    Object.keys(s3PostFields).forEach(key => {
        if (key !== 'key') {
            formData.append(key, s3PostFields[key]);
        }
    });
    formData.append('file', file);

    await axios.post(uploadUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

const getPublicUrl = async filename => {
    const { data: publicUrl } = await axios.get('/getPublicUrl', {
        params: {
            filename,
        },
    });

    return publicUrl;
};

const setDownloadLink = link => {
    ELEMENT.linkContainer.setAttribute('href', link);
    ELEMENT.linkContainer.innerHTML = link;
};

const setUploadStatus = message => {
    ELEMENT.uploadStatus.innerHTML = message;
};

const enableUploadButton = () => {
    ELEMENT.uploadButton.removeAttribute('disabled');
};

const disableUploadButton = () => {
    ELEMENT.uploadButton.setAttribute('disabled', true);
};

ELEMENT.filePicker.addEventListener('change', async event => {
    setUploadStatus('');
    setDownloadLink('');

    UPLOAD_FILE = getFile(ELEMENT.filePicker);

    if (UPLOAD_FILE) {
        enableUploadButton();

        const { url, fields } = await getUploadEndpointFields(UPLOAD_FILE.name);

        UPLOAD_URL = url;
        UPLOAD_FIELDS = fields;
    } else {
        disableUploadButton();
    }
});

ELEMENT.uploadButton.addEventListener('click', async () => {
    if (UPLOAD_FIELDS && UPLOAD_FILE && UPLOAD_URL) {
        setUploadStatus('Uploading...');

        await uploadFile(UPLOAD_FILE, UPLOAD_URL, UPLOAD_FIELDS);

        const publicUrl = await getPublicUrl(UPLOAD_FILE.name);

        setUploadStatus('Uploaded Successfully!');
        setDownloadLink(publicUrl);
    }
});
