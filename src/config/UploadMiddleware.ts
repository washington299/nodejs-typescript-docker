import multer from 'multer';
import path from 'path';
import uuid from 'uuid';

class UploadMiddleware {
  public storage = {
    dest: path.resolve(__dirname, '..', '..', 'uploads'),
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => {
        cb(null, path.resolve(__dirname, '..', '..', 'uploads'));
      },
      filename: (_req, file, cb): void => {
        cb(null, `${uuid.v4()}-${Date.now()}${path.extname(file.originalname)}`);
      },
    }),
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fileFilter: (_req: Express.Request, file: Express.Multer.File, cb: any): void => {
      const allowedMimes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png',
        'image/gif',
      ];

      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type!!'));
      }
    },
  }
}

export default new UploadMiddleware();
