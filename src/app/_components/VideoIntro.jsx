"use client";

import "./VideoIntro.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { imageSequence, videoFrameUrls } from "../_helpers/videoScrub";

gsap.registerPlugin(useGSAP);

export default function VideoIntro() {
  const containerRef = useRef();
  const canvasRef = useRef();

  useGSAP(
    () => {
      return canvasRef.current
        ? (function () {
          const destroyResize = imageSequence({
            urls: videoFrameUrls,
            canvas: canvasRef.current,
            timeline: gsap.timeline({ repeat: -1, yoyo: true }),
            duration: 18,
          });

          return () => destroyResize && destroyResize();
        })()
        : undefined;
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="videoIntro">
      <div className="videoFrame">
        <canvas ref={canvasRef} className="videoCanvas" aria-label="Animation de présentation" />
        <span className="videoFrameCorner videoFrameCornerTop" />
        <span className="videoFrameCorner videoFrameCornerBottom" />
      </div>
    </section>
  );
}
