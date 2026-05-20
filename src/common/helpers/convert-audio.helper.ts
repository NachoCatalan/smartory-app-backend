import multer from 'multer';

export const convertAudioToBlob = (file: Express.Multer.File): FormData=> {
    const formData = new FormData();

    const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });
    formData.append('file', blob, file.originalname);
    return formData;
}