import Link from "next/link";
import { ViewTransition } from "react";
import { notFound } from "next/navigation";
import projects from "../../data/projects";
import styles from "./project.module.css";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  return {
    title: project ? `${project.title} — Portfolio d’Elizabeth` : "Projet introuvable",
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  !project && notFound();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} href="/page-principale" aria-label="Retour à l’accueil">
          E<span>.</span>
        </Link>
        <Link className={styles.backLink} href="/page-principale">
          <span aria-hidden="true">←</span> Retour aux projets
        </Link>
        <span className={styles.headerLabel}>Portfolio — 2026</span>
      </header>

      <article className={styles.project}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>
            Projet {project.number} <span>·</span> {project.category}
          </p>
          <ViewTransition
            name={`project-title-${project.slug}`}
            share="morph"
            default="none"
          >
            <h1>{project.title}</h1>
          </ViewTransition>
          <p className={styles.description}>{project.description}</p>
        </div>

        <div className={styles.gallery}>
          {project.gallery.map((image, index) => (
            <figure className={styles.galleryItem} key={image}>
              {index === 0 ? (
                <ViewTransition
                  name={`project-image-${project.slug}`}
                  share="morph"
                  default="none"
                >
                  <img
                    src={image}
                    alt={`${project.title} — image ${index + 1}`}
                    loading="eager"
                  />
                </ViewTransition>
              ) : (
                <img
                  src={image}
                  alt={`${project.title} — image ${index + 1}`}
                  loading="lazy"
                />
              )}
              <figcaption>
                <span>{project.title}</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className={styles.details}>
          <section>
            <p className={styles.detailLabel}>01 — Le contexte</p>
            <p>{project.context}</p>
          </section>
          <section>
            <p className={styles.detailLabel}>02 — Mon approche</p>
            <p>{project.approach}</p>
          </section>
          <section className={styles.tagsSection}>
            <p className={styles.detailLabel}>03 — Catégories</p>
            <ul className={styles.tags}>
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </section>
        </div>
        <Link className={styles.nextLink} href="/page-principale">
          <span>Explorer les autres projets</span>
          <span aria-hidden="true">↗</span>
        </Link>
      </article>
    </main>
  );
}
