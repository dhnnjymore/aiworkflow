"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ArrowRight, Workflow, Sparkles, BookOpen, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

const INTRO_SEEN_KEY = "flowcraft-intro-seen";

export function IntroModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(INTRO_SEEN_KEY)) {
      setOpen(true);
    }
  }, []);

  const handleContinue = () => {
    localStorage.setItem(INTRO_SEEN_KEY, "true");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="w-full max-w-3xl mx-4 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left - Content */}
              <div className="p-8 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-2 mb-5"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg font-bold tracking-tight">FlowCraft</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold leading-tight mb-3"
                >
                  Build AI workflows
                  <br />
                  <span className="text-primary">visually.</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-sm text-muted-foreground mb-6 leading-relaxed"
                >
                  Chain LLM prompts, extract knowledge from documents, generate images — all by connecting nodes on a canvas. No code required.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2.5 mb-8"
                >
                  {[
                    { icon: BookOpen, text: "Extract knowledge from PDFs & text" },
                    { icon: Sparkles, text: "Multi-provider LLM support" },
                    { icon: Workflow, text: "Visual node-based workflow builder" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button onClick={handleContinue} className="gap-2 w-full">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>

              {/* Right - Visual */}
              <div className="hidden md:flex items-center justify-center bg-muted/20 border-l border-border p-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="space-y-3 w-full"
                >
                  {[
                    { label: "Input", color: "border-blue-500/40 bg-blue-500/5", dot: "bg-blue-400" },
                    { label: "Knowledge", color: "border-violet-500/40 bg-violet-500/5", dot: "bg-violet-400" },
                    { label: "AI Prompt", color: "border-amber-500/40 bg-amber-500/5", dot: "bg-amber-400" },
                    { label: "Output", color: "border-emerald-500/40 bg-emerald-500/5", dot: "bg-emerald-400" },
                  ].map((node, i) => (
                    <motion.div
                      key={node.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.08 }}
                    >
                      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${node.color}`}>
                        <div className={`w-2 h-2 rounded-full ${node.dot}`} />
                        <span className="text-xs font-medium text-foreground/80">{node.label}</span>
                        {i < 3 && (
                          <ArrowRight className="h-3 w-3 text-muted-foreground/40 ml-auto" />
                        )}
                        {i === 3 && (
                          <Monitor className="h-3 w-3 text-emerald-400/60 ml-auto" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
