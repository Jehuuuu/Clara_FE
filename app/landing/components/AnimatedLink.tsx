"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface AnimatedLinkProps {
  text: string;
  href: string;
  index: number;
}

const AnimatedLink: React.FC<AnimatedLinkProps> = ({ text, href, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          delay: index * 0.1,
          duration: 0.6,
          ease: "easeOut"
        }
      }}
      className="overflow-hidden"
    >
      <Link href={href}>
        <div 
          className="relative inline-block text-3xl md:text-5xl lg:text-6xl transition-all duration-300 ease-in-out cursor-pointer"
          style={{ 
            fontWeight: isHovered ? 300 : 700,
            transform: isHovered ? 'translateX(20px)' : 'translateX(0)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {text}
          <div 
            className="absolute bottom-0 left-0 h-[1px] bg-black transition-all duration-300"
            style={{
              width: isHovered ? '100%' : '0%',
              opacity: isHovered ? 1 : 0
            }}
          />
        </div>
      </Link>
    </motion.div>
  );
};

export default AnimatedLink;
