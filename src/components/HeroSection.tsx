import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";

const stats = [
  { value: "94.2%", label: "Model Accuracy" },
  { value: "< 1s", label: "Prediction Time" },
  { value: "768", label: "Training Samples" },
];

const floatingMetrics = [
  { label: "Glucose", value: "118", unit: "mg/dL", color: "bg-blue-50 border-blue-100", dot: "bg-medical-blue" },
  { label: "BMI", value: "26.4", unit: "kg/m²", color: "bg-teal-50/60 border-teal-100", dot: "bg-teal" },
  { label: "Blood Pressure", value: "76", unit: "mm Hg", color: "bg-slate-50 border-slate-100", dot: "bg-slate-400" },
];

const barData = [
  { label: "Glucose", pct: 72, color: "#2C7BE5" },
  { label: "BMI", pct: 55, color: "#00A896" },
  { label: "Insulin", pct: 38, color: "#2C7BE5" },
  { label: "Age", pct: 85, color: "#00A896" },
];

export default function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-white overflow-hidden pt-16">
      {/* Subtle background dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(44,123,229,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent rounded-full opacity-40 blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/4" />

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* LEFT — Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="badge-primary mb-6">
              Machine Learning in Healthcare
            </span>

            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.1]">
              AI-Based Diabetes{" "}
              <span className="text-medical-blue">Prediction</span> System
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Using Machine Learning for Early Diabetes Detection. This system predicts
              possible diabetes based on user symptoms, helping in early health
              awareness and supporting healthcare decision-making.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <a
                href="#prediction"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-medical-blue text-white rounded-lg font-semibold shadow-btn-primary hover:bg-medical-blue-dark hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                Try Prediction
                <ArrowRight size={16} />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-muted-foreground border border-border rounded-lg font-medium hover:bg-muted hover:text-foreground transition-all duration-200"
              >
                Learn More
              </a>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 pt-6 border-t border-border">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-foreground data-value">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* RIGHT — Clinical Data Viz */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          {/* Main card */}
          <div className="bg-white rounded-2xl shadow-card p-6 border border-slate-100/80">
            {/* Card header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm font-semibold text-foreground">Risk Analysis</div>
                <div className="text-xs text-muted-foreground mt-0.5">Patient Assessment Report</div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-700">Live Model</span>
              </div>
            </div>

            {/* Bar chart */}
            <div className="space-y-3.5 mb-6">
              {barData.map((bar, i) => (
                <div key={bar.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-muted-foreground">{bar.label}</span>
                    <span className="text-xs font-semibold text-foreground data-value">{bar.pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: bar.color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Result pill */}
            <div className="flex items-center justify-between p-4 bg-accent rounded-xl">
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">Prediction Result</div>
                <div className="text-lg font-bold text-medical-blue data-value">Low Risk</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-medical-blue/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-medical-blue" />
              </div>
            </div>
          </div>

          {/* Floating metric chips */}
          {floatingMetrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.12 }}
              className={`absolute flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-card border ${m.color} text-xs font-medium`}
              style={{
                top: i === 0 ? "-20px" : i === 1 ? "calc(50% - 20px)" : undefined,
                bottom: i === 2 ? "-20px" : undefined,
                right: i === 1 ? "-28px" : "-16px",
              }}
            >
              <div className={`w-2 h-2 rounded-full ${m.dot}`} />
              <span className="text-muted-foreground">{m.label}</span>
              <span className="font-semibold text-foreground data-value">{m.value}</span>
              <span className="text-muted-foreground">{m.unit}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
