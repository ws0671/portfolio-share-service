import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { userAuthService } from "../services/userService";

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuthRouter = Router();

// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth2").Strategy;


googleAuthRouter.post('/googlelogin',
  async function (req, res, next){
    try{
      const idToken = req.body.token;

      //idToken 검증 함수 verify()
      async function verify() {
        const ticket = await client.verifyIdToken({
          idToken: idToken,
        });

        const payload = ticket.getPayload();
        return payload;
      }

      const user = await verify()
      .then((payload)=>{//정상적인 토큰이면 요청받은 user 데이터 응답
        //return "success";
        const email = payload.email;
        const name = payload.name;
        const user = userAuthService.addGoogleUser2({email, name});
        return user;
      })
      .catch((error)=>{
        const errorMessage = "정상적인 토큰이 아닙니다. 다시 한 번 확인해 주세요."
        return errorMessage;
      });

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

export { googleAuthRouter };