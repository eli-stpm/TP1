import gsap from "gsap";

export const videoFrameUrls = Array.from({ length: 450 }, (_, index) =>
  `/video/image_${String(index + 1).padStart(4, "0")}.jpg`,
);

const mediaCache = new Map();

export function getPreloadedMedia(url) {
  if (!mediaCache.has(url)) {
    const image = new Image();
    mediaCache.set(url, image);
    image.src = url;
  }

  return mediaCache.get(url);
}

export function preloadMedias(urls, onProgress) {
  let completed = 0;
  let disposed = false;
  const cleanups = [];

  if (urls.length === 0) {
    onProgress(1);
    return () => {};
  }

  urls.forEach((url) => {
    const image = getPreloadedMedia(url);
    let settled = false;

    const finish = (error) => {
      if (settled) return;
      settled = true;
      image.removeEventListener("load", onLoad);
      image.removeEventListener("error", onError);
      completed += 1;

      if (error) console.error(`Unable to preload media: ${url}`, error);
      if (!disposed) onProgress(completed / urls.length);
    };
    const onLoad = () => finish();
    const onError = (event) => finish(event);

    if (image.complete) {
      finish(image.naturalWidth ? undefined : new Error("Image failed to load"));
    } else {
      image.addEventListener("load", onLoad);
      image.addEventListener("error", onError);
      cleanups.push(() => {
        image.removeEventListener("load", onLoad);
        image.removeEventListener("error", onError);
      });
    }
  });

  return () => {
    disposed = true;
    cleanups.forEach((cleanup) => cleanup());
  };
}

// https://gsapRef.com/docs/v3/HelperFunctions/helpers/imageSequenceScrub/
// + resize
/*

// Utilisation:
const destroyResize = imageSequence({
    urls: urls,
    canvas: canvasRef.current,
    timeline: tl,
});
return () => destroyResize && destroyResize();

Helper function that handles scrubbing through a sequence of images, drawing the appropriate one to the provided canvas.
Config object properties:
  - urls [Array]: an Array of image URLs
  - canvas [Canvas]: the <canvas> object to draw to
  - timeline: [gsap Timeline]: optional gsap timeline with a scrollTrigger (usually)
  - onUpdate [Function]: optional callback for when the Tween updates (probably not used very often)

 Returns a Tween instance
*/
export const imageSequence = (config) => {
  let playhead = { frame: 0 },
    canvas = gsap.utils.toArray(config.canvas)[0],
    ctx = canvas.getContext("2d"),
    onUpdate = config.onUpdate,
    images,
    updateImage = function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      let activeImage = images[Math.round(playhead.frame)];

      activeImage && activeImage.complete &&
        (function () {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const baseWidth = activeImage.naturalWidth;
          const baseHeight = activeImage.naturalHeight;

          const hRatio = canvas.width / baseWidth;
          const vRatio = canvas.height / baseHeight;
          const ratio = Math.max(hRatio, vRatio);

          const centerShift_x = (canvas.width - baseWidth * ratio) / 2;
          const centerShift_y = (canvas.height - baseHeight * ratio) / 2;

          ctx.drawImage(
            activeImage,
            0,
            0,
            baseWidth,
            baseHeight,
            centerShift_x,
            centerShift_y,
            baseWidth * ratio,
            baseHeight * ratio,
          );
        })();
      onUpdate && onUpdate.call(this);
    };

  window.addEventListener("resize", updateImage);

  images = config.urls.map((url) => {
    const img = getPreloadedMedia(url);
    img.addEventListener("load", updateImage);
    return img;
  });
  updateImage();

  (config?.timeline ?? gsap).to(playhead, {
    frame: images.length - 1,
    duration: config.duration ?? 1,
    ease: "none",
    onUpdate: updateImage,
  });

  return () => {
    window.removeEventListener("resize", updateImage);
    images.forEach((image) => image.removeEventListener("load", updateImage));
  };
};
