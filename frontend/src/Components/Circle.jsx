"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import clsx from "clsx"

const COLOR_VARIANTS = {
  primary: {
    border: ["border-green-500/60", "border-emerald-400/50", "border-slate-600/30"],
    gradient: "from-green-500/30",
  },
  secondary: {
    border: ["border-emerald-500/60", "border-teal-400/50", "border-slate-600/30"],
    gradient: "from-emerald-500/30",
  },
  tertiary: {
    border: ["border-teal-500/60", "border-cyan-400/50", "border-slate-600/30"],
    gradient: "from-teal-500/30",
  },
}

const GreenCircles = ({
  title = "Green Circles",
  description = "A verdant, lush background",
  className,
  initialVariant = "primary",
  showVariantToggle = false,
}) => {
  const [currentVariant, setCurrentVariant] = useState(initialVariant)
  const variantStyles = COLOR_VARIANTS[currentVariant]

  const variants = Object.keys(COLOR_VARIANTS)

  function getNextVariant() {
    const currentIndex = variants.indexOf(currentVariant)
    const nextVariant = variants[(currentIndex + 1) % variants.length]
    return nextVariant
  }

  return (
    <div
      className={clsx(
        "relative flex h-screen w-full items-center justify-center overflow-hidden",
        "bg-[#f3f1ea] dark:bg-black/5 mt-40",
        className,
      )}
    >
      <motion.div className="absolute h-[720px] w-[720px]">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={clsx(
              "absolute inset-0 rounded-full",
              "border-2 bg-gradient-to-br to-transparent",
              variantStyles.border[i],
              variantStyles.gradient,
            )}
            animate={{
              rotate: 360,
              scale: [1, 1.05 + i * 0.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <div
              className={clsx(
                "absolute inset-0 rounded-full mix-blend-screen",
                `bg-[radial-gradient(ellipse_at_center,${variantStyles.gradient.replace(
                  "from-",
                  "",
                )}/10%,transparent_70%)]`,
              )}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="relative z-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1
          className={clsx(
            "text-xl font-bold tracking-tight md:text-4xl",
            "bg-gradient-to-b from-green-800 to-green-500 dark:from-green-300 dark:to-green-500 bg-clip-text text-transparent",
            "drop-shadow-[0_0_32px_rgba(34,197,94,0.4)]",
          )} 
        >
        Help Us Create a Carbon Neutral Environment
        </h1>

        <motion.p
          className="mt-6 text-xl font-semibold md:text-xl dark:text-white text-green-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="mx-3 opacity-90">Join LeadGreen and be part of the solution.</span>
        </motion.p>
        <span className="py-4 mx-3 text-xl font-semibold md:text-xl dark:text-white text-green-950 opacity-90">
          Every small action counts towards a greener future.
        </span>
      </motion.div>

      <div className="absolute inset-0 [mask-image:radial-gradient(90%_60%_at_50%_50%,#000_40%,transparent)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#15803d/30%,transparent_70%)] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#22c55e/15%,transparent)] blur-[80px]" />
      </div>

      {showVariantToggle && (
        <div className="absolute top-12 right-12">
          <button
            type="button"
            className="bg-green-700 dark:bg-green-300 text-white dark:text-green-950 px-4 py-1 rounded-md z-10 text-sm font-medium"
            onClick={() => {
              setCurrentVariant(getNextVariant())
            }}
          >
            Click me cuh
          </button>
        </div>
      )}
    </div>
  )
}

export default GreenCircles

