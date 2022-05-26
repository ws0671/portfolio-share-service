import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import * as Api from "../../api";
import { UserStateContext } from "../../App";

import CommentElement from "./CommentElement";

const Comment = ({ targetId, portfolioOwnerId }) => {
  const [review, setReview] = useState("");
  const [reviewArray, setReviewArray] = useState([]);
  const [commentList, setCommentList] = useState([]);
  const userState = useContext(UserStateContext);

  const handleReviewInput = (e) => {
    setReview(e.target.value);
  };

  //댓글 등록 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (review) {
      const bodyData = {
        user_id: userState.user.id,
        content: review,
        target: targetId ? targetId : userState.user.id,
      };
      const res = await Api.post("comment/create", bodyData);
      setReviewArray((prev) => [res.data, ...prev]);
      setReview("");
    }
  };

  //댓글 수정 함수
  const editHandler = async (item, content) => {
    const edit = { ...item, content };
    const editBody = {
      user_id: userState.user.id,
      content: content,
      target: targetId ? targetId : userState.user.id,
    };
    const res = await Api.put(`comments/${item.id}`, editBody);
    const copied = commentList.map((v) => {
      if (v.writer.id === edit.writer.id && v.id === edit.id) {
        return { ...v, content: res.data.content };
      } else {
        return { ...v };
      }
    });
    setCommentList(copied);
  };
  //댓글 삭제 함수
  const removeHandler = async (item) => {
    await Api.delete(`comments/${item.id}`);
    const res = await Api.get(
      `commentlist/${targetId ? targetId : portfolioOwnerId}`
    );
    setCommentList(res.data);
  };

  //댓글 목록을 불러오는 함수
  const getCommentList = async () => {
    console.log(targetId);
    console.log(userState.user.id);
    const res = await Api.get(
      `commentlist/${targetId ? targetId : portfolioOwnerId}`
    );
    setCommentList(res.data);
  };

  useEffect(() => {
    getCommentList();
  }, [reviewArray, portfolioOwnerId]);
  return (
    <Container>
      <h4>방명록</h4>
      <scroll-container>
        {commentList.map((data, idx) => (
          <CommentElement
            key={idx}
            data={data}
            editHandler={editHandler}
            removeHandler={removeHandler}
          ></CommentElement>
        ))}
      </scroll-container>
      <form onSubmit={handleSubmit}>
        <input
          className="review-input"
          type="text"
          placeholder="댓글을 입력해주세요"
          onChange={handleReviewInput}
          value={review}
        ></input>
        <button className="review-btn">등록</button>
      </form>
    </Container>
  );
};

export default Comment;

const Container = styled.div`
  margin: 20px 20px;
  width: 300px;
  height: 400px;
  border: 1px gray solid;
  border-radius: 5px;
  scroll-container {
    display: block;
    width: 280px;
    height: 300px;
    overflow-y: scroll;
    margin: 0 auto;
    border: 1px gray solid;
  }
  .review-input {
    width: 300px;
  }
  .review-btn {
    width: 300px;
    border-radius: 5px;
    border: 3px solid skyblue;
    background-color: skyblue;
  }
  .text {
    margin: 0 10px;
  }
  .userId {
    color: gray;
    margin-left: 10px;
  }
`;
