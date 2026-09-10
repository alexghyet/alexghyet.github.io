import { Link } from "react-router-dom";
import { posts } from "./posts";

function Blog() {
  return (
    <section
      id="blog"
      style={{
        padding: "100px 0px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <p style={{ color: "#00d0ff", marginBottom: "8px", fontWeight: "700" }}>
        writing
      </p>
      <h2 style={{ fontSize: "36px", marginBottom: "40px" }}>Blog</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                borderTop: "1px solid #222",
                padding: "28px 0",
              }}
            >
              <p
                style={{
                  color: "#00d0ff",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                {post.date}
              </p>
              <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>
                {post.title}
              </h3>
              <p style={{ color: "#00d0ff", lineHeight: "1.8" }}>
                {post.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Blog;
