"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Menu, X } from "lucide-react"

const Navbar1 = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const links = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full py-3 px-4">
      <div className="flex items-center justify-between px-5 py-2 bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-full shadow-lg shadow-black/20 w-full max-w-2xl relative">

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {links.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <a
                href={item.href}
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            </motion.div>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <a
            href="https://github.com/sahiljadhav7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-1.5 text-xs font-semibold text-blue-400 border border-blue-400/40 rounded-full hover:bg-blue-400/10 transition-colors"
          >
            GitHub
          </a>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle menu"
        >
          <Menu className="h-4 w-4 text-zinc-400" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-zinc-950/98 backdrop-blur-xl z-50 pt-20 px-6 md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <motion.button
              className="absolute top-5 right-5 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-zinc-400" />
            </motion.button>
            <div className="flex flex-col space-y-5">
              {links.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.1 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <a
                    href={item.href}
                    className="text-base text-zinc-300 hover:text-white font-medium transition-colors"
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </a>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="pt-4"
              >
                <a
                  href="https://github.com/sahiljadhav7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-5 py-2.5 text-sm font-semibold text-blue-400 border border-blue-400/40 rounded-full hover:bg-blue-400/10 transition-colors"
                  onClick={toggleMenu}
                >
                  GitHub
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Navbar1 }
