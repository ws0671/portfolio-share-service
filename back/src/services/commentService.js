// from을 폴더(db) 로 설정 시, 디폴트로 index.js 로부터 import함.
import { v4 as uuidv4 } from "uuid";
import { Comment } from "../db/";

class CommentService {
  static async addComment({ writer, content, target }) {
    // id로 uuid 유니크값 사용
    const id = uuidv4();
    const newComment = { id, writer, content, target };
    // db에 저장
    const createdNewComment = await Comment.create({ newComment });
    return createdNewComment;
  }

  static async getComment({ commentId }) {
    // 해당 id를 가진 데이터가 db에 존재 여부 확인
    const comment = await Comment.findById({ commentId });
    if (!comment) {
      const errorMessage =
        "해당 id를 가진 댓글 데이터는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    return comment;
  }

  static async getCommentList({ target }) {
    const commentList = await Comment.findByTargetId({ target });
    return commentList;
  }

  static async setComment({ commentId, updatedContent }) {
    // 해당 id를 가진 데이터가 db에 존재 여부 확인
    let comment = await Comment.findById({ commentId });

    if (!comment) {
      const errorMessage =
        "해당 id를 가진 댓글 데이터는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }

    if (updatedContent) {
      comment = await Comment.update({ commentId, updatedContent });
    }
    return comment;
  }

  static async deleteComment({ commentId }) {
    const isDeleted = await Comment.deleteById({ commentId });

    if (!isDeleted) {
      const errorMessage =
        "해당 id를 가진 댓글 데이터는 없습니다. 다시 한 번 확인해 주세요.";
      return { errorMessage };
    }
    return { status: "ok" };
  }
}

export { CommentService };
