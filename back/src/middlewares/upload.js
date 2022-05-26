import multer from "multer";
import multerS3 from "multer-s3";
import AWS from "aws-sdk";

AWS.config.loadFromPath(__dirname+ '/../config/s3.json');

const s3 = new AWS.S3();

const S3storage = multerS3({
  s3: s3,
  bucket: 'elice-project-study',
  acl: 'public-read-write',
  key: (req, file, cb) => {
    // 파일 이름 형식 : 오늘날짜_원래이름
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

  
const upload =  multer({
        storage: S3storage,

        // 파일 허용 조건 : 확장자 이미지 타입만 업로드
        fileFilter: function (req, file, cb) {
          const typed = String(file.mimetype)?.split("/")[0] ?? "null"
          if (typed !== 'image') {
            return cb(null, false, new Error('error'));
          }
          cb(null, true);
        },
        // 파일 크기제한 : 5mb (1024 * 1024)
        limits: {
          fileSize: 5 * 1024 * 1024,
        }
      }).single('file');


export { upload };
