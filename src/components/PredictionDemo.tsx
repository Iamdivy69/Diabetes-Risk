import { motion } from "framer-motion";
import { AlertCircle, Info, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PredictionDemo() {
  const navigate = useNavigate();

  return (
    <section id="prediction" className="section-pad bg-background">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="badge-primary mb-4">Interactive AI Tools</span>
          <h2 className="text-4xl font-bold text-foreground mb-4">Diabetes Risk Assessment & Analysis</h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Choose exactly how you want to evaluate your clinical metrics. Use our detailed questionnaire or upload a medical document directly.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Form Predictor Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl p-8 shadow-card flex flex-col items-center text-center border border-border"
          >
            <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mb-6 text-teal">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Risk Predictor</h3>
            <p className="text-muted-foreground mb-8">
              Enter 8 clinical parameters including Glucose, BMI, and Insulin levels to get an instant AI-powered ML risk assessment.
            </p>
            <button
               onClick={() => navigate('/predictor')}
               className="w-full mt-auto py-4 bg-teal text-white rounded-xl font-bold text-base shadow-btn-teal hover:bg-teal-dark transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
             >
               Start Questionnaire <ArrowRight size={18} />
             </button>
          </motion.div>

          {/* Image Analyzer Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 shadow-card flex flex-col items-center text-center border border-border"
          >
            <div className="w-16 h-16 bg-medical-blue/10 rounded-full flex items-center justify-center mb-6 text-medical-blue">
               <Info size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Image Analyzer</h3>
            <p className="text-muted-foreground mb-8">
               Snap a photo of your glucometer, lab report, or medical document. Our vision AI will automatically extract and analyze the values.
            </p>
            <button
               onClick={() => navigate('/analyzer')}
               className="w-full mt-auto py-4 bg-medical-blue text-white rounded-xl font-bold text-base shadow-btn-primary hover:bg-medical-blue-dark transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99]"
             >
               Upload Document <ArrowRight size={18} />
             </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
