import React from "react";
import styles from "../../styles/mystyle.module.css";
// import axios from "axios";

function KakaoLogin() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id="3e248ae78cfb8d9f2b859a45232a7e01"&redirect_uri="http://localhost:3000/oauth/callback/kakao"&response_type=code`;

  return (
    <>
      <a href={KAKAO_AUTH_URL}>
        <div className={styles.kakao_btn}></div>
      </a>
    </>
  );
}

export default KakaoLogin;
