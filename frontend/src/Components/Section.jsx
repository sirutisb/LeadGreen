"use client"
import { motion } from "framer-motion"

export default function Section(){
    return(
      <div className="flex-1 flex flex-col items-center bg-[#f3f1ea]">

        <div className="w-full">
          <motion.p
            className="font-sans uppercase tracking-[0.51em] leading-[133%] text-center text-[24px] text-green-700"
            style={{
              paddingTop: "20px",
              marginBottom: "32px",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            INTRODUCING LEADGREEN
          </motion.p>
        </div>

        <motion.h1
          className="text-[64px] leading-[83px] text-center px-4 lg:px-[314px] text-black"
          style={{ marginTop: "0px", marginBottom: "0px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="whitespace-nowrap">
            <span className="font-serif font-normal">Share </span>
            <span className="font-serif font-normal italic">sustainable </span>
            <span className="font-serif font-normal">living</span>
          </div>
          <div className="font-serif font-normal">encouraging eco-friendly lifestyle</div>
        </motion.h1>

        <motion.p className="text-[28px] text-center text-green-700 font-sans font-light px-4 lg:px-[314px] mt-[25px] mb-[48px] leading-[133%]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        >
          
          Lead Green analyzes your habits & surfaces insights
          <br className="hidden md:inline" />
          you'd normally spend hours uncovering.
        </motion.p>
      </div>
    )
}
