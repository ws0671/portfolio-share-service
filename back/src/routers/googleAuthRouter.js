import { Router } from "express";
//import { login_required } from "../middlewares/login_required";
import { userAuthService } from "../services/userService";

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const googleAuthRouter = Router();


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
        callbackURL: "http://localhost:5000/auth/google/callback",
        
        //passReqToCallback: true,
        scope: ['profile', 'email'],
      },
      async function (request, accessToken, refreshToken, profile, done) {

        const user = await userAuthService.addGoogleUser({profile});


        return done(null, user);
      }
  )
);

// google login 버튼을 클릭하면 호출
googleAuthRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ['profile', 'email'] })
);

// google login이 성공적으로 완료되면 user 정보 반환
// 실패하면 "/login"으로 리다이렉트
googleAuthRouter.get(
  "/auth/google/callback",
  passport.authenticate('google', {failureRedirect: "/login"}),
  async function (req, res) {
    res.status(200).json(req.user);
  }
);

export { googleAuthRouter };