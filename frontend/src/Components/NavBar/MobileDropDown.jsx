import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { useEffect } from "react"

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.1,
      ease: "easeInOut",
    },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
}

const MobileDropdown = ({ isOpen, setIsOpen, navLinks, UserNav }) => {
  useEffect(() => {
    // Define the scroll handler
    let lastScroll = window.scrollY
    const handleScroll = () => {
      const currentScroll = window.scrollY
      if (currentScroll > lastScroll && isOpen) {
        // Scrolling down
        setIsOpen(false)
      }
      lastScroll = currentScroll
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen, setIsOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={mobileMenuVariants}
          className="absolute md:hidden fixed  backdrop-blur-lg shadow-md right-0 bg-opacity-10 z-50 rounded-bl-xl"
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