# 포트폴리오 공유 서비스 백엔드 코드

## 실행 방법

## 1. Mongodb 서버 구축 (a, b 중 선택)

### a. 로컬 서버

아래 공식 문서 참조 \
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/ \
`mongosh` 커맨드로 서버가 들어가지면 성공적으로 구축된 것입니다. \

### b. Atlas 서버

아래 링크 가입 -> 무료 클러스터 생성 (512MB) \
https://www.mongodb.com/atlas \
왼쪽 아래 SECURITY 의 Database Access -> Add New User -> name, password 설정 \
왼쪽 아래 SECURITY 의 Network Access -> Add IP Address -> current IP 등록 \
왼쪽 위 DEPLOYMENT Databases -> Connect -> Connect your application -> 서버 링크 복사


## 2. Mongodb 서버 url 환경변수에 등록

./.env 파일 수정 \
MONGODB_URL을 위에서 만든 mongodb 서버 링크로 설정

```bash
MONGODB_URL="mongodb://localhost:27017/myDB"  (로컬 서버의 경우 예시)
MONGODB_URL="mongodb+srv://<name>:<password>@cluster0.acaph.mongodb.net/myDB?retryWrites=true&w=majority" (Atlas 서버의 경우 예시)
```

> Atlas 서버의 경우 <name>, <password>를 위에서 설정했던 name, password로 바꾸어 주세요.

## 3. Express 실행

> yarn은 사실 npm 패키지입니다. yarn부터 설치합니다. (이미 설치 시 생략)

> 이후, 아래 yarn 커맨드는, yarn install 커맨드의 단축키입니다. 즉, 라이브러리 설치 커맨드입니다.

> yarn 입력 시 자동으로, package.json 바탕으로 라이브러리를 한꺼번에 설치해 줍니다.

```bash
npm install --global yarn
yarn
yarn start
```

## 4. 파일 업로드를 위한 multer 설치 및 AWS S3 스토리지 연결

파일 업로드 기능을 위해 multer 패키지를 설치합니다.

```bash
yarn add multer
```

back/src/config 디렉토리를 생성하고 AWS S3 정보를 추가합니다.
```
back
ㄴsrc
  ㄴconfig
```


<hr />

## 파일 구조 설명

1. src폴더는 크게는 routers, services, db의 3개 폴더로 구분됩니다.

- routers:
  - request와 response가 처리됩니다. MVP 별로 1개씩, 총 5개 파일이 있습니다.
- services:
  - 백엔드 로직 코드가 있습니다. MVP 별로 1개씩, 총 5개 파일이 있습니다.
  - 현재는 User MVP 파일만 있습니다.
- db:
  - Mongoose와 mongodb 서버를 연결하는 코드가 있는 index.js
  - Mongoose 스키마가 있는 schemas 폴더,
    - MVP 별로 5개 파일이 있습니다.
  - Mongoose 모델 ORM 코드가 있는 models 폴더
    - MVP 별로 5개 파일이 있습니다.

2. 이외 폴더는 아래와 같습니다.

- src/middlewares:
  - jwt토큰을 다루는 미들웨어인 login_required.js
  - 학습 편의를 위해 일괄 http 400 코드로 에러를 변환하는 에러핸들러인 errorMiddleware.js
  - 이미지 파일을 서버의 로컬 스토리지에 저장하는 multer 미들웨어인 upload.js

- src/config:
  - 기타 환경설정과 관련 코드가 있는 폴더