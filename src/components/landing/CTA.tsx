import { motion } from "framer-motion";
import { useAuth } from "@workos-inc/authkit-react";
import { Github } from "lucide-react";

export function CTA() {
  const { signIn } = useAuth();

  return (
    <section className="relative py-24 px-6 bg-violet-600 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white md:text-5xl"
        >
          Ready to Ship Faster?
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-lg text-white/80 max-w-2xl mx-auto"
        >
          Clone the repo. Start building. Ship something real
          with a production-ready stack. No excuses.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            onClick={() => signIn()}
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-violet-600 hover:bg-white/90 transition-colors"
          >
            Get Started
          </button>

          <a
            href="https://github.com/Stoffberg/project-zap"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
