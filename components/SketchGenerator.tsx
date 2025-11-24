import React, { useState } from 'react';
import { Pencil, Move, Smile, Download, RefreshCw, AlertCircle, Sparkles, Eraser } from 'lucide-react';
import { generateSketchImage } from '../services/geminiService';

type GeneratorMode = 'expression' | 'action';

const SketchGenerator: React.FC = () => {
  const [mode, setMode] = useState<GeneratorMode>('expression');
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  // Construct the prompt based on user selection
  const constructPrompt = () => {
    // Ensuring the prompt emphasizes the sketch style strictly
    if (mode === 'expression') {
      return `简洁可爱的Q版黑白表情包插画，“${inputText}”的表情特写。
      风格参考：夸张搞笑的Q版表情包（Meme style），线条粗犷简单，类似马克笔手绘。
      视觉元素：使用圆润的线条，五官极其夸张（如大张的嘴、突出的眼珠、流泪、流汗等漫符）。
      构图：大头特写，白色背景。
      禁忌：严禁写实素描，严禁复杂的阴影和排线，严禁灰度渐变，严禁出现文字，只要黑白线条。`;
    } else {
      return `Q版卡通风格的黑白线条画，表现“${inputText}”的动作。
      人物形象：圆润可爱的白色“馒头人”或“火柴人进阶版”，头大身小，身体柔软像面团。
      线条风格：粗黑、流畅、圆润的单色线条，类似记号笔手绘，不要任何阴影排线。
      动作表现：动作极度夸张、充满张力，肢体语言丰富搞笑。
      装饰细节：必须加入漫画情绪符号来增强表现力（例如：表示惊讶的感叹号、表示用力的震动线、表示尴尬的汗滴、表示生气的青筋符号等）。
      背景：纯白背景，无任何杂物。
      禁忌：严禁写实风格，严禁素描质感，不要灰色，不要文字，只要纯黑白。`;
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('请输入描述内容');
      return;
    }
    
    setLoading(true);
    setError('');
    setGeneratedImage(null);

    const prompt = constructPrompt();

    try {
      const imageUrl = await generateSketchImage(prompt);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '生成过程中发生了错误，请重试。');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setError('');
    setGeneratedImage(null);
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `sketch-${mode}-${inputText.replace(/\s+/g, '-')}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Panel: Controls */}
        <div className="w-full md:w-2/5 p-6 md:p-8 bg-stone-50 border-r border-stone-100 flex flex-col gap-6 z-10">
          
          {/* Header Section */}
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-stone-800 p-3 rounded-2xl text-white shadow-lg transform -rotate-3">
              <Pencil size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-stone-900">素描工坊</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-stone-500 text-xs font-medium uppercase tracking-wider">Sketch Workshop</span>
                <span className="bg-stone-200 text-stone-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Nano Banana
                </span>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-stone-200 my-2"></div>
          
          {/* 1. Mode Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-[10px]">1</span>
              选择类型 / Mode
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('expression')}
                className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                  mode === 'expression' 
                    ? 'border-stone-800 bg-white text-stone-800 shadow-md' 
                    : 'border-transparent bg-stone-100 text-stone-400 hover:bg-stone-200'
                }`}
              >
                <Smile className={`mb-2 transition-transform group-hover:scale-110 ${mode === 'expression' ? 'stroke-[2.5px]' : ''}`} />
                <span className="font-medium text-sm">表情示意</span>
                {mode === 'expression' && <div className="absolute top-2 right-2 w-2 h-2 bg-stone-800 rounded-full"></div>}
              </button>
              <button
                onClick={() => setMode('action')}
                className={`relative group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                  mode === 'action' 
                    ? 'border-stone-800 bg-white text-stone-800 shadow-md' 
                    : 'border-transparent bg-stone-100 text-stone-400 hover:bg-stone-200'
                }`}
              >
                <Move className={`mb-2 transition-transform group-hover:scale-110 ${mode === 'action' ? 'stroke-[2.5px]' : ''}`} />
                <span className="font-medium text-sm">动作参考</span>
                {mode === 'action' && <div className="absolute top-2 right-2 w-2 h-2 bg-stone-800 rounded-full"></div>}
              </button>
            </div>
          </div>

          {/* 2. Input & Generate */}
          <div className="space-y-3 flex-grow">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-[10px]">2</span>
              输入描述 / Description
            </label>
            <div className="relative group">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === 'expression' ? "例如：狂笑、被吓到掉色、阴险地笑..." : "例如：疯狂奔跑、跪地求饶、激动地跳舞..."}
                className="w-full p-4 rounded-2xl border border-stone-200 bg-white focus:ring-2 focus:ring-stone-800 focus:border-transparent outline-none transition-all placeholder:text-stone-300 resize-none h-32 text-sm leading-relaxed"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerate();
                    }
                }}
              />
              {inputText && (
                  <button 
                    onClick={handleClear}
                    className="absolute top-3 right-3 text-stone-300 hover:text-stone-500 transition-colors"
                  >
                      <Eraser size={16} />
                  </button>
              )}
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={loading || !inputText.trim()}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2
                ${loading || !inputText.trim() 
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none' 
                  : 'bg-stone-800 text-white hover:bg-stone-900 hover:shadow-stone-300/50'
                }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={20} /> 
                  <span className="text-base">正在绘制 / Drawing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} className="fill-yellow-400 text-yellow-400" /> 
                  <span className="text-base">生成 Q 版素描</span>
                </>
              )}
            </button>
            
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm flex flex-col gap-2 animate-in slide-in-from-top-2">
                <div className="flex items-start gap-2">
                  <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-auto pt-4 text-center md:text-left">
            <p className="text-[10px] text-stone-400">
              Powered by Gemini 2.5 Flash Image (Nano Banana)
            </p>
          </div>
        </div>

        {/* Right Panel: Display */}
        <div className="w-full md:w-3/5 bg-stone-800 relative flex flex-col items-center justify-center p-8 overflow-hidden">
          
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: '24px 24px'
            }}>
          </div>
          <div className="absolute top-0 right-0 p-12 opacity-10">
             <Pencil size={200} className="text-white transform rotate-12" />
          </div>

          <div className="relative w-full max-w-md z-10">
            {generatedImage ? (
              <div className="animate-in fade-in zoom-in duration-500 slide-in-from-bottom-8">
                <div className="bg-white p-3 pb-12 shadow-2xl rotate-1 transform transition-all duration-300 hover:rotate-0 group rounded-sm">
                  {/* Paper Texture overlay for the image container */}
                  <div className="aspect-square w-full bg-white overflow-hidden border border-stone-100 relative">
                     <div className="absolute inset-0 bg-stone-100/10 pointer-events-none z-10 mix-blend-multiply"></div>
                     <img 
                      src={generatedImage} 
                      alt="Generated Sketch" 
                      className="w-full h-full object-cover filter grayscale contrast-[1.1] brightness-[1.05]"
                    />
                  </div>
                  
                  <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-between items-end">
                    <div className="flex flex-col max-w-[70%]">
                        <span className="font-handwriting text-stone-400 text-xs">fig. 01</span>
                        <span className="font-handwriting text-stone-800 text-xl leading-none truncate">{inputText}</span>
                    </div>
                    <div className="font-handwriting text-stone-400 text-xs">
                        {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                {/* Actions Bar */}
                <div className="flex justify-center mt-8 gap-4">
                    <button
                    onClick={downloadImage}
                    className="bg-white text-stone-900 px-6 py-3 rounded-full shadow-lg hover:bg-stone-100 hover:scale-105 transition-all flex items-center gap-2 font-medium text-sm"
                    >
                    <Download size={18} />
                    下载图片
                    </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6 opacity-60">
                <div className="w-40 h-40 mx-auto border-2 border-dashed border-stone-600 rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-4 border-stone-700 opacity-20 animate-ping"></div>
                  <Pencil size={48} className="text-stone-500" />
                </div>
                <div>
                    <h3 className="text-stone-300 text-xl font-medium mb-2">准备就绪</h3>
                    <p className="text-stone-500 text-sm max-w-xs mx-auto">
                        在左侧面板输入您想要的画面描述，<br/>AI 艺术家将为您即时绘制Q版素描。
                    </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SketchGenerator;