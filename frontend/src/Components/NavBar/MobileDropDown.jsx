import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
}

const MobileDropdown = ({ isOpen, setIsOpen, navLinks, UserNav }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={mobileMenuVariants}
          className="md:hidden fixed w-full backdrop-blur-lg shadow-md bg-transparent z-40 top-[88px]"
        >
          <div className="flex flex-col space-y-4 p-6">
            {navLinks.map((link) => (
              <motion.div
                key={link.to}
                whileHover={{ scale: 1.05 }}
                className="w-full"
              >
                <Link
                  to={link.to}
                  className="text-xl font-bold text-green-700 block w-full"
                  onClick={() => setIsOpen(false)}
                >
                  {link.text}
                </Link>
              </motion.div>
            ))}
            <motion.div whileHover={{ scale: 1.05 }}>
              <UserNav />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileDropdown