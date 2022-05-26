import React, { useState, useContext } from "react";
import { UserStateContext } from "../../App";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { Modal, Button } from "react-bootstrap";

const CommentElement = ({ data, editHandler, removeHandler }) => {
  const [edit, setEdit] = useState(false);
  const [comment, setComment] = useState(data.content);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const userState = useContext(UserStateContext);

  return (
    <div>
      {edit ? (
        <>
          <input
            className="review-input"
            type="text"
            placeholder="댓글을 입력해주세요"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          ></input>
          <button
            className="Edit-btn1"
            onClick={() => {
              editHandler(data, comment);
              setEdit(false);
            }}
          >
            확인
          </button>
          <button
            className="Edit-btn2"
            onClick={() => {
              setComment(data.comment);
              setEdit(false);
            }}
          >
            취소
          </button>
        </>
      ) : (
        <>
          <span className="userId">{data.writer.name}</span>
          <span className="text">{data.content}</span>
          {data.writer?.id === userState.user?.id && (
            <>
              <AiFillEdit
                style={{ cursor: "pointer" }}
                onClick={() => setEdit(true)}
              ></AiFillEdit>
              <AiFillDelete
                style={{ cursor: "pointer" }}
                onClick={handleShow}
              ></AiFillDelete>
            </>
          )}
        </>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>댓글</Modal.Title>
        </Modal.Header>
        <Modal.Body>정말로 지우시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              removeHandler(data);
              setShow(false);
            }}
          >
            네
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            아니오
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommentElement;
