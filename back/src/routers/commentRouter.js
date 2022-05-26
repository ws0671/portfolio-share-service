import is from "@sindresorhus/is";
import { Router } from "express";
import { login_required } from "../middlewares/login_required";
import { CommentService } from "../services/commentService";
import { userAuthService } from "../services/userService";

const commentRouter = Router();
commentRouter.use(login_required);

commentRouter.post("/comment/create", async function (req, res, next) {
  try {
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }
    // req (request) 에서 데이터 가져오기
    const { user_id, content, target } = req.body;

    // user_id 로 writer_id 가져오기
    const writerInfo = await userAuthService.getUserInfo({ user_id });
    const writer = writerInfo._id;

    // 위 데이터를 댓글 db에 추가하기
    const newComment = await CommentService.addComment({
      writer,
      content,
      target,
    });

    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

commentRouter.get("/comments/:id", async function (req, res, next) {
  try {
    // req (request) 에서 id 가져오기
    const commentId = req.params.id;

    // 위 id를 이용하여 db에서 데이터 찾기
    const comment = await CommentService.getComment({ commentId });

    if (comment.errorMessage) {
      throw new Error(comment.errorMessage);
    }

    res.status(200).send(comment);
  } catch (error) {
    next(error);
  }
});

commentRouter.get("/commentlist/:user_id", async function (req, res, next) {
  try {
    // 특정 사용자에게 작성된 전체 댓글 목록을 얻음
    // @ts-ignore
    const target = req.params.user_id;
    const commentList = await CommentService.getCommentList({ target });
    res.status(200).send(commentList);
  } catch (error) {
    next(error);
  }
});

commentRouter.put("/comments/:id", async function (req, res, next) {
  try {
    // req (request) 에서 id 가져오기
    const commentId = req.params.id;

    // body data 로부터 업데이트할 수상 정보를 추출함.
    const updatedContent = req.body.content ?? null;

    // 위 데이터를 이용하여 댓글 db에 수정하기
    const updatedComment = await CommentService.setComment({
      commentId,
      updatedContent,
    });

    if (updatedComment.errorMessage) {
      throw new Error(updatedComment.errorMessage);
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
});

commentRouter.delete("/comments/:id", async function (req, res, next) {
  try {
    // req (request) 에서 id 가져오기
    const commentId = req.params.id;

    // 위 데이터를 이용하여 댓글 db에서 삭제하기
    const result = await CommentService.deleteComment({ commentId });

    if (result.errorMessage) {
      throw new Error(result.errorMessage);
    }
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

export { commentRouter };
