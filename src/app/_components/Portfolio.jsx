"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VideoIntro from "./VideoIntro";
import Stack from "./Stack";
import projects from "../data/projects";
import "./Portfolio.css";

gsap.registerPlugin(ScrollTrigger);

const Portfolio = () =>// export default function Portfolio() 
{
  const containerRef = useRef();
  const headingRef = useRef();
  const nameRef = useRef();
  const projectCount = String(projects.length).padStart(2, "0");

  useEffect(() => {
    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

      if (reducedMotion.matches) {
        gsap.set(
          ".heroEyebrow, .heroBottom, .heroIndex, .personalStackHeader, .siteFooter",
          { opacity: 1, y: 0 },
        );
        nameRef.current?.setAttribute("fill", "#f2f0e9");
        return;
      }

      gsap.from(".heroEyebrow", {
        y: 18,
        opacity: 0,
        duration: 0.6,
      });

      gsap.fromTo(
        nameRef.current,
        { fill: "transparent" },
        { fill: "#f2f0e9", duration: 1.8 },
      );

      gsap.from(".heroBottom", {
        y: 28,
        opacity: 0,
        duration: 0.7,
      });

      gsap.from(".heroIndex", {
        y: 20,
        opacity: 0,
        duration: 0.6,
      });

      gsap.from(".personalStackHeader", {
        y: 24,
        opacity: 0,
        duration: 0.65,
      });

      gsap.from(".siteFooter", {
        opacity: 0,
        duration: 0.5,
      });
    }, containerRef);
    return () => context.revert();
  }, []);

  return (
    <main ref={containerRef} className="portfolio">
        <header className="siteHeader">
          <Link className="siteLogo" href="/page-principale" aria-label="Accueil — portfolio">
            E<span>.</span>
          </Link>
          <span className="headerLabel">Menu</span>
          <nav className="siteNav" aria-label="Navigation principale">
            <Link href="/page-principale">Accueil</Link>
            <a href="#projets">Projets</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <VideoIntro />

        <section className="hero" aria-labelledby="hero-title">
          <p className="heroEyebrow">
            <span className="eyebrowDot" />
            Portfolio — 2026
          </p>
          <h1 ref={headingRef} className="heroHeading" id="hero-title">
            <span className="heroSmallHeading">Bonjour, je m’appelle</span>
            <svg
              className="signatureSvg"
              viewBox="0 0 1000 190"
              role="img"
              aria-labelledby="signature-title"
            >
              <title id="signature-title">Elizabeth</title>
              <text
                ref={nameRef}
                className="signatureText"
                x="4"
                y="150"
                textLength="975"
                lengthAdjust="spacingAndGlyphs"
              >
                Elizabeth
              </text>
            </svg>
          </h1>
          <div className="heroBottom">
            <p className="heroDescription">
              Je transforme des idées en expériences visuelles — entre design,
              images et création numérique.
            </p>
            <a className="heroScroll" href="#projets">
              Découvrir mes projets <span aria-hidden="true">↓</span>
            </a>
          </div>
          <span className="heroIndex" aria-hidden="true">
            01 / {projectCount}
          </span>
        </section>

        <section className="projectsSection" id="projets">
          <Stack projects={projects} projectCount={projectCount} />
        </section>

        <footer className="siteFooter" id="contact">
          <span>Elizabeth — Portfolio créatif</span>
          <a href="mailto:elizabeth@example.com">elizabeth@example.com</a>
        </footer>
    </main>
  );
}
export default Portfolio;