import { motion } from "framer-motion";

const techs = [
  {
    name: "Python",
    desc: "Core programming language",
    abbr: "Py",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
  },
  {
    name: "Machine Learning",
    desc: "Predictive modeling",
    abbr: "ML",
    color: "text-medical-blue",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    name: "Pandas",
    desc: "Data manipulation & analysis",
    abbr: "Pd",
    color: "text-teal",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    name: "NumPy",
    desc: "Numerical computing",
    abbr: "Np",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    name: "Scikit-learn",
    desc: "ML library & algorithms",
    abbr: "Sk",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  {
    name: "Jupyter Notebook",
    desc: "Interactive development",
    abbr: "Jn",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
];

export default function TechStack() {
  return (
    <section id="technology" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="badge-primary mb-4">Stack</span>
          <h2 className="text-4xl font-bold text-foreground mb-4">Technologies Used</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Built on proven scientific computing and machine learning libraries.
          </p>
        </motion.div>

        {/* Tech cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {techs.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`clinical-card flex flex-col items-center text-center p-5 cursor-default border ${tech.border} hover:shadow-card-hover`}
            >
              <div className={`w-12 h-12 ${tech.bg} border ${tech.border} rounded-xl flex items-center justify-center mb-3`}>
                <span className={`text-base font-bold ${tech.color} font-mono`}>{tech.abbr}</span>
              </div>
              <h3 className="font-bold text-foreground text-sm mb-1">{tech.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{tech.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
