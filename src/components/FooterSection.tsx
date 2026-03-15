import { Activity } from "lucide-react";

const footerLinks = {
  Navigation: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Prediction", href: "#prediction" },
  ],
  Resources: [
    { label: "Technology", href: "#technology" },
    { label: "Advantages", href: "#advantages" },
    { label: "Applications", href: "#applications" },
    { label: "Team", href: "#team" },
  ],
};

export default function FooterSection() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-medical-blue flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-white">DiabetesAI</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-3 leading-snug">
              AI-Based Diabetes<br />Prediction System
            </h3>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Leveraging machine learning to support early diabetes detection and
              empower data-driven healthcare decisions.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">{group}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">
            © 2026 AI Healthcare Project. All rights reserved.
          </p>
          <p className="text-xs text-white/40 text-center sm:text-right">
            For educational and research purposes only. Not a substitute for medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
