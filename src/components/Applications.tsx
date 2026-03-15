import { motion } from "framer-motion";
import { Building2, Stethoscope, Smartphone } from "lucide-react";

const applications = [
  {
    icon: Building2,
    title: "Hospitals",
    desc: "Integrated into patient intake workflows to flag high-risk individuals for immediate physician review and further clinical testing.",
    tag: "Clinical Setting",
    color: "text-medical-blue",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: Stethoscope,
    title: "Clinics",
    desc: "Assists general practitioners in conducting faster initial screenings during routine check-ups, reducing appointment time.",
    tag: "Primary Care",
    color: "text-teal",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    icon: Smartphone,
    title: "Personal Health Monitoring",
    desc: "Empowers individuals to proactively monitor their risk from home, promoting lifestyle changes before clinical intervention is needed.",
    tag: "Consumer",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
];

export default function Applications() {
  return (
    <section id="applications" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="badge-primary mb-4">Use Cases</span>
          <h2 className="text-4xl font-bold text-foreground mb-4">Applications</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Adaptable to multiple healthcare environments from institutional to personal use.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {applications.map((app, i) => {
            const Icon = app.icon;
            return (
              <motion.div
                key={app.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`clinical-card border ${app.border} cursor-default`}
              >
                <div className={`w-14 h-14 ${app.bg} rounded-2xl flex items-center justify-center mb-5`}>
                  <Icon className={`w-7 h-7 ${app.color}`} />
                </div>
                <span className={`text-xs font-semibold uppercase tracking-widest ${app.color} mb-2 block`}>
                  {app.tag}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-3">{app.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{app.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
