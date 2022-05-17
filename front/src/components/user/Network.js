import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { GoSearch } from "react-icons/go";
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
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 만약 전역 상태의 user가 null이라면, 로그인 페이지로 이동함.
    if (!userState.user) {
      navigate("/login");
      return;
    }
    // "userlist" 엔드포인트로 GET 요청을 하고, users를 response의 data로 세팅함.
    Api.get("userlist").then((res) => setUsers(res.data));
  }, [userState, navigate]);

  const getData = async (word) => {
    const res = await Api.get(
      `user/search?name=${word}&page=${page}&perPage=8&sortField`
    );
    setData(res.data);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    getData(searchWord);
    console.log(data);
  };
  return (
    <Container fluid>
      <SearchBar>
        <form onSubmit={handleSubmit}>
          <GoSearch style={{ position: "relative", left: "30px" }}></GoSearch>
          <input
            placeholder="유저이름으로 검색"
            onChange={(e) => setSearchWord(e.target.value)}
          ></input>
        </form>
      </SearchBar>
      <Main>
        <div className="cardContainer">
          {data
            ? data.map((user) => (
                <UserCard key={user.id} user={user} isNetwork />
              ))
            : users.map((user) => (
                <UserCard key={user.id} user={user} isNetwork />
              ))}
        </div>
      </Main>
    </Container>
  );
}
const SearchBar = styled.div`
  text-align: center;
  input {
    width: 300px;
    text-align: center;
    padding: 0 40px;
    border-radius: 20px;
  }
  margin-bottom: 50px;
`;
const Main = styled.main`
  width: 80%;
  margin: 0 auto;
  .cardContainer {
    flex-wrap: wrap;
    display: flex;
    justify-content: center;
  }
`;
export default Network;
