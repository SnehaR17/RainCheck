"use client";

import { motion } from "framer-motion";
import { ExternalLink, Send } from "lucide-react";

export default function ApplyNowLinks({ links = [] }: { links?: any[] }) {
  if (!links || links.length === 0) {
    return (
      <div className="mt-3 text-gray-400 text-sm">
        (No active application links available right now.)
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-5 flex flex-wrap gap-3"
    >
      {links.map((link, idx) => (
        <motion.a
          key={idx}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 250, damping: 14 }}
          className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl 
                     bg-gradient-to-r from-emerald-500/20 to-amber-400/10 border border-white/10 
                     backdrop-blur-md text-emerald-300 font-medium text-sm tracking-wide
                     hover:from-emerald-400/30 hover:to-amber-300/20 hover:border-emerald-400/40 
                     hover:text-amber-200 transition-all duration-300"
        >
          <span>{link.label || "Apply Now"}</span>
          {link.icon === "send" ? (
            <Send className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-all duration-200" />
          ) : (
            <ExternalLink className="h-4 w-4 opacity-80 group-hover:-translate-y-0.5 transition-all duration-200" />
          )}

          {/* subtle background glow on hover */}
          <motion.span
            layoutId="glow"
            className="absolute inset-0 rounded-xl bg-emerald-400/10 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"
          />
        </motion.a>
      ))}
    </motion.div>
  );
}
