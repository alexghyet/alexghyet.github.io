# Building PepSpace: How I Visualized Peptide Embeddings

## Why this project

This research project was under my research advisor, Dr Armando Beltran, at Cal State LA. Our goal was to visualize high-dimensional peptide embeddings to help researchers discover new antimicrobial peptides, tackling the growing issue of antibiotic resistance.

The reason I joined this project came from a growing interest between the intersection of computer science and biology. Two topics that I'm interested in, I thought why not have the best of both worlds?!

Initially Dr Beltran was my professor during the Fall 2025 school term at Cal State LA and in his bio he mentioned his work in Computational Biology, which at the time I had a growing interest in. I reached out and he invited me to join his lab starting in Spring 2026.

## The problem: antimicrobial peptides and their embeddings

The main problem this research is tackling is **antimicrobial resistance (AMR)**, a growing global health threat where bacteria evolve resistance to the antibiotics we currently rely on. This in turn leads to research in **antimicrobial peptides (AMPs)**, short chains of amino acids that can kill or inhibit harmful microbes, which are used in drug discovery to provide alternatives to traditional antibiotics.

Amino acid sequences are something we can't really visualize on their own, they're just long strings of letters for example, GLFDIVKKVVGALGSL. This is why we convert them into embeddings which represent these sequences as a vector, which is a list of numbers or a point in a high dimensional space. This lets us recognize peptides with similar biochemical or functional properties, which are positioned close to each other even though their sequences are nothing alike. In this project, we used **ProteoGPT**, a pretrained protein language model, on an existing peptide dataset called Veltri to generate embeddings.

## What is dimensionality reduction?

Dimensionality reduction is the process of reducing high-dimensional vectors to a lower dimension. We do this because we can't visualize data in high dimensions directly. So it's reduced to for example, 2 or 3 dimensions, which we can actually plot and see.

There are dozens of methods to reduce dimensionality. The two we focused on specifically were **Uniform Manifold Approximation and Projection (UMAP)** and **densMAP**, an extension of UMAP that preserves the density of the data. UMAP is great at preserving the global clustering structure of data, which is necessary for visualizing which embeddings are similar to each other. DensMAP builds on this by also preserving local density. Meaning it doesn't just show which points are near each other, but how tightly or loosely packed they are.

## Building the visualizer

PepSpace was built in Python, using:

- **Streamlit**: A Python framework that turns the app into an interactive web tool in the browser
- **NumPy**: Handles the embedding arrays and the math
- **pandas**: Manages peptide metadata like the IDs, sequences, and AMP labels
- **Plotly**: Allows us to implement the graphs for data visualization
- **UMAP**: The dimensionality reduction method used to visualize high-dimensional vectors
- **scikit-learn**: Provides the trustworthiness metric used to evaluate how well the projection preserves the original data's structure

<!-- technical walkthrough + code snippets -->

## What I learned

<!-- reflection -->

<!-- poster picture-->
