import { motion } from "framer-motion";
import { ClipboardList, Cpu, BarChart2, CheckCircle2 } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: ClipboardList,
    title: "Enter Health Symptoms",
    desc: "Input clinical metrics such as glucose level, blood pressure, BMI, insulin level, and age into the structured assessment form.",
    color: "text-medical-blue",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    step: "02",
    icon: Cpu,
    title: "Model Analyzes Data",
    desc: "The trained machine learning model (Random Forest / SVM) processes the input features against patterns learned from thousands of clinical records.",
    color: "text-teal",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    step: "03",
    icon: BarChart2,
    title: "Risk Score Computed",
    desc: "The algorithm computes a probability score, weighing each biomarker's contribution to the overall diabetes risk profile.",
    color: "text-medical-blue",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Instant Result",
    desc: "A clear, easy-to-understand result is displayed — Low Risk or High Risk — with a recommendation to consult a healthcare professional.",
    color: "text-teal",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="badge-primary mb-4">Process</span>
          <h2 className="text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Four simple steps from symptom input to actionable health insight.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-px bg-border z-0" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon circle */}
                  <div className={`w-16 h-16 rounded-2xl ${s.bg} border ${s.border} flex items-center justify-center mb-5 shadow-sm`}>
                    <Icon className={`w-7 h-7 ${s.color}`} />
                  </div>

                  {/* Step label */}
                  <span className="text-xs font-bold tracking-widest text-muted-foreground mb-2">
                    STEP {s.step}
                  </span>

                  <h3 className="font-bold text-foreground mb-2 text-base">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
