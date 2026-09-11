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

PepSpace was built to let researchers upload their own `.csv` metadata and `.npy` embeddings, even letting them choose which columns correspond to peptide ID, sequence, and label if the app can't auto-detect them.

PepSpace was built in Python, using:

- **Streamlit**: A Python framework that turns the app into an interactive web tool in the browser
- **NumPy**: Handles the embedding arrays and the math
- **pandas**: Manages peptide metadata like the IDs, sequences, and AMP labels
- **Plotly**: Allows us to implement the graphs for data visualization
- **UMAP**: The dimensionality reduction method used to visualize high-dimensional vectors
- **scikit-learn**: Provides the trustworthiness metric used to evaluate how well the projection preserves the original data's structure

### Uploading your own data

Researchers can upload their own embeddings and metadata directly from the sidebar.

```python
uploaded_embeddings = st.sidebar.file_uploader("Upload embeddings (.npy)", type=["npy"])
uploaded_metadata = st.sidebar.file_uploader("Upload metadata (.csv)", type=["csv"])
```

### Auto-detecting metadata columns

If a column isn't automatically recognized, the sidebar lets the user manually select it.

```python
def pick_col(df, candidates):
    cols_lower = {c.lower(): c for c in df.columns}
    for cand in candidates:
        if cand.lower() in cols_lower:
            return cols_lower[cand.lower()]
    return None
```

### Tuning the projection

`n_neighbors` and `min_dist` control how UMAP balances local vs. global structure. 

Local structure is how well individual neighborhoods are preserved, and global structure being how well the overall shape and relationships between clusters hold up. A smaller `n_neighbors` favors local detail, and a larger one favors the big picture shape, which can be adjusted from the sidebar.

```python
nn = col1.slider("##nn_slider", 2, 200, key="nn_slider")
md = col1.slider("##md_slider", 0.0, 1.0, step=0.001, key="md_slider")
```

### Switching between UMAP and densMAP

A simple toggle switches between the two projection methods.

```python
method = st.sidebar.radio("Projection Type", ["UMAP", "densMAP"], key="method_radio")
```

### Measuring embedding quality

Trustworthiness scores how well the lower-dimensional projection preserves the original high-dimensional structure.

```python
trust_2d = trustworthiness(X, X_umap_2d, n_neighbors=CFG.n_neighbors)
trust_nd = trustworthiness(X, X_umap_nd, n_neighbors=CFG.n_neighbors)
```

### Selecting a region in 2D

Users can draw a box or lasso selection on the 2D plot to isolate a cluster of peptides.

```python
select_mode = st.sidebar.radio("Selection Mode", ["pan", "box", "lasso"], index=0)
```

### Linking the 2D and 3D views

Whatever gets selected in 2D is stored in `session_state`, then used to highlight the same peptides on the 3D sphere.

```python
if selected_points_2d:
    st.session_state["selected_indices"] = [p["point_index"] for p in selected_points_2d]
```

### Saving selections

Selected peptides and their sphere coordinates can be exported to JSON for later use.

```python
json.dump({
    "selected_ids": selected_df["id"].tolist(),
}, f_out, indent=2)
```

## What I learned

With this research project, I sharpened my skills by using tools I've never used before. For example, Streamlit and UMAP, two tools I've actually never heard about until starting this project. I also learned how to properly read research papers, being able to do this gave me a strong enough foundation to know what I was doing and potentially explain my work on a technical level.

I grew both personally and technically with this research project, I never really thought I was competent enough to be able to work on research in general. Yet after trying it, I found that I am more than able to be able to do cool stuff. It inspired me to pursue challenging things without having regrets, I'm here to learn and be the best version of myself I can be. 

I look forward to continuing this project with Dr Beltran in Fall 2026 to further refine this app. 

This is just the beginning ! 

## Here's the poster!
The research poster

<iframe src="/PepFinal.pdf" width="100%" height="700px" style="border: 1px solid #222; border-radius: 8px;"></iframe>

[Or download the full poster (PDF)](/PepFinal.pdf)