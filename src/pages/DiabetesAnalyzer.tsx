import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

export default function DiabetesAnalyzer() {
  const [currentBase64, setCurrentBase64] = useState<string | null>(null);
  const [currentMimeType, setCurrentMimeType] = useState<string | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) processFile(file);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setErrorStatus(null);
    setCurrentMimeType(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = (e) => {
      const resultStr = e.target?.result as string;
      setDataUrl(resultStr);
      setCurrentBase64(resultStr.split(',')[1]);
      setResult(null);
      setInsights([]);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setCurrentBase64(null);
    setDataUrl(null);
    setResult(null);
    setInsights([]);
    setErrorStatus(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const analyze = async () => {
    if (!currentBase64) return;
    
    setIsAnalyzing(true);
    setErrorStatus(null);
    setResult(null);
    setInsights([]);
    
    try {
      const extractPrompt = `You are a medical AI specialized in reading diabetes-related medical images. Analyze this image carefully.

The image may contain: a glucometer display, blood glucose meter, lab test report, HbA1c result, blood sugar log, prescription, or any diabetes-related medical document.

Extract ALL visible medical values. Then respond with ONLY a valid JSON object — no markdown, no explanation, just raw JSON:

{
  "image_type": "glucometer" | "lab_report" | "prescription" | "hba1c" | "blood_test" | "other" | "not_medical",
  "values": [
    { "label": "Blood Glucose", "value": "126", "unit": "mg/dL", "status": "normal" | "prediabetic" | "diabetic" | "unknown" }
  ],
  "overall_risk": "low" | "medium" | "high" | "unknown",
  "primary_reading": "126 mg/dL",
  "reading_time": "fasting" | "post-meal" | "random" | "unknown",
  "visible_text": "exact text you can see on the device/report"
}

If no medical values are visible, set image_type to "not_medical".
For status: normal glucose is 70-99 mg/dL fasting, prediabetic is 100-125, diabetic is 126+.
HbA1c: normal <5.7%, prediabetic 5.7-6.4%, diabetic 6.5%+.`;

      const extractResp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: currentMimeType, data: currentBase64 }
              },
              { type: "text", text: extractPrompt }
            ]
          }]
        })
      });

      if (!extractResp.ok) {
        throw new Error("Failed to call Anthropic API");
      }

      const extractData = await extractResp.json();
      const rawText = extractData.content?.find((b: any) => b.type === 'text')?.text || '{}';
      
      let parsed;
      try {
        const clean = rawText.replace(/```json|```/g, '').trim();
        parsed = JSON.parse(clean);
      } catch(e) {
        parsed = { image_type: 'other', values: [], overall_risk: 'unknown', primary_reading: 'Could not parse' };
      }

      if (parsed.image_type === 'not_medical') {
        setErrorStatus('⚠️ No diabetes or blood glucose values detected in this image. Please upload a glucometer, lab report, or diabetes-related medical image.');
        setIsAnalyzing(false);
        return;
      }

      setResult(parsed);
      setIsGeneratingInsights(true);

      const valuesDesc = (parsed.values || []).map((v: any) => `${v.label}: ${v.value} ${v.unit} (${v.status})`).join(', ');
      const insightPrompt = `You are a compassionate but medically accurate diabetes health advisor.

A patient uploaded a medical image. Here is what was detected:
- Image type: ${parsed.image_type}
- Values found: ${valuesDesc || parsed.primary_reading || 'See context'}
- Visible text on image: ${parsed.visible_text || 'N/A'}
- Reading type: ${parsed.reading_time || 'unknown'}
- Overall risk level: ${parsed.overall_risk}

Give a clear, helpful, 4-6 sentence analysis in plain language:
1. What these values mean clinically (reference normal ranges)
2. What the patient should know about their current reading
3. Warning signs to watch for (if applicable)
4. 1-2 specific actionable steps they can take right now

Write in warm, direct paragraphs. No bullet points. No headers. No markdown. Use simple language a non-medical person can understand.`;

      const insightResp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: insightPrompt }]
        })
      });

      if (!insightResp.ok) {
        throw new Error("Failed to call Anthropic API for insights");
      }

      const insightData = await insightResp.json();
      const insightText = insightData.content?.find((b: any) => b.type === 'text')?.text || 'Unable to generate insights.';
      
      const paragraphs = insightText.trim().split(/\n+/).filter(Boolean);
      setInsights(paragraphs);

    } catch(err) {
      console.error(err);
      setErrorStatus('⚠️ Something went wrong. Please check your API access or try again.');
    } finally {
      setIsAnalyzing(false);
      setIsGeneratingInsights(false);
    }
  };

  const getRiskConfig = (risk: string, primary: string) => {
    const configs: Record<string, any> = {
      low:     { emoji: '✅', title: 'Values Look Normal', desc: `Your reading of ${primary} appears within a healthy range. Keep up your current habits!` },
      medium:  { emoji: '⚠️', title: 'Borderline / Pre-diabetic Range', desc: `Your reading of ${primary} is in a cautionary range. Lifestyle changes can make a big difference.` },
      high:    { emoji: '🔴', title: 'Elevated — Consult a Doctor', desc: `Your reading of ${primary} is above normal range. Please seek medical attention.` },
      unknown: { emoji: '🔍', title: 'Values Detected', desc: `Reading: ${primary}. See the AI analysis below for interpretation.` }
    };
    return configs[risk] || configs.unknown;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background section-pad">
        <div className="max-w-3xl mx-auto px-6">
          
          <div className="text-center mb-12">
            <span className="badge-primary mb-4 text-xs font-bold tracking-widest uppercase">Vision AI · Medical Analysis</span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              Scan Your<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-medical-blue">Glucose</span> Meter
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Upload a photo of your glucometer, lab report, or any medical document showing blood sugar values — AI reads and interprets it instantly.
            </p>
          </div>

          {errorStatus && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive mb-6 text-center animate-in fade-in">
              {errorStatus}
            </div>
          )}

          {!dataUrl && (
            <div 
              className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-200 ease-out bg-white mb-8 ${
                isDragOver ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg' : 'border-border hover:border-primary/50 hover:bg-slate-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input type="file" ref={fileInputRef} accept="image/*" capture="environment" onChange={handleChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-primary">📷</div>
              <div className="text-lg font-bold text-foreground mb-2">Drop image here or tap to upload</div>
              <div className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
                Works with <strong className="text-foreground font-semibold">glucometers, lab reports, HbA1c results,</strong><br/>
                blood test strips, or any diabetes-related medical image
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="bg-slate-100 text-slate-600 text-[11px] px-3 py-1.5 rounded-full font-medium border border-slate-200">📟 Glucometer display</span>
                <span className="bg-slate-100 text-slate-600 text-[11px] px-3 py-1.5 rounded-full font-medium border border-slate-200">🧪 Lab report</span>
                <span className="bg-slate-100 text-slate-600 text-[11px] px-3 py-1.5 rounded-full font-medium border border-slate-200">📋 Prescription</span>
                <span className="bg-slate-100 text-slate-600 text-[11px] px-3 py-1.5 rounded-full font-medium border border-slate-200">📊 HbA1c chart</span>
              </div>
            </div>
          )}

          {dataUrl && !result && !errorStatus && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative rounded-2xl overflow-hidden shadow-card border border-border bg-black max-w-sm mx-auto mb-6 group">
                <img src={dataUrl} alt="Uploaded medical image" className="w-full h-auto max-h-[400px] object-contain" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <button className="bg-black/50 hover:bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10" onClick={clearImage}>✕ Remove Image</button>
                </div>
              </div>
              
              <button className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-4 bg-teal text-white rounded-xl font-bold text-base shadow-btn-teal hover:bg-teal-dark active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed" disabled={isAnalyzing} onClick={analyze}>
                {isAnalyzing && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                <span>{isAnalyzing ? (isGeneratingInsights ? 'Generating insights...' : 'Reading image...') : '🔍 Analyze with AI'}</span>
              </button>
            </div>
          )}

          {result && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {!result.values?.length ? (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 col-span-2 sm:col-span-3 text-center">
                    <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Image analyzed</span>
                  </div>
                ) : (
                  result.values.map((v: any, i: number) => {
                    const isAlert = v.status === 'diabetic';
                    const isWarn = v.status === 'prediabetic';
                    
                    return (
                      <div key={i} className={`rounded-xl shadow-sm border p-4 flex flex-col justify-center ${
                        isAlert ? 'bg-destructive/5 border-destructive/30' : isWarn ? 'bg-[#e67e22]/5 border-[#e67e22]/30' : 'bg-teal/5 border-teal/30'
                      }`}>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{v.label}</span>
                        <span className={`text-xl sm:text-2xl font-bold ${
                          isAlert ? 'text-destructive' : isWarn ? 'text-[#e67e22]' : 'text-teal'
                        }`}>{v.value} <span className="text-sm font-semibold opacity-70">{v.unit}</span></span>
                      </div>
                    );
                  })
                )}
              </div>

              {(() => {
                const rConfig = getRiskConfig(result.overall_risk, result.primary_reading);
                return (
                  <div className={`clinical-card flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left mb-6 border-l-4 ${
                    result.overall_risk === 'high' ? 'border-l-destructive' : result.overall_risk === 'medium' ? 'border-l-[#e67e22]' : 'border-l-teal'
                  }`}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 ${
                      result.overall_risk === 'high' ? 'bg-destructive/10' : result.overall_risk === 'medium' ? 'bg-[#e67e22]/10' : 'bg-teal/10'
                    }`}>
                      {rConfig.emoji}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold mb-1 ${
                        result.overall_risk === 'high' ? 'text-destructive' : result.overall_risk === 'medium' ? 'text-[#e67e22]' : 'text-teal'
                      }`}>{rConfig.title}</h3>
                      <p className="text-sm text-foreground leading-relaxed">{rConfig.desc}</p>
                    </div>
                  </div>
                );
              })()}

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5 pb-4 border-b border-border">
                  <span className="text-lg">🧠</span> AI Clinical Insights
                </div>
                <div className="text-sm leading-relaxed text-foreground space-y-4">
                  {isGeneratingInsights || insights.length === 0 ? (
                    <div className="flex gap-1.5 items-center py-4 animate-pulse">
                      <div className="w-2.5 h-2.5 bg-muted-foreground/40 rounded-full"></div>
                      <div className="w-2.5 h-2.5 bg-muted-foreground/40 rounded-full animation-delay-200"></div>
                      <div className="w-2.5 h-2.5 bg-muted-foreground/40 rounded-full animation-delay-400"></div>
                    </div>
                  ) : (
                    insights.map((p, i) => <p key={i}>{p}</p>)
                  )}
                </div>
              </div>

              <div className="mt-8 text-center bg-transparent">
                <button onClick={clearImage} className="text-sm font-semibold text-primary hover:text-medical-blue transition-colors flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-full hover:bg-primary/5">
                  ← Analyze another image
                </button>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground leading-relaxed px-4 mt-12 mb-6">
            ⚕️ For educational purposes only. Not a substitute for professional medical advice.<br/>
            Always consult a qualified healthcare provider for diagnosis and treatment.
          </p>

        </div>
      </div>
      <FooterSection />
    </>
  );
}
