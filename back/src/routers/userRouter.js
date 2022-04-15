import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { upload } from "../middlewares/upload";
import { userAuthService } from "../services/userService";

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const userAuthRouter = Router();


// login이 최초로 성공했을 때만 호출되는 함수
passport.serializeUser((user, done) => {
  done(null, user); // user객체가 deserializeUser로 전달됨.
});

// 사용자가 페이지를 방문할 때마다 호출되는 함수
passport.deserializeUser((user, done) => {
  done(null, user); // 여기의 user가 req.user가 됨
});

// Google login Strategy
// 로그인 성공 시 callback으로 request, accessToken, refreshToken, profile 등이 반환.
// 해당 콜백 function에서 사용자가 누구인지 done(null, user) 형식으로 넣으면 된다.
passport.use(
  
  new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "https://localhost:5000/auth/google/callback",
        
        //passReqToCallback: true,
        scope: ['profile', 'email'],
      },
      async function (request, accessToken, refreshToken, profile, done) {
        console.log(profile);
        console.log(accessToken);

        return done(null, profile);
      }
  )
);

// google login 버튼을 클릭하면 호출
userAuthRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ['profile', 'email'] })
);

// google login이 성공적으로 완료되면 "/"로 리다이렉트
// 실패하면 "/login"으로 리다이렉트
userAuthRouter.get(
  "/auth/google/callback",
  passport.authenticate('google', {failureRedirect: "/login",}),
  async function (req, res) {
    res.redirect("/");
  }
);
// 

userAuthRouter.post("/user/register", async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    // req (request) 에서 데이터 가져오기
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // 위 데이터를 유저 db에 추가하기
    const newUser = await userAuthService.addUser({
      name,
      email,
      password,
    });

    if (newUser.errorMessage) {
      throw new Error(newUser.errorMessage);
    }

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.post("/user/login", async function (req, res, next) {
  try {
    // req (request) 에서 데이터 가져오기
    const email = req.body.email;
    const password = req.body.password;

    // 위 데이터를 이용하여 유저 db에서 유저 찾기
    const user = await userAuthService.getUser({ email, password });

    if (user.errorMessage) {
      throw new Error(user.errorMessage);
    }

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

userAuthRouter.post(
  "/user/upload/image",
  login_required,
  upload,
  async function (req, res, next) {
    try {
      // jwt토큰에서 추출된 사용자 id를 가지고 db에서 사용자 정보를 찾음.
      const user_id = req.currentUserId;
      const currentUserInfo = await userAuthService.getUserInfo({
        user_id,
      });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      // req (request) 에서 데이터 가져오기
      // location: 프론트에서 요청받아 multer로 저장된 파일데이터
      const fileData = req.file;

      // multer 미들웨어에서 에러 발생시 error 출력
      if (fileData === undefined) {
        return res.status(202).json({
          success: false,
          message: "사진 저장 실패",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "사진 저장 성공",
          data: fileData.location
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

userAuthRouter.get(
  "/userlist",
  login_required,
  async function (req, res, next) {
    try {
      // 전체 사용자 목록을 얻음
      const users = await userAuthService.getUsers();
      res.status(200).send(users);
    } catch (error) {
      next(error);
    }
  }
);

userAuthRouter.get(
  "/user/current",
  login_required,
  async function (req, res, next) {
    try {
      // jwt토큰에서 추출된 사용자 id를 가지고 db에서 사용자 정보를 찾음.
      const user_id = req.currentUserId;
      const currentUserInfo = await userAuthService.getUserInfo({
        user_id,
      });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      res.status(200).send(currentUserInfo);
    } catch (error) {
      next(error);
    }
  }
);

userAuthRouter.put(
  "/users/:id",
  login_required,
  async function (req, res, next) {
    try {
      // URI로부터 사용자 id를 추출함.
      const user_id = req.params.id;
      // body data 로부터 업데이트할 사용자 정보를 추출함.
      const name = req.body.name ?? null;
      const email = req.body.email ?? null;
      const password = req.body.password ?? null;
      const description = req.body.description ?? null;
      const image = req.body.image ?? null;

      const toUpdate = { name, email, password, description, image };

      // 해당 사용자 아이디로 사용자 정보를 db에서 찾아 업데이트함. 업데이트 요소가 없을 시 생략함
      const updatedUser = await userAuthService.setUser({ user_id, toUpdate });

      if (updatedUser.errorMessage) {
        throw new Error(updatedUser.errorMessage);
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

userAuthRouter.get(
  "/users/:id",
  login_required,
  async function (req, res, next) {
    try {
      const user_id = req.params.id;
      const currentUserInfo = await userAuthService.getUserInfo({ user_id });

      if (currentUserInfo.errorMessage) {
        throw new Error(currentUserInfo.errorMessage);
      }

      res.status(200).send(currentUserInfo);
    } catch (error) {
      next(error);
    }
  }
);

// jwt 토큰 기능 확인용, 삭제해도 되는 라우터임.
userAuthRouter.get("/afterlogin", login_required, function (req, res, next) {
  res
    .status(200)
    .send(
      `안녕하세요 ${req.currentUserId}님, jwt 웹 토큰 기능 정상 작동 중입니다.`
    );
});

export { userAuthRouter };
