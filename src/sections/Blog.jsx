import { Link } from "react-router-dom";
import { posts } from "../posts";
import { Reveal, SectionHead } from "../components/motion";

export default function Blog() {
  return (
    <section id="blog" className="section">
      <SectionHead
        index="06"
        kicker="blog"
        title="Notes & write-ups"
      >
        Write-ups of what I'm learning, mostly so future me remembers how it worked.
      </SectionHead>

      <ol className="posts">
        {posts.map((post, i) => {
          const draft = post.date.toLowerCase().includes("coming soon");
          return (
            <Reveal as="li" key={post.slug} delay={i * 80}>
              <Link to={`/blog/${post.slug}`} className={`post-row ${draft ? "is-draft" : ""}`}>
                <span className="post-row__index">{String(i + 1).padStart(2, "0")}</span>
                <span className="post-row__body">
                  <span className="post-row__date">{post.date}</span>
                  <span className="post-row__title">{post.title}</span>
                  <span className="post-row__desc">{post.description}</span>
                </span>
                <span className="post-row__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
