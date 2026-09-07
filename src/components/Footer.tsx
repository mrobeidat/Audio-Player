import { Github, Globe, Linkedin } from "lucide-react";

const LINKS = [
  { href: "https://github.com/mrobeidat", label: "GitHub", Icon: Github },
  { href: "https://www.linkedin.com/in/mrobeidat/", label: "LinkedIn", Icon: Linkedin },
  { href: "https://yousef-portfolio.vercel.app", label: "Portfolio", Icon: Globe },
];

export function Footer() {
  return (
    <footer className="glass fixed inset-x-0 bottom-0 z-30 py-3 text-center">
      <a href="https://yousef-portfolio.vercel.app" target="_blank" rel="noreferrer" className="text-xs uppercase tracking-[0.15em] text-white/90 hover:text-white md:text-sm">
        {new Date().getFullYear()} © Made with ❤️ by Yousef Obeidat
      </a>
      <div className="mt-2 flex justify-center gap-4">
        {LINKS.map(({ href, label, Icon }) => (
          <a key={href} href={href} target="_blank" rel="noreferrer" aria-label={label} className="transition hover:scale-110">
            <Icon className="size-5" />
          </a>
        ))}
      </div>
    </footer>
  );
}
