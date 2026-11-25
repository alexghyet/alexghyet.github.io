import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import BentoHero from "./hero/BentoHero";
import About from "./sections/About";
import Research from "./sections/Research";
import Projects from "./sections/Projects";
import Leadership from "./sections/Leadership";
import Skills from "./sections/Skills";
import Blog from "./sections/Blog";
import Contact from "./sections/Contact";

// Markdown + syntax highlighting are heavy, so only load them on post pages.
const BlogPost = lazy(() => import("./pages/BlogPost"));

function MainPage() {
  return (
    <main id="main">
      <BentoHero />
      <About />
      <Research />
      <Projects />
      <Leadership />
      <Skills />
      <Blog />
      <Contact />
    </main>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollToTop />
      <div className="backdrop" aria-hidden="true" />
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/blog/:slug"
          element={
            <Suspense fallback={<main id="main" className="blog-post" />}>
              <BlogPost />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

export default App;
