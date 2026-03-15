import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, Lightbulb, Target, TrendingUp } from "lucide-react";

const cards = [
  {
    icon: AlertTriangle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    label: "The Problem",
    title: "Late Diagnosis Crisis",
    desc: "Many people ignore early diabetes symptoms which leads to late diagnosis and serious, irreversible health complications. Early detection can prevent up to 80% of type-2 diabetes cases.",
  },
  {
    icon: Lightbulb,
    iconBg: "bg-blue-50",
    iconColor: "text-medical-blue",
    label: "Our Solution",
    title: "AI-Powered Prediction",
    desc: "An intelligent system where users enter clinical symptoms and the machine learning model predicts the possibility of diabetes with high accuracy in under a second.",
  },
  {
    icon: Target,
    iconBg: "bg-teal-50",
    iconColor: "text-teal",
    label: "Objective",
    title: "Early Health Awareness",
    desc: "Empower patients and healthcare providers with data-driven insights, enabling proactive health management before symptoms become critical.",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    label: "Impact",
    title: "Scalable Screening Tool",
    desc: "Designed to support hospitals, clinics, and personal health monitoring at scale — bringing clinical-grade prediction to anyone with a device.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="section-pad bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <span className="badge-primary mb-4">About the Project</span>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Transforming Diabetes Screening with Machine Learning
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            A research-backed system built on the PIMA Indian Diabetes Dataset,
            using supervised learning to provide reliable early-stage risk analysis.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={cardVariants}
                className="clinical-card group cursor-default transition-all duration-200"
              >
                <div className={`w-10 h-10 ${card.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2 block">
                  {card.label}
                </span>
                <h3 className="font-bold text-foreground mb-2 text-base">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
