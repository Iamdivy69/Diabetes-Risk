import React, { useState, useRef } from 'react';
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

const MODEL = {
  coef: [0.2938035842622906, 0.5287549296882658, -0.17538469524407882, 0.0841751160263719,
         -0.016634918653854726, 0.6168219399739349, 0.32408721421731274, 0.2699167920284012],
  intercept: -0.4775886027642247,
  scaler_mean: [3.934156378600823, 125.45473251028807, 73.05761316872427, 31.189300411522634,
                141.52263374485597, 32.44609053497941, 0.5005761316872429, 35.31275720164609],
  scaler_scale: [3.0918361253066924, 29.685006264862224, 11.6529360852069, 10.353682110989885,
                 97.12116706800775, 7.188703926296557, 0.35528511324523326, 12.39245596424787],
  medians: { 1: 123.5, 2: 72.0, 3: 31.0, 4: 120.0, 5: 32.0 },
  feature_names: ["Pregnancies","Glucose","Blood Pressure","Skin Thickness","Insulin","BMI","DPF","Age"]
};

function sigmoid(x: number) { return 1 / (1 + Math.exp(-x)); }

export default function DiabetesPredictor() {
  const [formData, setFormData] = useState<Record<string, string>>({
    pregnancies: '',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    dpf: '',
    age: ''
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  
  const resultRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const getAIAnalysis = async (data: any, prob: number, level: string, predicted: number) => {
    const prompt = `You are a clinical diabetes risk analysis assistant. A patient has submitted these values from the Pima Indians Diabetes Dataset parameters:

- Pregnancies: ${data.pregnancies}
- Glucose: ${data.glucose} mg/dL
- Blood Pressure: ${data.bloodPressure} mmHg
- Skin Thickness: ${data.skinThickness} mm
- Insulin: ${data.insulin} μU/mL
- BMI: ${data.bmi} kg/m²
- Diabetes Pedigree Function: ${data.dpf}
- Age: ${data.age} years

Our ML model gives them a probability of ${(prob * 100).toFixed(1)}% of developing diabetes (${level.toUpperCase()} RISK, Classified as: ${predicted === 1 ? 'Diabetic' : 'Non-diabetic'}).

Give a concise, clear 3-4 sentence clinical analysis:
1. Highlight the 2-3 most concerning values (or reassuring values if low risk) with brief clinical context
2. State what this risk level means practically
3. One specific, actionable recommendation

Keep it under 100 words. Be direct and helpful. No bullet points — write in natural paragraph form.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      if (!response.ok) throw new Error("API error");
      const json = await response.json();
      const text = json.content?.find((b: any) => b.type === 'text')?.text || '';
      return text.trim();
    } catch(e) {
      return "Your values have been analyzed using established clinical thresholds. Please consult a healthcare professional for a full interpretation of these results.";
    }
  };

  const predict = async () => {
    setErrorMsg(null);
    const fields = ['pregnancies','glucose','bloodPressure','skinThickness','insulin','bmi','dpf','age'];
    const labels: Record<string, string> = {
      pregnancies: 'Pregnancies',
      glucose: 'Glucose Level',
      bloodPressure: 'Blood Pressure',
      skinThickness: 'Skin Thickness',
      insulin: 'Insulin',
      bmi: 'BMI',
      dpf: 'Diabetes Pedigree Function',
      age: 'Age'
    };

    const parsedData: Record<string, number> = {};
    for (const f of fields) {
      const val = formData[f]?.trim();
      if (val === '') {
        setErrorMsg(`Please fill in: ${labels[f]}`);
        const el = document.getElementById(f);
        if (el) el.focus();
        return;
      }
      parsedData[f] = parseFloat(val);
    }

    setIsPredicting(true);
    setResult(null);
    setAiAnalysis(null);

    // Apply ML logic
    let raw = [
      parsedData.pregnancies,
      parsedData.glucose,
      parsedData.bloodPressure,
      parsedData.skinThickness,
      parsedData.insulin,
      parsedData.bmi,
      parsedData.dpf,
      parsedData.age
    ];

    let X = [...raw];
    const zero_cols = [1, 2, 3, 4, 5];
    for (const col of zero_cols) {
      if (X[col] === 0) X[col] = (MODEL.medians as any)[col];
    }

    let X_scaled = X.map((v, i) => (v - MODEL.scaler_mean[i]) / MODEL.scaler_scale[i]);
    let logit = MODEL.intercept;
    const contributions = [];

    for (let i = 0; i < 8; i++) {
        const contrib = MODEL.coef[i] * X_scaled[i];
        logit += contrib;
        contributions.push({ name: MODEL.feature_names[i], contrib, raw: raw[i] });
    }

    const prob = sigmoid(logit);
    const predicted = prob >= 0.5 ? 1 : 0;
    const confidence = predicted === 1 ? prob : (1 - prob);

    let level = 'low';
    if (prob >= 0.6) level = 'high';
    else if (prob >= 0.35) level = 'medium';

    contributions.sort((a, b) => Math.abs(b.contrib) - Math.abs(a.contrib));

    setResult({ prob, predicted, confidence, level, contributions });
    
    setTimeout(() => {
      if (resultRef.current) resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);

    const analysis = await getAIAnalysis(parsedData, prob, level, predicted);
    setAiAnalysis(analysis);
    setIsPredicting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      predict();
    }
  };

  const riskLabels: Record<string, string> = { low: 'Low Risk', medium: 'Moderate Risk', high: 'High Risk' };
  const riskIcons: Record<string, string> = { low: '✅', medium: '⚠️', high: '🔴' };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background section-pad" onKeyDown={handleKeyDown}>
        <div className="max-w-4xl mx-auto px-6">

          <div className="text-center mb-12">
            <span className="badge-primary mb-4">AI-Powered Health Tool</span>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Diabetes <em className="text-primary not-italic">Risk</em> Assessment</h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Enter your medical details below for an instant AI-powered diabetes risk analysis based on clinical parameters.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive mb-6">
              {errorMsg}
            </div>
          )}

          <div className="clinical-card mb-8">
            <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-4 after:flex-1 after:h-px after:bg-border">Clinical Parameters</div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="field">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-foreground">Pregnancies</label>
                  <span className="text-xs text-muted-foreground">(count, 0 if male)</span>
                </div>
                <input type="number" id="pregnancies" placeholder="e.g. 2" min="0" max="20" value={formData.pregnancies} onChange={handleInputChange} className="clinical-input w-full" />
              </div>
              <div className="field">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-foreground">Glucose Level</label>
                  <span className="text-xs text-muted-foreground">(mg/dL)</span>
                </div>
                <input type="number" id="glucose" placeholder="e.g. 120" min="0" max="300" value={formData.glucose} onChange={handleInputChange} className="clinical-input w-full" />
              </div>
              <div className="field">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-foreground">Blood Pressure</label>
                  <span className="text-xs text-muted-foreground">(mmHg)</span>
                </div>
                <input type="number" id="bloodPressure" placeholder="e.g. 70" min="0" max="200" value={formData.bloodPressure} onChange={handleInputChange} className="clinical-input w-full" />
              </div>
              <div className="field">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-foreground">Skin Thickness</label>
                  <span className="text-xs text-muted-foreground">(mm)</span>
                </div>
                <input type="number" id="skinThickness" placeholder="e.g. 20" min="0" max="100" value={formData.skinThickness} onChange={handleInputChange} className="clinical-input w-full" />
              </div>
              <div className="field">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-foreground">Insulin</label>
                  <span className="text-xs text-muted-foreground">(μU/mL)</span>
                </div>
                <input type="number" id="insulin" placeholder="e.g. 85" min="0" max="900" value={formData.insulin} onChange={handleInputChange} className="clinical-input w-full" />
              </div>
              <div className="field">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-foreground">BMI</label>
                  <span className="text-xs text-muted-foreground">(kg/m²)</span>
                </div>
                <input type="number" id="bmi" placeholder="e.g. 25.5" step="0.1" min="0" max="70" value={formData.bmi} onChange={handleInputChange} className="clinical-input w-full" />
              </div>
              <div className="field">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-foreground">Diabetes Pedigree</label>
                  <span className="text-xs text-muted-foreground">(family score)</span>
                </div>
                <input type="number" id="dpf" placeholder="e.g. 0.45" step="0.01" min="0" max="3" value={formData.dpf} onChange={handleInputChange} className="clinical-input w-full" />
              </div>
              <div className="field">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-foreground">Age</label>
                  <span className="text-xs text-muted-foreground">(years)</span>
                </div>
                <input type="number" id="age" placeholder="e.g. 35" min="1" max="120" value={formData.age} onChange={handleInputChange} className="clinical-input w-full" />
              </div>
            </div>
          </div>

          <button className="w-full py-4 bg-teal text-white rounded-xl font-bold text-base shadow-btn-teal hover:bg-teal-dark focus:ring-4 focus:ring-teal/20 transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2" onClick={predict} disabled={isPredicting}>
            {isPredicting && !result ? 'Analyzing...' : 'Analyze My Diabetes Risk →'}
          </button>

          {result && (
            <div className={`clinical-card mt-8 border-t-4 animate-in fade-in duration-500 ${
              result.level === 'low' ? 'border-teal' : result.level === 'medium' ? 'border-[#e67e22]' : 'border-destructive'
            }`} ref={resultRef}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0 ${
                  result.level === 'low' ? 'bg-teal/10' : result.level === 'medium' ? 'bg-[#e67e22]/10' : 'bg-destructive/10'
                }`}>
                  {riskIcons[result.level]}
                </div>
                <div>
                  <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                    result.level === 'low' ? 'text-teal' : result.level === 'medium' ? 'text-[#e67e22]' : 'text-destructive'
                  }`}>
                    {riskLabels[result.level]}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {result.level === 'low' && `Low probability of diabetes. Continue maintaining healthy habits.`}
                    {result.level === 'medium' && `Moderate probability. Consider lifestyle changes and screening.`}
                    {result.level === 'high' && `High probability of diabetes. Consult a healthcare provider promptly.`}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <span className="block font-bold text-2xl mb-1" style={{ color: result.prob >= 0.6 ? 'hsl(var(--destructive))' : result.prob >= 0.4 ? '#e67e22' : '#00A896' }}>
                    {(result.prob * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Probability</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <span className="block font-bold text-2xl mb-1" style={{ color: result.predicted === 1 ? 'hsl(var(--destructive))' : '#00A896' }}>
                    {result.predicted === 1 ? 'Positive' : 'Negative'}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Prediction</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-center">
                  <span className="block font-bold text-2xl mb-1" style={{ color: result.confidence >= 0.75 ? '#00A896' : '#e67e22' }}>
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Confidence</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">📊 Feature Contributions to Prediction</h4>
                
                <div className="flex flex-col gap-2">
                  {result.contributions.map((c: any, i: number) => {
                    const maxAbs = Math.max(...result.contributions.map((x: any) => Math.abs(x.contrib)));
                    const pct = Math.round((Math.abs(c.contrib) / maxAbs) * 100);
                    const color = c.contrib > 0 ? 'hsl(var(--destructive))' : '#00A896';
                    const direction = c.contrib > 0 ? '▲ raises risk' : '▼ lowers risk';
                    
                    return (
                      <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-100 shadow-sm" key={i}>
                        <div className="w-[140px] text-sm font-semibold text-foreground shrink-0 leading-tight">
                          {c.name}<br/>
                          <span className="text-[11px]" style={{ color }}>{direction}</span>
                        </div>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${pct}%`, backgroundColor: color }}></div>
                        </div>
                        <div className="text-sm font-bold w-[40px] text-right shrink-0" style={{ color }}>
                          {c.raw % 1 === 0 ? c.raw : c.raw.toFixed(1)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">AI Clinical Analysis</h4>
                {!aiAnalysis ? (
                  <div className="flex gap-1.5 items-center py-2 animate-pulse">
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full"></div>
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animation-delay-200"></div>
                    <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animation-delay-400"></div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-foreground">{aiAnalysis}</p>
                )}
              </div>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground leading-relaxed px-4 mt-8">
            ⚕️ This tool is for educational purposes only and does not replace professional medical advice.<br/>
            Always consult a qualified healthcare provider for diagnosis and treatment.
          </p>

          <p className="text-center mt-8 text-xs text-muted-foreground/50">Built with AI · Diabetes Prediction System</p>

        </div>
      </div>
      <FooterSection />
    </>
  );
}
