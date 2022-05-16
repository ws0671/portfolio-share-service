import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import styled from "styled-components";

import * as Api from "../../api";
import UserCard from "./UserCard";
import { UserStateContext } from "../../App";

function Network() {
  const navigate = useNavigate();
  const userState = useContext(UserStateContext);
  // useState 훅을 통해 users 상태를 생성함.
  const [users, setUsers] = useState([]);
  const [searchWord, setSearchWord] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // 만약 전역 상태의 user가 null이라면, 로그인 페이지로 이동함.
    if (!userState.user) {
      navigate("/login");
      return;
    }
    // "userlist" 엔드포인트로 GET 요청을 하고, users를 response의 data로 세팅함.
    Api.get("userlist").then((res) => setUsers(res.data));
  }, [userState, navigate]);

  const getData = (word) => {
    const res = Api.get(`user/search?name=${word}&page=1&perPage=10&sortField`);
    console.log(res.data);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    getData(searchWord);
  };
  return (
    <Container fluid>
      <SearchBar>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="유저이름으로 검색"
            onChange={(e) => setSearchWord(e.target.value)}
          ></input>
        </form>
      </SearchBar>
      <Row xs="auto" className="justify-content-center">
        {users.map((user) => (
          <UserCard key={user.id} user={user} isNetwork />
        ))}
      </Row>
    </Container>
  );
}
const SearchBar = styled.div`
  text-align: center;
`;
export default Network;
