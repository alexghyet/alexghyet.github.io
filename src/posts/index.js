import umapContent from "./umap-peptides.md?raw";
import fillerContent from "./filler-info.md?raw";

export const posts = [
  {
    title: "How I learned UMAP to visualize peptide embeddings",
    date: "December 2025 - April 2026",
    description:
      "A breakdown of my research project - what is dimensionality reduction and how I built a data visualizer",
    slug: "umap-peptides",
    content: umapContent,
  },
  {
    title: "Filler info",
    date: "coming soon",
    description: "not sure what ill put here",
    slug: "filler-info",
    content: fillerContent,
  },
];
