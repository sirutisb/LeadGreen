"use client"
import { motion } from "framer-motion"
import TrueFocus from "./Effects/TrueFocus"


export default function Section(){
    return(
      <div className="flex-1 flex flex-col items-center py-6 md:py-8" >
        <div className="w-full">
          <motion.p
            className="font-sans uppercase tracking-[0.3em] md:tracking-[0.51em] leading-[133%] text-center md:text-[24px] text-green-700 "
            style={{
              paddingTop: "12px",
              marginBottom: "48px",
              "@media (min-width: 768px)": {
                paddingTop: "20px",
                marginBottom: "32px",
              },
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, delay: 0.1 }}
          >
            <TrueFocus 
          sentence="Lead Green"
          manualMode={false}
          blurAmount={5}
          borderColor="green"
          animationDuration={0.5}
          pauseBetweenAnimations={1.5}
          />
          </motion.p>
        </div>

        <motion.h1
          className="text-[32px] md:text-[64px] leading-tight md:leading-[83px] text-center px-4 md:px-16 lg:px-[314px] text-black"
          style={{ marginTop: "0px", marginBottom: "0px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="">
            <span className="font-serif font-normal">Share </span>
            <span className="font-serif font-normal italic">sustainable </span>
            <span className="font-serif font-normal">living</span>
          </div>
          <div className="font-serif font-normal">encouraging eco-friendly lifestyle</div>
        </motion.h1>

        <motion.p className="text-2xl md:text-[32px] text-center text-green-600 font-sans font-light px-4 lg:px-[314px] mt-[48px] mmd:mb-[48px] leading-[133%]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        >
          
          LeadGreen turns your eco-friendly actions into a fun, rewarding game.
          <br className="hidden md:inline" />
          Scan, post, and grow your virtual plant while saving the planet!
        </motion.p>
      </div>
    )
}
