const ID = {
    FILE_PICKER: 'file-picker',
    UPLOAD_BUTTON: 'upload-button',
};

const filePicker = document.getElementById(ID.FILE_PICKER);
const uploadButton = document.getElementById(ID.UPLOAD_BUTTON);

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

const uploadFile = (file, uploadUrl, s3PostFields) => {
    const formData = new FormData();

    formData.append('key', s3PostFields.key);
    Object.keys(s3PostFields).forEach(key => {
        if (key !== 'key') {
            formData.append(key, s3PostFields[key]);
        }
    });
    formData.append('file', file);

    axios.post(uploadUrl, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// =====================
filePicker.addEventListener('change', async event => {
    const file = getFile(filePicker);

    const { url, fields } = await getUploadEndpointFields(file.name);

    uploadButton.addEventListener('click', async () => {
        await uploadFile(file, url, fields);

        alert('File uploaded Successfully');
    });
});
