import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/useAuth";

export const ReplyComment = ({ postId, fetchComments }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/comments/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error posting comment");
      }
      const data = await response.json();
      setSubmitted(true);
      fetchComments();
      setFormData({
        title: "",
        content: "",
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md ">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Leave a Comment</h2>

      {submitted && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          Thank you for your comment!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {user ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your title"
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-3"
              >
                Comment:
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Write your comment here..."
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Send Comment
            </button>
          </div>
        ) : (
          <div>You need to login to comment this post</div>
        )}
      </form>
    </div>
  );
};
