"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Card from "./Card";
import "./Stack.css";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Stack({ projects, projectCount }) {
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.innerWidth <= 800
      ) {
        return;
      }

      const viewport = viewportRef.current;
      const track = trackRef.current;
      const cards = gsap.utils.toArray(".personalCard", containerRef.current);
      if (!viewport || !track || cards.length < 2) return;

      let currentActiveIndex = -1;
      const animateCards = () => {
        const trackX = Number(gsap.getProperty(track, "x")) || 0;
        const center = viewport.clientWidth / 2;
        let nearestIndex = 0;
        let nearestDistance = Infinity;

        cards.forEach((card, index) => {
          const cardCenter = card.offsetLeft + card.offsetWidth / 2 + trackX;
          const distance = cardCenter - center;
          const normalizedDistance = distance / viewport.clientWidth;
          const absoluteDistance = Math.abs(normalizedDistance);

          if (absoluteDistance < nearestDistance) {
            nearestDistance = absoluteDistance;
            nearestIndex = index;
          }

          gsap.set(card, {
            scale: 1 - Math.min(absoluteDistance * 0.2, 0.18),
            rotation: gsap.utils.clamp(-4, 4, normalizedDistance * 5),
            opacity: 1 - Math.min(absoluteDistance * 0.45, 0.3),
            zIndex: cards.length - Math.round(absoluteDistance * 10),
          });
        });

        if (nearestIndex !== currentActiveIndex) {
          currentActiveIndex = nearestIndex;
          setActiveIndex(nearestIndex);
        }
      };

      gsap.set(track, { x: 0 });
      animateCards();

      const tween = gsap.to(track, {
        x: () => -(track.scrollWidth - viewport.clientWidth),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () =>
            `+=${Math.max(track.scrollWidth - viewport.clientWidth, 1)}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scrollTriggerRef.current = self;
            animateCards();
          },
          onRefresh: (self) => {
            scrollTriggerRef.current = self;
            animateCards();
          },
        },
      });

      scrollTriggerRef.current = tween.scrollTrigger;
      return () => {
        scrollTriggerRef.current = null;
      };
    },
    { scope: containerRef, dependencies: [projects.length] },
  );

  function navigateCards(direction) {
    const nextIndex = gsap.utils.clamp(
      0,
      projects.length - 1,
      activeIndex + direction,
    );
    const scrollTrigger = scrollTriggerRef.current;

    if (scrollTrigger && viewportRef.current && trackRef.current) {
      const card = trackRef.current.children[nextIndex];
      const distance =
        card.offsetLeft +
        card.offsetWidth / 2 -
        viewportRef.current.clientWidth / 2;
      const maxDistance =
        trackRef.current.scrollWidth - viewportRef.current.clientWidth;
      const progress = maxDistance > 0 ? distance / maxDistance : 0;
      scrollTrigger.scroll(
        scrollTrigger.start +
          gsap.utils.clamp(0, 1, progress) *
            (scrollTrigger.end - scrollTrigger.start),
      );
      return;
    }

    const card = trackRef.current?.children[nextIndex];
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveIndex(nextIndex);
  }

  return (
    <div className="personalStackTrigger" ref={containerRef}>
      <div className="personalStackHeading">
        <header className="personalStackHeader">
          <p className="sectionEyebrow">Sélection personnelle</p>
          <h2 id="projects-title">
            Projets <span>choisis.</span>
          </h2>
          <p className="personalStackDescription">
            Une sélection de projets créatifs qui me tiennent à cœur.
          </p>
        </header>
        <div className="personalStackControls">
          <span className="sectionCount">
            {String(activeIndex + 1).padStart(2, "0")} / {projectCount}
          </span>
          <button
            className="personalStackButton"
            type="button"
            aria-label="Projet précédent"
            onClick={() => navigateCards(-1)}
            disabled={activeIndex === 0}
          >
            ←
          </button>
          <button
            className="personalStackButton"
            type="button"
            aria-label="Projet suivant"
            onClick={() => navigateCards(1)}
            disabled={activeIndex === projects.length - 1}
          >
            →
          </button>
        </div>
      </div>
      <div className="personalStackViewport" ref={viewportRef}>
        <div
          className="personalStackTrack"
          ref={trackRef}
          aria-labelledby="projects-title"
        >
          {projects.map((project) => (
            <Card key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
