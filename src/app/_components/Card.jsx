import Link from "next/link";
import { ViewTransition } from "react";

export default function Card({ project }) {
  return (
    <Link
      className={`personalCard personalCard-${project.slug}`}
      href={`/projets/${project.slug}`}
      aria-label={`${project.title} — ${project.category}`}
    >
      <ViewTransition
        name={`project-image-${project.slug}`}
        share="morph"
        default="none"
      >
        <img
          className="personalCardImage"
          src={project.cover}
          alt=""
          loading="lazy"
        />
      </ViewTransition>
      <span className="personalCardNumber">{project.number}</span>
      <span className="personalCardContent">
        <ViewTransition
          name={`project-title-${project.slug}`}
          share="morph"
          default="none"
        >
          <span className="personalCardTitle">{project.title}</span>
        </ViewTransition>
        <span className="personalCardCategory">{project.category}</span>
      </span>
      <span className="personalCardArrow" aria-hidden="true">
        ↗
      </span>
    </Link>
  );
}
