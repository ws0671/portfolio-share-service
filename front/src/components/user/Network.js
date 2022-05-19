import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import styled from "styled-components";
import { GoSearch } from "react-icons/go";
import * as Api from "../../api";
import UserCard from "./UserCard";
import { UserStateContext } from "../../App";
import NetworkPagination from "./NetworkPagination";

function Network() {
  const navigate = useNavigate();
  const userState = useContext(UserStateContext);
  // useState 훅을 통해 users 상태를 생성함.
  const [users, setUsers] = useState([]);
  const [searchWord, setSearchWord] = useState(null);
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [noSearchList, setNoSearchList] = useState("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    // 만약 전역 상태의 user가 null이라면, 로그인 페이지로 이동함.
    if (!userState.user) {
      navigate("/login");
      return;
    }
    getData();
    // "userlist" 엔드포인트로 GET 요청을 하고, users를 response의 data로 세팅함.
  }, [userState, navigate]);

  useEffect(() => {
    getData(searchWord);
  }, [page, searchValue]);
  const getData = async (word) => {
    if (word && word.length > 0) {
      const res = await Api.get(
        `user/search?name=${word}&page=${page}&perPage=8&sortField`
      );
      if (res.data.searchList.length === 0) {
        const value = `'${word}'에 대한 검색 결과가 없습니다.`;
        setNoSearchList(value);
        setData(res.data.searchList);
        setLastPage(0);
      } else {
        setNoSearchList("");
        setData(res.data.searchList);
        setLastPage(res.data.finalPage);
      }
    } else {
      const res = await Api.get("userlist");
      setNoSearchList("");
      setData(res.data);
      const count = Math.ceil(res.data.length / 8);
      setLastPage(count);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchValue(searchWord);
    setPage(1);
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
          <button className="searchBtn" type="submit" disabled={!searchWord}>
            검색
          </button>
          <button
            className="wholeBtn"
            onClick={() => {
              setPage(1);
              setSearchValue("");
              setSearchWord("");
              setNoSearchList("");
            }}
          >
            전체
          </button>
        </form>
      </SearchBar>
      <Main>
        <h3>{noSearchList}</h3>
        <div className="cardContainer">
          {data &&
            data.map((user) => (
              <UserCard key={user.id} user={user} isNetwork />
            ))}
        </div>
      </Main>
      {lastPage !== 0 && (
        <NetworkPagination page={page} lastPage={lastPage} setPage={setPage} />
      )}
    </Container>
  );
}
const SearchBar = styled.div`
  text-align: center;
  input {
    width: 300px;
    text-align: center;
    padding: 7px 40px;
    border-radius: 5px;
    border: 1px gray solid;
    margin-right: 30px;
  }
  .searchBtn {
    display: none;
  }
  .wholeBtn {
    padding: 5px;
    border-radius: 5px;
    background: linear-gradient(lightCyan, skyBlue, deepSkyBlue);
    border: 1px blue solid;
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
  h3 {
    text-align: center;
  }
`;
export default Network;
