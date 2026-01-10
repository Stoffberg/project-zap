import { motion } from "framer-motion";

// Official brand logos as SVG components
function TanStackLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 633 633" className={className} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="tanstack-b" x1="50%" x2="50%" y1="0%" y2="71.65%">
          <stop offset="0%" stopColor="#6BDAFF"/>
          <stop offset="31.922%" stopColor="#F9FFB5"/>
          <stop offset="70.627%" stopColor="#FFA770"/>
          <stop offset="100%" stopColor="#FF7373"/>
        </linearGradient>
        <linearGradient id="tanstack-m" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#FFDF00"/>
          <stop offset="100%" stopColor="#FF9D00"/>
        </linearGradient>
        <circle id="tanstack-a" cx="308.5" cy="308.5" r="308.5"/>
      </defs>
      <g fill="none" fillRule="evenodd" transform="translate(9 8)">
        <use xlinkHref="#tanstack-a" fill="url(#tanstack-b)"/>
        <g transform="translate(389 -32)">
          <circle cx="168.5" cy="113.5" r="113.5" fill="url(#tanstack-m)"/>
          <circle cx="168.5" cy="113.5" r="106" stroke="#FFC900" strokeOpacity=".529" strokeWidth="15"/>
        </g>
        <circle cx="307.5" cy="308.5" r="304" stroke="#000" strokeWidth="25"/>
      </g>
    </svg>
  );
}

function ConvexLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="28 28 128 132" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
      <path fill="#F3B01C" d="M108.092 130.021c18.166-2.018 35.293-11.698 44.723-27.854-4.466 39.961-48.162 65.218-83.83 49.711-3.286-1.425-6.115-3.796-8.056-6.844-8.016-12.586-10.65-28.601-6.865-43.135 10.817 18.668 32.81 30.111 54.028 28.122Z"/>
      <path fill="#8D2676" d="M53.401 90.174c-7.364 17.017-7.682 36.94 1.345 53.336-31.77-23.902-31.423-75.052-.388-98.715 2.87-2.187 6.282-3.485 9.86-3.683 14.713-.776 29.662 4.91 40.146 15.507-21.3.212-42.046 13.857-50.963 33.555Z"/>
      <path fill="#EE342F" d="M114.637 61.855C103.89 46.87 87.069 36.668 68.639 36.358c35.625-16.17 79.446 10.047 84.217 48.807.444 3.598-.139 7.267-1.734 10.512-6.656 13.518-18.998 24.002-33.42 27.882 10.567-19.599 9.263-43.544-3.065-61.704Z"/>
    </svg>
  );
}

function WorkOSLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 55.4 48" className={className} xmlns="http://www.w3.org/2000/svg">
      <path fill="#6363F1" d="M0,24c0,1.1,0.3,2.1,0.8,3l9.7,16.8c1,1.7,2.5,3.1,4.4,3.7c3.6,1.2,7.5-0.3,9.4-3.5l2.3-4.1l-9.2-16l9.8-16.9L29.5,3c0.7-1.2,1.6-2.2,2.7-3H17.2c-2.6,0-5.1,1.4-6.4,3.7L0.8,21C0.3,21.9,0,22.9,0,24z"/>
      <path fill="#6363F1" d="M55.4,24c0-1.1-0.3-2.1-0.8-3l-9.8-17c-1.9-3.3-5.8-4.7-9.4-3.5c-1.9,0.6-3.4,2-4.4,3.7L28.7,8L38,24l-9.8,16.9L25.9,45c-0.7,1.2-1.6,2.2-2.7,3h15.1c2.6,0,5.1-1.4,6.4-3.7l10-17.3C55.1,26.1,55.4,25.1,55.4,24z"/>
    </svg>
  );
}

function ShadcnLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
      <path fill="none" d="M0 0h256v256H0z"/>
      <path fill="none" stroke="currentColor" strokeWidth="25" strokeLinecap="round" d="M208 128l-80 80M192 40L40 192"/>
    </svg>
  );
}

function TailwindLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 54 33" className={className} xmlns="http://www.w3.org/2000/svg" fill="none">
      <g clipPath="url(#tailwindcss-a)">
        <path fill="#38bdf8" fillRule="evenodd" clipRule="evenodd" d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"/>
      </g>
      <defs>
        <clipPath id="tailwindcss-a">
          <path fill="#fff" d="M0 0h54v32.4H0z"/>
        </clipPath>
      </defs>
    </svg>
  );
}

const technologies = [
  {
    name: "TanStack Start",
    url: "https://tanstack.com/start",
    icon: TanStackLogo,
    description: "Full-stack React framework",
  },
  {
    name: "Convex",
    url: "https://convex.dev",
    icon: ConvexLogo,
    description: "Real-time database",
  },
  {
    name: "WorkOS",
    url: "https://workos.com/authkit",
    icon: WorkOSLogo,
    description: "Enterprise authentication",
  },
  {
    name: "shadcn/ui",
    url: "https://ui.shadcn.com",
    icon: ShadcnLogo,
    description: "Beautiful components",
  },
  {
    name: "Tailwind CSS",
    url: "https://tailwindcss.com",
    icon: TailwindLogo,
    description: "Utility-first CSS",
  },
];

export function TechStack() {
  return (
    <section id="stack" className="relative border-y border-border bg-muted/50 py-16 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center text-sm font-semibold tracking-widest text-muted-foreground uppercase"
        >
          Built with the best tools
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6">
          {technologies.map((tech, index) => (
            <motion.a
              key={tech.name}
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex items-center gap-3 rounded-md border border-border bg-card px-4 py-2.5 transition-colors hover:bg-accent"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-foreground">
                <tech.icon className="h-5 w-5" />
              </div>
              <div>
                <span className="font-medium text-card-foreground text-sm">
                  {tech.name}
                </span>
                <p className="text-xs text-muted-foreground">{tech.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
