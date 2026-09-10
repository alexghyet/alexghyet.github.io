import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { posts } from "./posts";

function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div
        style={{ maxWidth: "700px", margin: "0 auto", padding: "80px 20px" }}
      >
        <p>Post not found.</p>
        <Link to="/" style={{ color: "#00d0ff" }}>
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "80px 20px" }}>
      <Link to="/#blog" style={{ color: "#00d0ff", textDecoration: "none" }}>
        ← Back
      </Link>
      <p style={{ color: "#00d0ff", fontSize: "14px", margin: "24px 0 8px" }}>
        {post.date}
      </p>
      <h1 style={{ fontSize: "32px", marginBottom: "24px" }}>{post.title}</h1>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
}

export default BlogPost;
