"use client";

import React from 'react';
import { motion } from 'framer-motion';
import styles from './styles.module.css';
import AnimatedLink from './components/AnimatedLink';

const LandingPage = () => {
  // Text links with their paths
  const links = [
    { text: "About Clara", path: "/about" },
    { text: "Candidates", path: "/candidates" },
    { text: "Ask Questions", path: "/ask" },
    { text: "Compare Policies", path: "/compare" },
    { text: "My Picks", path: "/my-picks" },
  ];

  return (
    <div className={`min-h-screen flex flex-col bg-[#f5f0e6] ${styles.container}`}>
      {/* Header */}
      <motion.header 
        className="p-6 md:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto">
          <motion.h1 
            className="text-3xl md:text-4xl font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            Clara
          </motion.h1>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-6 md:px-10">
          <div className="max-w-4xl mx-auto">
            <motion.h2 
              className={`${styles.title} font-bold`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              Make informed voting decisions
            </motion.h2>
            
            <div className="space-y-6 md:space-y-8 mt-16">
              {links.map((link, index) => (
                <AnimatedLink 
                  key={index}
                  text={link.text}
                  href={link.path}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer 
        className="p-6 md:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
      >
        <div className="container mx-auto">
          <p className="text-sm opacity-70">© {new Date().getFullYear()} Clara. Your trusted election assistant.</p>
        </div>
      </motion.footer>
    </div>
  );
};

export default LandingPage;
