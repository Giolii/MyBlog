import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import Comments from "./Comments";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostAndUser = async () => {
      try {
        //   Fetch Post and User details
        const postResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/posts/${id}`
        );
        if (!postResponse.ok) throw new Error("Failed to fetch posts");
        const postData = await postResponse.json();
        setPost(postData);
        setUser(postData.user);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };
    fetchPostAndUser();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!post || !user) return <ErrorMessage message="Post not found" />;
  return (
    <div>
      <Link to="/" className="text-blue-500 mb-6 inline-block">
        ← Back to Posts
      </Link>
      <article className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="mb-6 text-gray-600">
          <p className="mb-2">Written by: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
        <p className="text-gray-800 leading-relaxed mb-8">{post.content}</p>
        <div className="border-t pt-8">
          <Comments postId={post.id} />
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
