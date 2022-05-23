import { CommentModel } from "../schemas/comment";

class Comment {
  static async create({ newComment }) {
    const createdNewComment = await CommentModel.create(newComment);
    return createdNewComment;
  }

  static async findById({ commentId }) {
    const comment = await CommentModel.findOne({ id: commentId }).populate(
      "writer"
    );
    return comment;
  }

  static async findByTargetId({ target }) {
    const comments = await CommentModel.find({ target }).populate("writer");;
    return comments;
  }

  static async update({ commentId, updatedContent }) {
    const filter = { id: commentId };
    const update = { content: updatedContent };
    const option = { returnOriginal: false };
    const updatedComment = await CommentModel.findOneAndUpdate(
      filter,
      update,
      option
    );
    return updatedComment;
  }

  static async deleteById({ commentId }) {
    const deleteResult = await CommentModel.deleteOne({ id: commentId });
    const isDeleted = deleteResult.deletedCount == 1;
    return isDeleted;
  }
}

export { Comment };
