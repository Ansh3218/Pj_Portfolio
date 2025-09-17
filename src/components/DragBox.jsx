// // import { useEffect, useRef } from "react";
// // import gsap from "gsap";
// // import { Draggable } from "gsap/Draggable";

// // gsap.registerPlugin(Draggable);

// // const DragBox = ({ className, children }) => {
// //   const containerRef = useRef(null);
// //   const boxesRef = useRef([]);
// //   const draggablesRef = useRef([]);

// //   useEffect(() => {
// //     const boxes = boxesRef.current;
// //     const container = containerRef.current;

// //     // Initialize Draggable instances
// //     draggablesRef.current = boxes.map(
// //       (box, index) =>
// //         Draggable.create(box, {
// //           type: "x,y",
// //           bounds: container,
// //           inertia: true,
// //           onDrag() {
// //             checkCollision(this.target, index);
// //           },
// //           onDragEnd() {
// //             gsap.to(this.target, {
// //               x: this.x,
// //               y: this.y,
// //               duration: 0.3,
// //               ease: "elastic.out(1,0.4)",
// //             });
// //           },
// //         })[0]
// //     );

// //     // Collision check function
// //     function checkCollision(draggedBox, draggedIndex) {
// //       const rect1 = draggedBox.getBoundingClientRect();

// //       boxes.forEach((box, i) => {
// //         if (i !== draggedIndex) {
// //           const rect2 = box.getBoundingClientRect();

// //           if (
// //             rect1.left < rect2.right &&
// //             rect1.right > rect2.left &&
// //             rect1.top < rect2.bottom &&
// //             rect1.bottom > rect2.top
// //           ) {
// //             const dx = rect1.left - rect2.left;
// //             const dy = rect1.top - rect2.top;
// //             const pushX = dx > 0 ? -40 : 40;
// //             const pushY = dy > 0 ? -40 : 40;

// //             const currentX = gsap.getProperty(box, "x");
// //             const currentY = gsap.getProperty(box, "y");

// //             let newX = currentX + pushX;
// //             let newY = currentY + pushY;

// //             // Boundary constraints
// //             const minX = 0 - box.offsetLeft;
// //             const maxX =
// //               container.clientWidth - box.offsetWidth - box.offsetLeft;
// //             const minY = 0 - box.offsetTop;
// //             const maxY =
// //               container.clientHeight - box.offsetHeight - box.offsetTop;

// //             newX = Math.min(Math.max(newX, minX), maxX);
// //             newY = Math.min(Math.max(newY, minY), maxY);

// //             gsap.to(box, {
// //               x: newX,
// //               y: newY,
// //               duration: 0.3,
// //               ease: "power2.out",
// //             });
// //           }
// //         }
// //       });
// //     }
// //   }, []);

// //   return (
// //     <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
// //       <div
// //         ref={(el) => (boxesRef.current[0] = el)}
// //         className={`absolute cursor-grab ${className}`}
// //       >
// //         {children}
// //       </div>
// //     </div>
// //   );
// // };

// // export default DragBox;import { useEffect, useRef } from "react";



// import gsap from "gsap";
// import { Draggable } from "gsap/Draggable";
// import { useEffect, useRef } from "react";

// gsap.registerPlugin(Draggable);

// let allBoxes = [];

// const DragBox = ({ className, children, boundsRef }) => {
//   const boxRef = useRef(null);

//   useEffect(() => {
//     if (boxRef.current && boundsRef?.current) {
//       allBoxes.push(boxRef.current);

//       Draggable.create(boxRef.current, {
//         type: "x,y",
//         bounds: boundsRef.current,
//         inertia: true,
//         onDragStart() {
//           // Stop any ongoing animations on this box
//           gsap.killTweensOf(this.target);

//           // Scale down when dragging starts
//           gsap.to(this.target, {
//             scale: 0.9,
//             duration: 0.2,
//             ease: "power2.out",
//           });
//         },
//         onDrag() {
//           // Real-time collision check
//           checkAndResolveCollisions(this.target);
//         },
//         onDragEnd() {
//           // Scale back to normal when drag ends
//           gsap.to(this.target, {
//             scale: 1,
//             duration: 0.3,
//             ease: "back.out(1.4)",
//           });
//         },
//         onThrowUpdate() {
//           checkAndResolveCollisions(this.target);
//         },
//       });
//     }

//     return () => {
//       allBoxes = allBoxes.filter((b) => b !== boxRef.current);
//     };
//   }, [boundsRef]);

//   return (
//     <div ref={boxRef} className={`cursor-grab inline-block ${className}`}>
//       {children}
//     </div>
//   );
// };

// export default DragBox;

// // 🎯 Main collision detection and resolution
// function checkAndResolveCollisions(activeBox) {
//   const activeRect = activeBox.getBoundingClientRect();

//   allBoxes.forEach((box) => {
//     if (box === activeBox) return;

//     const boxRect = box.getBoundingClientRect();

//     if (isOverlapping(activeRect, boxRect)) {
//       resolveCollision(activeBox, box, activeRect, boxRect);
//     }
//   });
// }

// // Aggresive overlap detection
// function isOverlapping(rect1, rect2) {
//   const gap = 2; // Small gap to prevent touching
//   return !(
//     rect1.right <= rect2.left + gap ||
//     rect1.left >= rect2.right - gap ||
//     rect1.bottom <= rect2.top + gap ||
//     rect1.top >= rect2.bottom - gap
//   );
// }

// // ⚡ Resolve collision between two boxes
// function resolveCollision(activeBox, otherBox, activeRect, otherRect) {
//   // Calculate center points
//   const activeCenterX = activeRect.left + activeRect.width / 2;
//   const activeCenterY = activeRect.top + activeRect.height / 2;
//   const otherCenterX = otherRect.left + otherRect.width / 2;
//   const otherCenterY = otherRect.top + otherRect.height / 2;

//   // Calculate direction vector
//   const dx = otherCenterX - activeCenterX;
//   const dy = otherCenterY - activeCenterY;
//   const distance = Math.sqrt(dx * dx + dy * dy);

//   if (distance === 0) {
//     // If centers are same, push in random direction
//     const angle = Math.random() * Math.PI * 2;
//     let pushX = Math.cos(angle) * 60;
//     let pushY = Math.sin(angle) * 60;

//     // Check bounds before pushing
//     const safePush = calculateSafePush(otherBox, pushX, pushY);

//     gsap.to(otherBox, {
//       x: `+=${safePush.x}`,
//       y: `+=${safePush.y}`,
//       duration: 0.8,
//       ease: "power2.out",
//       onComplete: () => {
//         setTimeout(() => checkChainReaction(otherBox), 100);
//       },
//     });
//     return;
//   }

//   // Normalize direction
//   const normalX = dx / distance;
//   const normalY = dy / distance;

//   // Calculate minimum separation needed
//   const minSeparation = (activeRect.width + otherRect.width) / 2 + 15;
//   const currentSeparation = distance;
//   const separationNeeded = minSeparation - currentSeparation;

//   if (separationNeeded > 0) {
//     // Calculate forcefully push
//     let pushX = normalX * (separationNeeded + 20);
//     let pushY = normalY * (separationNeeded + 20);

//     // Check bounds before pushing
//     const safePush = calculateSafePush(otherBox, pushX, pushY);

//     gsap.to(otherBox, {
//       x: `+=${safePush.x}`,
//       y: `+=${safePush.y}`,
//       duration: 0.6,
//       ease: "power2.out",
//       onComplete: () => {
//         setTimeout(() => checkChainReaction(otherBox), 100);
//       },
//     });
//   }
// }

// // Calculate safe push that stays within bounds
// function calculateSafePush(box, pushX, pushY) {
//   // Find the parent container that has bounds
//   const parentContainer = findParentContainer(box);
//   if (!parentContainer) return { x: pushX, y: pushY };

//   const containerRect = parentContainer.getBoundingClientRect();
//   const boxRect = box.getBoundingClientRect();

//   // Calculate box position relative to container after push
//   const newBoxLeft = boxRect.left - containerRect.left + pushX;
//   const newBoxTop = boxRect.top - containerRect.top + pushY;
//   const newBoxRight = newBoxLeft + boxRect.width;
//   const newBoxBottom = newBoxTop + boxRect.height;

//   // Constrain within container bounds with padding
//   const padding = 10;
//   let safeX = pushX;
//   let safeY = pushY;

//   // Check horizontal bounds
//   if (newBoxLeft < padding) {
//     safeX = pushX - (newBoxLeft - padding);
//   } else if (newBoxRight > containerRect.width - padding) {
//     safeX = pushX - (newBoxRight - (containerRect.width - padding));
//   }

//   // Check vertical bounds
//   if (newBoxTop < padding) {
//     safeY = pushY - (newBoxTop - padding);
//   } else if (newBoxBottom > containerRect.height - padding) {
//     safeY = pushY - (newBoxBottom - (containerRect.height - padding));
//   }

//   // If push would be too small, try alternative direction
//   if (Math.abs(safeX) < 5 && Math.abs(safeY) < 5) {
//     // Try pushing in perpendicular direction
//     if (Math.abs(pushX) > Math.abs(pushY)) {
//       safeY = pushY > 0 ? Math.max(20, safeY) : Math.min(-20, safeY);
//     } else {
//       safeX = pushX > 0 ? Math.max(20, safeX) : Math.min(-20, safeX);
//     }
//   }

//   return { x: safeX, y: safeY };
// }

// // 🔍 Find the parent container with bounds
// function findParentContainer(element) {
//   let parent = element.parentElement;
//   while (parent) {
//     const style = getComputedStyle(parent);
//     if (style.position === "relative" || parent.hasAttribute("data-bounds")) {
//       return parent;
//     }
//     // Check if this looks like our main container
//     if (parent.className && parent.className.includes("border-2")) {
//       return parent;
//     }
//     parent = parent.parentElement;
//   }
//   return null;
// }

// // 🔗 Check for chain reaction collisions
// function checkChainReaction(movedBox) {
//   const movedRect = movedBox.getBoundingClientRect();

//   allBoxes.forEach((box) => {
//     if (box === movedBox) return;

//     const boxRect = box.getBoundingClientRect();

//     if (isOverlapping(movedRect, boxRect)) {
//       // This moved box is now colliding with another box
//       resolveCollision(movedBox, box, movedRect, boxRect);
//     }
//   });
// }
