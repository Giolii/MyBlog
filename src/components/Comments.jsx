import { useState, useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { ReplyComment } from "./comments/ReplyComment";
import { useAuth } from "../contexts/useAuth";
import timeAgo from "./Utils/timeAgo";

const Comments = ({ postId }) => {
  const [editCommentId, setEditCommentId] = useState(null);
  const [commentData, setCommentData] = useState({ title: "", content: "" });
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}/comments`
      );

      if (response.status === 404) {
        setComments([]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch comments");

      const data = await response.json();
      setComments(data);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Error deleting comment");
      fetchComments();
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const updateComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(commentData),
        }
      );
      if (!response.ok) throw new Error("Error updating comment");
      fetchComments();
      setEditCommentId(null);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const handleChange = (e) => {
    setCommentData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditClick = (commentId, title, content) => {
    setEditCommentId(commentId);
    setCommentData({ title: title, content: content });
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (comments.length === 0)
    return (
      <>
        <div className="text-center text-2xl ">No comments yet</div>
        <ReplyComment postId={postId} />
      </>
    );
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-6 relative">
            {user && comment.userId === user.id && (
              <>
                <div
                  onClick={() => deleteComment(comment.id)}
                  className="absolute top-2 right-2 cursor-pointer text-red-700 hover:scale-120 transition-transform"
                >
                  x
                </div>
                <div
                  onClick={() =>
                    handleEditClick(comment.id, comment.title, comment.content)
                  }
                  className="absolute top-2 right-8 cursor-pointer hover:scale-120 transition-transform"
                >
                  ✏️
                </div>
              </>
            )}
            {editCommentId === comment.id ? (
              <div className="flex flex-col space-y-2.5">
                <h2 className="font-bold">Edit comment:</h2>
                <h3>Title:</h3>
                <input
                  name="title"
                  onChange={handleChange}
                  type="text"
                  value={commentData.title}
                  className="border rounded-md p-0.5"
                />
                <h3>Comment:</h3>
                <textarea
                  name="content"
                  onChange={handleChange}
                  type="text"
                  value={commentData.content}
                  className="border rounded-md p-0.5"
                />
                <div className="flex self-center gap-5">
                  <div
                    onClick={() => updateComment(comment.id)}
                    className="border px-1 rounded-md cursor-pointer"
                  >
                    Save
                  </div>
                  <div
                    onClick={() => setEditCommentId(null)}
                    className="border px-1 rounded-md cursor-pointer"
                  >
                    Cancel
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-semibold mb-2">{comment.title}</h3>
                <p className="text-gray-600 mb-2">{comment.user.username}</p>
                <p className="text-gray-800">{comment.content}</p>
                <p className="text-gray-400 absolute bottom-1 right-1">
                  {timeAgo(comment.createdAt)}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
      <ReplyComment postId={postId} fetchComments={fetchComments} />
    </div>
  );
};

export default Comments;
