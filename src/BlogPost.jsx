import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { posts } from './posts'

function BlogPost() {
  const { slug } = useParams()
  const post = posts.find(p => p.slug === slug)

  if (!post) {
    return (
      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '80px 20px' }}>
        <p>Post not found.</p>
        <Link to="/" style={{ color: '#00d0ff' }}>← Back</Link>
      </div>
    )
  }

  return (
    <article className="blog-post">
      <Link to="/#blog" style={{ color: '#00d0ff', textDecoration: 'none' }}>← Back</Link>
      <p style={{ color: '#00d0ff', fontSize: '14px', margin: '24px 0 8px' }}>{post.date}</p>
      <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>{post.title}</h1>
      <div className="blog-content">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              )
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
        <Link className="back-home-button" to="/">
          Back to home
        </Link>
      </div>
    </article>
  )
}

export default BlogPost