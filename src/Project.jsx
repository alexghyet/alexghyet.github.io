const projects = [
  {
    title: 'Peptide Embedding Visualizer',
    description:
      'Reducing high-dimensional ProteoGPT peptide embeddings with UMAP and DensMAP to visualize and classify antimicrobial peptides via a Streamlit research tool.',
    tools: ['Python', 'UMAP', 'DensMAP', 'ProteoGPT', 'Streamlit'],
    link: 'https://github.com/alexghyet',
  },
  {
    title: 'Autonomous Submarine - Computer Vision Subteam',
    description: "Senior Capstone project for Fall 26' - Spring 27 '",
    tools: ['Computer Vision', 'CSS'],
    link: '',
    status: 'In Progress'
  },
  {
    title: 'Personal Website',
    description:
      'Designed and built with React. Just wanted to learn the fundamentals and mess around with CSS and see how it works!',
    tools: ['React', 'CSS'],
    link: '',
    status: 'Coming Soon'
  },
]

function Projects() {
  return (
    <section
      id="projects"
      style={{
        padding: '100px 0px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <p style={{ color: '#00d0ff', marginBottom: '8px', fontWeight: '700' }}>
        My Work
      </p>
      <h2 style={{ fontSize: '36px', marginBottom: '40px' }}>Projects</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {projects.map((project) => (
          <div
            key={project.title}
            style={{
              border: '1px solid #00d0ff',
              padding: '28px',
            }}
          >
            <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>
              {project.title}
            </h3>
            <p
              style={{
                color: '#00d0ff',
                lineHeight: '1.8',
                marginBottom: '20px',
              }}
            >
              {project.description}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  style={{
                    border: '1px solid #00d0ff',
                    color: '#00d0ff',
                    padding: '4px 12px',
                    fontSize: '14px',
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>

            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#00d0ff',
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                view on github →
              </a>
            ) : project.status ? (
              <span style={{ color: '#888', fontSize: '14px' }}>
                {project.status}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Projects