import multer from 'multer';

const upload = multer({
  dest: 'uploads/users/images',
});

const uploadImage = upload.single('image');

export default uploadImage;