import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { posts } from "../posts";

const markdownComponents = {
  code({ inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        customStyle={{ background: "#0b1017", margin: 0, padding: "18px 20px", borderRadius: 12, border: "1px solid #1a2330", fontSize: 14 }}
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className="inline-code" {...props}>
        {children}
      </code>
    );
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const index = posts.findIndex((p) => p.slug === slug);
  const post = posts[index];

  if (!post) {
    return (
      <main id="main" className="blog-post">
        <p className="blog-post__date">404 · post not found</p>
        <h1 className="blog-post__title">This post doesn't exist yet.</h1>
        <Link to="/#blog" className="btn">
          ← Back to all posts
        </Link>
      </main>
    );
  }

  const next = posts[index + 1];

  return (
    <main id="main" className="blog-post">
      <Link to="/#blog" className="blog-post__back">
        ← back to all posts
      </Link>
      <header className="blog-post__header">
        <p className="blog-post__date">
          post {String(index + 1).padStart(2, "0")} · {post.date}
        </p>
        <h1 className="blog-post__title">{post.title}</h1>
        <p className="blog-post__desc">{post.description}</p>
      </header>
      <article className="blog-content">
        <ReactMarkdown rehypePlugins={[rehypeRaw]} components={markdownComponents}>
          {post.content}
        </ReactMarkdown>
      </article>
      <footer className="blog-post__footer">
        {next && (
          <Link to={`/blog/${next.slug}`} className="blog-post__next">
            <span>next post</span>
            {next.title} →
          </Link>
        )}
        <Link to="/" className="btn">
          ← Back to home
        </Link>
      </footer>
    </main>
  );
}
