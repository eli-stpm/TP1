https://www.noartmusic.com/
https://soliciabrown.com/
https://yanfssss.ayoniyi.dev/
https://mattjinn.com/

https://brandonbartram.dev/

https://ghuynguyen.vercel.app/
https://www.cortiz.dev/

https://www.schemeengine.com/
https://hyperspeed.agency/





      tl.fromTo(".loaderContent", { scale: 0.5, duration: 0.3 }, { scale: 1 })
        .to(".loaderContent", { gap: "2em" }, "<")
        // .fromTo(".loaderMark", { scale: 0.1 }, { scale: 3 }, "<")
        // .addLabel("increment")
        // .to(".loaderProgress span", {
        //   innerText: 100,
        //   duration: 2.5,
        //   delay: 0.8,
        //   snap: {
        //     innerText: 1,
        //   },
        // })
        // .to(
        //   ".Loader__icon",
        //   {
        //     rotation: 180,
        //     repeat: 1.5,
        //     delay: 0.5,
        //     duration: 0.8,
        //     repeatDelay: 0.8,
        //   },
        //   "<",
        // )
        // .to(".loaderMark", { scale: 140, duration: 0.5 }, "increment+=3.5")
        // .set(".loaderScreen", { display: "none" })
        // .addLabel("FIN_LOADER");

      // tl.seek("FIN_LOADER");



    <div ref={loaderRef}>
      <div className="Loader">
        <div className="Loader__wrapper">
          <p>Chargement</p>
          <div className="Loader__icon" />
          <p className="Loader__status">
            <span>0</span>%
          </p>
        </div>
      </div>
    </div>