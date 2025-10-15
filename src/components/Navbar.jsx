import gsap from "gsap";
import { useRef, useState } from "react";
import NavBox from "../canvas/NavBox";
import ActiveLink from "./ActiveLink";

const Navbar = () => {
  const [straighten, setStraighten] = useState(false);
  const [NavBoxHovered, setNavBoxHovered] = useState(false);
  const topRef = useRef();
  const bottomRef = useRef();

  const handleClick = (e) => {
    e.preventDefault(); // Default navigation रोको
    window.transitionState.startTransition(to); // ✅ Transition trigger
  };

  const openDoors = () => {
    setNavBoxHovered(true);
    gsap.to(topRef.current, { y: "-100%", duration: 0.5, ease: "power2.out" });
    gsap.to(bottomRef.current, {
      y: "100%",
      duration: 0.5,
      ease: "power2.out",
    });
  };

  const closeDoors = () => {
    setNavBoxHovered(false);
    gsap.to(topRef.current, { y: "0%", duration: 0.5, ease: "power2.inOut" });
    gsap.to(bottomRef.current, {
      y: "0%",
      duration: 0.5,
      ease: "power2.inOut",
    });
  };
  return (
    <div className="header fixed bottom-10 right-8 z-[99] max-sm:right-0">
      <div className="header_section w-auto h-[80px] flex gap-0.5 max-sm:h-[60px] max-sm:w-[300px]">
        {/* Left Box */}
        <div
          className="group relative overflow-hidden cursor-pointer w-20 h-full flex items-center justify-center bg-red-500 p-6 border-r-2 border-[#9B9B88] max-sm:w-16"
          onClick={handleClick}
          onMouseEnter={openDoors}
          onMouseLeave={closeDoors}
        >
          <div
            ref={topRef}
            className="absolute top-0 left-0 w-full h-1/2 bg-black z-0"
          ></div>
          <div
            ref={bottomRef}
            className="absolute bottom-0 left-0 w-full h-1/2 bg-black z-0"
          ></div>
          <NavBox straighten={straighten} NavBoxHovered={NavBoxHovered} />
        </div>

        {/* Nav Links */}
        <div className="w-[400px] bg-black max-sm:w-[250px]">
          <div className="border-2 h-full navlink flex items-center justify-between px-8 max-sm:px-4">
            <div>
              <ActiveLink to="/" label="Home" />
            </div>
            <div>
              <ActiveLink to="/about" label="About" />
            </div>
            <div>
              <ActiveLink to="/work" label="Work" />
            </div>
            <div>
              <ActiveLink to="/contact" label="Contact" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
