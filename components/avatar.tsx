"use client";
import { publicPath } from "@/lib/hosting";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
export function Avatar({
  small = false,
  thinking = false,
}: {
  small?: boolean;
  thinking?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={small ? "avatar-small" : "avatar-wrap"}
      animate={
        reduced
          ? {}
          : {
              y: small ? (thinking ? [0, -4, 0] : 0) : [0, -7, 0],
              rotate: thinking ? [0, -4, 4, 0] : 0,
            }
      }
      transition={{
        duration: thinking ? 1.5 : 5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Image
        src={publicPath("/avatar-kunal-passport.png")}
        alt="Head-and-shoulders avatar of Kunal Deshmukh"
        width={small ? 64 : 330}
        height={small ? 64 : 330}
        priority={!small}
        className="avatar-image"
        sizes={small ? "64px" : "(max-width: 640px) 250px, 300px"}
      />
    </motion.div>
  );
}
