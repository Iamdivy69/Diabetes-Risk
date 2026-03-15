import { motion } from "framer-motion";
import { Clock, Smile, DollarSign, Eye, Zap, HeartPulse } from "lucide-react";

const advantages = [
  {
    icon: Eye,
    title: "Early Diabetes Detection",
    desc: "Identifies risk factors before clinical symptoms fully manifest, enabling timely intervention.",
    color: "text-medical-blue",
    bg: "bg-blue-50",
  },
  {
    icon: Zap,
    title: "Fast Prediction",
    desc: "Results delivered in under one second — no waiting, no complex procedures required.",
    color: "text-teal",
    bg: "bg-teal-50",
  },
  {
    icon: Smile,
    title: "Easy to Use",
    desc: "Simple, intuitive interface designed for patients and healthcare providers alike.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: DollarSign,
    title: "Cost Effective",
    desc: "Reduces the need for expensive initial screening tests by providing immediate preliminary assessment.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: HeartPulse,
    title: "Improves Health Awareness",
    desc: "Encourages users to actively monitor their health metrics and understand risk factors.",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    desc: "Accessible anytime, anywhere — from a clinic terminal to a personal mobile device.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

export default function Advantages() {
  return (
    <section id="advantages" className="section-pad bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="badge-primary mb-4">Benefits</span>
          <h2 className="text-4xl font-bold text-foreground mb-4">Why This System?</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Designed with patients and providers in mind — reliable, fast, and accessible.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((adv, i) => {
            const Icon = adv.icon;
            return (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                className="clinical-card group cursor-default"
              >
                <div className={`w-11 h-11 ${adv.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${adv.color}`} />
                </div>
                <h3 className="font-bold text-foreground mb-2">{adv.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{adv.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
