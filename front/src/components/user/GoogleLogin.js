import React from "react";
import { GoogleLogin } from "react-google-login";

import * as Api from "../../api";

function GLogin() {
  const clientId = process.env.REACT_APP_CLIENT_ID;

  async function onSuccess(googleData) {
    try {
      // "**" 엔드포인트로 post요청함.
      await Api.post("end-point", {
        email: googleData.getBasicProfile().getEmail(),
        name: googleData.getBasicProfile().getName(),
        token: googleData.tokenId,
      });

      // portfolio 페이지로 이동함.
      // navigate("/", { replace: true });
    } catch (err) {
      console.log("구글 로그인에 실패했습니다 2 :", err);
    }
  }

  async function onFailure(res) {
    console.log("구글 로그인에 실패했습니다 : ", res);
  }

  return (
    <GoogleLogin
      className="google-button"
      clientId={clientId}
      buttonText="구글 로그인" // 버튼에 뜨는 텍스트
      onSuccess={onSuccess}
      onFailure={onFailure}
      cookiePolicy={"single_host_origin"}
    />
  );
}

export default GLogin;
