import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const BigFireworkAnimation = ({
  delay = 0,
  startPosition,
  endPosition,
  burstPosition,
  color,
  isPaused = false,
}) => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isPaused) return null;

  const screenWidth = dimensions.width;
  const flightDuration = 3.2; // Slow & smooth rocket travel
  const burstDuration = 5.0; // Slow, luxurious sparkling burst

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Smooth, elegant Rocket ascent */}
      <motion.div
        className="absolute w-4 h-4 rounded-full"
        style={{
          left: startPosition.x,
          top: startPosition.y,
          background: `linear-gradient(180deg, ${color.primary} 0%, ${color.secondary} 50%, ${color.tertiary} 100%)`,
          boxShadow: `0 0 28px ${color.primary}, 0 0 16px ${color.secondary}, 0 0 8px #ffffff`,
          transform: "rotate(45deg)",
        }}
        animate={{
          x: [0, endPosition.x - startPosition.x],
          y: [0, endPosition.y - startPosition.y],
          opacity: [0, 1, 1, 0.8, 0],
          scale: [0.8, 1.2, 1, 0.9, 0.4],
        }}
        transition={{
          duration: flightDuration,
          delay: delay,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 8,
          ease: [0.25, 0.1, 0.25, 1], // Smooth cubic bezier
        }}
      />

      {/* Burst particles with slow smooth dispersal */}
      <motion.div
        className="absolute"
        style={{
          left: burstPosition.x,
          top: burstPosition.y,
          transform: "translate(-50%, -50%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.9, 0.4, 0] }}
        transition={{
          duration: burstDuration,
          delay: delay + flightDuration - 0.1,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 8,
          ease: "easeOut",
        }}
      >
        {/* Layer 1: Primary vibrant sparks */}
        {Array.from({ length: 26 }).map((_, i) => {
          const angle = i * (360 / 26) * (Math.PI / 180);
          const distance = screenWidth * (screenWidth < 768 ? 0.26 : 0.38);
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance + 30; // slight gravity pull

          return (
            <motion.div
              key={`main-${i}`}
              className="absolute w-3 h-3 rounded-full"
              style={{
                background: color.primary,
                boxShadow: `0 0 20px ${color.primary}, 0 0 10px #ffffff`,
              }}
              animate={{
                x: [0, x * 0.25, x * 0.65, x],
                y: [0, y * 0.25, y * 0.65, y],
                opacity: [1, 0.95, 0.7, 0.3, 0],
                scale: [0.8, 1.4, 1.1, 0.7, 0],
              }}
              transition={{
                duration: burstDuration,
                delay: delay + flightDuration - 0.1,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 8,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}

        {/* Layer 2: Secondary multi-color sparks */}
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = i * (360 / 32) * (Math.PI / 180);
          const distance = screenWidth * (screenWidth < 768 ? 0.18 : 0.26);
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance + 20;

          return (
            <motion.div
              key={`secondary-${i}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: color.secondary,
                boxShadow: `0 0 16px ${color.secondary}`,
              }}
              animate={{
                x: [0, x * 0.3, x * 0.75, x],
                y: [0, y * 0.3, y * 0.75, y],
                opacity: [1, 0.9, 0.6, 0.2, 0],
                scale: [0.6, 1.2, 0.9, 0.5, 0],
              }}
              transition={{
                duration: burstDuration - 0.5,
                delay: delay + flightDuration + 0.1,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 8,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}

        {/* Layer 3: Tertiary glittering glimmers */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = i * 10 * (Math.PI / 180);
          const distance = screenWidth * (screenWidth < 768 ? 0.22 : 0.32);
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance + 40;

          return (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                background: color.tertiary,
                boxShadow: `0 0 14px ${color.tertiary}, 0 0 6px #ffffff`,
              }}
              animate={{
                x: [0, x * 0.2, x * 0.6, x * 1.1],
                y: [0, y * 0.2, y * 0.6, y * 1.1],
                opacity: [1, 0.9, 0.5, 0.15, 0],
                scale: [0.5, 1, 0.7, 0.3, 0],
              }}
              transition={{
                duration: burstDuration,
                delay: delay + flightDuration + 0.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 8,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          );
        })}

        {/* Center Soft Radiant Flash */}
        <motion.div
          className="absolute w-40 h-40 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color.primary} 0%, ${color.secondary} 40%, transparent 70%)`,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [0, 3.2, 1.5, 0],
            opacity: [0, 0.85, 0.3, 0],
          }}
          transition={{
            duration: 2.8,
            delay: delay + flightDuration - 0.1,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 8,
            ease: "easeOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default function BackgroundFireworks({ isPaused = false }) {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isPaused) return null;

  const screenWidth = dimensions.width;
  const screenHeight = dimensions.height;

  // Ultra-vibrant festival color configurations with smooth staggered delays
  const fireworkConfigs = [
    {
      delay: 0,
      startPosition: { x: -40, y: screenHeight * 0.1 },
      endPosition: { x: screenWidth * 0.25, y: screenHeight * 0.22 },
      burstPosition: { x: screenWidth * 0.25, y: screenHeight * 0.22 },
      color: { primary: "#ef4444", secondary: "#f59e0b", tertiary: "#ffffff" }, // Red & Gold
    },
    {
      delay: 2.2,
      startPosition: { x: screenWidth + 40, y: screenHeight * 0.15 },
      endPosition: { x: screenWidth * 0.75, y: screenHeight * 0.24 },
      burstPosition: { x: screenWidth * 0.75, y: screenHeight * 0.24 },
      color: { primary: "#10b981", secondary: "#06b6d4", tertiary: "#a7f3d0" }, // Emerald & Cyan
    },
    {
      delay: 4.4,
      startPosition: { x: -40, y: screenHeight * 0.65 },
      endPosition: { x: screenWidth * 0.2, y: screenHeight * 0.48 },
      burstPosition: { x: screenWidth * 0.2, y: screenHeight * 0.48 },
      color: { primary: "#d946ef", secondary: "#ec4899", tertiary: "#fbcfe8" }, // Magenta & Pink
    },
    {
      delay: 6.6,
      startPosition: { x: screenWidth + 40, y: screenHeight * 0.65 },
      endPosition: { x: screenWidth * 0.8, y: screenHeight * 0.46 },
      burstPosition: { x: screenWidth * 0.8, y: screenHeight * 0.46 },
      color: { primary: "#f97316", secondary: "#eab308", tertiary: "#ffffff" }, // Flame Orange & Sun Yellow
    },
    {
      delay: 8.8,
      startPosition: { x: screenWidth * 0.5, y: -40 },
      endPosition: { x: screenWidth * 0.5, y: screenHeight * 0.3 },
      burstPosition: { x: screenWidth * 0.5, y: screenHeight * 0.3 },
      color: { primary: "#3b82f6", secondary: "#8b5cf6", tertiary: "#67e8f9" }, // Electric Blue & Violet
    },
  ];

  return (
    <>
      {/* Ambient background colorful aura lights for deep festival glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-red-600/10 blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute top-1/3 right-1/5 w-96 h-96 rounded-full bg-amber-500/10 blur-[140px] pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 rounded-full bg-purple-600/10 blur-[140px] pointer-events-none animate-pulse" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-1/5 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

        {fireworkConfigs.map((config, index) => (
          <BigFireworkAnimation
            key={`bg-${index}`}
            delay={config.delay}
            startPosition={config.startPosition}
            endPosition={config.endPosition}
            burstPosition={config.burstPosition}
            color={config.color}
            isPaused={isPaused}
          />
        ))}
      </div>
    </>
  );
}
