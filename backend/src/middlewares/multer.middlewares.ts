import multer from 'multer';
import { Request } from 'express';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: Function) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      const ext = file.mimetype.split("/")[1];
      //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random())
      //cb(null, uniqueSuffix + '-' + file.fieldname)
      cb(null, `${Date.now()}-${file.originalname}`);
    },
    
  });
    
   const fileFilter = (req: Request, file: any, cb: Function) => {
    var ext = path.extname(file.originalname);
    //console.log(ext);
    if(ext === '.png' || ext === '.jpg' || ext === '.gif' || ext === '.jpeg') {
       return cb(null, true);
    }else if(ext === '.mp4' || ext === '.mpeg')
    {
      return cb(null, true)
    }
    return cb(new Error('Only image and video are allowed!'))
  }  
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 30 * 1024 * 1024,
    }
  });
  
  export default upload;