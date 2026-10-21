"use client";
import gsap from "gsap";
import Loader from "./Loader"; 
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import VideoIntro from "./VideoIntro";
gsap.registerPlugin(useGSAP);

const Main = () => {
const mainRef = useRef();

return(
    <main ref={mainRef}>
    <Loader/>
    <VideoIntro/>
    </main>

);

};
export default Main;