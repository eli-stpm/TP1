
"use client";
import gsap from "gsap";
import "./Loader.css";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { preloadMedias, videoFrameUrls } from "../_helpers/videoScrub";

gsap.registerPlugin(DrawSVGPlugin, SplitText);

const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  useGSAP(
    () => {
      const text = loaderRef.current.querySelector(".textAnimation");
      const split = SplitText.create(text, { type: "chars" });
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          onComplete?.();
        },
      });
      tl.fromTo(
        ".loaderContent",
        { scale: 0.5 },
        { scale: 1, duration: 0.4 }
      ).to(".loader-percent", {
        innerText: 100,
        duration: 3,
        delay: 0.2,
        snap: {
          innerText: 1,
        },
      });

      tl.to(
        ".loader-progress",
        {
          scaleX: 1,
          duration: 3,
          ease: "none",
        },
        "<",
      ).to(
        ".loader-bar",
        {
          opacity: 1,
          duration: 0.25,
        },
        "<",
      ).from(
        split.chars,
        {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: { amount: 3.5 },
          ease: "power3.out",
        },
        "<",
      );

      tl.fromTo(
        ".cercle",
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 2, ease: "power1.inOut" },
        "<",
      ).fromTo(
        ".cercle2",
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 2, ease: "power1.inOut" },
        "<",
      ).fromTo(
        ".cercle3",
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 2, ease: "power1.inOut" },
        "<",
      );

      const stopPreloading = preloadMedias(videoFrameUrls, (progress) => {
        tl.progress(progress);
      });

      return () => {
        stopPreloading();
        split.revert();
      };
    },
    { scope: loaderRef }
  );

  return (
    <section ref={loaderRef} className="loaderScreen">
      <svg
        className="loaderBackgroundRing"
        viewBox="0 0 200 200"
        aria-hidden="true"
      >
        <circle
          className="cercle3"
          cx="100"
          cy="100"
          r="98"
          fill="none"
          stroke="#d9e6bf"
          strokeWidth="1"
        />
      </svg>
      <div className="loaderContent">
        <div className="loaderMark">
          <svg className="svgPoint" viewBox="0 0 100 100">
            <circle
              className="point"
              cx="50"
              cy="50"
              r="10"
              fill="white"
              stroke="#d9e6bf"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <svg className="circle" viewBox="0 0 100 100">
            <circle
              className="cercle"
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#d9e6bf"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <svg className="circle" viewBox="0 0 200 200">
            <circle
              className="cercle2"
              cx="100"
              cy="100"
              r="96"
              fill="none"
              stroke="#d9e6bf"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <span />
          <span />
          <span />
        </div>
        <div id="loader">
          <div className="loader-percent">0%</div>
          <div className="loader-bar">
            <div className="loader-progress"></div>
          </div>
        </div>

        {/* <div className="loaderTrack">
          <span className="loaderProgress" />
        </div> */}
        <div className="texte">
          <p className="textAnimation">chargement en cours</p>
        </div>
      </div>

    </section>
  );
};

export default Loader;
