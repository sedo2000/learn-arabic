import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

type LetterKey = 
  | 'ا' | 'ب' | 'ت' | 'ث' | 'ج' | 'ح' | 'خ' | 'د' | 'ذ' | 'ر' | 'ز' | 'س' | 'ش' | 'ص' | 'ض' | 'ط' | 'ظ' | 'ع' | 'غ' | 'ف' | 'ق' | 'ك' | 'ل' | 'م' | 'ن' | 'ه' | 'و' | 'ي';

type LetterData = {
  char: LetterKey;
  name: string;
  sound: string;
  latin: string;
  isolated: string;
  initial: string;
  medial: string;
  final: string;
  canConnectLeft: boolean; // can connect to the next letter (left side)
  example: string;
  exampleMeaning: string;
  color: string;
};

const masterAlphabet: LetterData[] = [
  { char: 'ا', name: 'ألف', sound: 'آ / أ', latin: 'alif', isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا', canConnectLeft: false, example: 'أسد', exampleMeaning: 'أسد', color: '#ef8066' },
  { char: 'ب', name: 'باء', sound: 'بَ', latin: 'ba', isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب', canConnectLeft: true, example: 'بَاب', exampleMeaning: 'باب', color: '#e99958' },
  { char: 'ت', name: 'تاء', sound: 'تَ', latin: 'ta', isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت', canConnectLeft: true, example: 'تُفاح', exampleMeaning: 'تفاح', color: '#dcb05b' },
  { char: 'ث', name: 'ثاء', sound: 'ثَ', latin: 'tha', isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث', canConnectLeft: true, example: 'ثعلب', exampleMeaning: 'ثعلب', color: '#bfb860' },
  { char: 'ج', name: 'جيم', sound: 'جَ', latin: 'jim', isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج', canConnectLeft: true, example: 'جَمَل', exampleMeaning: 'جمل', color: '#86b56d' },
  { char: 'ح', name: 'حاء', sound: 'حَ', latin: 'ha', isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح', canConnectLeft: true, example: 'حُوت', exampleMeaning: 'حوت', color: '#5db19c' },
  { char: 'خ', name: 'خاء', sound: 'خَ', latin: 'kha', isolated: 'خ', initial: 'خـ', medial: 'ـخـ', final: 'ـخ', canConnectLeft: true, example: 'خُبز', exampleMeaning: 'خبز', color: '#5a9fb9' },
  { char: 'د', name: 'دال', sound: 'دَ', latin: 'dal', isolated: 'د', initial: 'د', medial: 'ـد', final: 'ـد', canConnectLeft: false, example: 'دُب', exampleMeaning: 'دب', color: '#6d8bd0' },
  { char: 'ذ', name: 'ذال', sound: 'ذَ', latin: 'dhal', isolated: 'ذ', initial: 'ذ', medial: 'ـذ', final: 'ـذ', canConnectLeft: false, example: 'ذُرَة', exampleMeaning: 'ذرة', color: '#8674c9' },
  { char: 'ر', name: 'راء', sound: 'رَ', latin: 'ra', isolated: 'ر', initial: 'ر', medial: 'ـر', final: 'ـر', canConnectLeft: false, example: 'رُمّان', exampleMeaning: 'رمان', color: '#a46dc2' },
  { char: 'ز', name: 'زاي', sound: 'زَ', latin: 'zay', isolated: 'ز', initial: 'ز', medial: 'ـز', final: 'ـز', canConnectLeft: false, example: 'زَيتون', exampleMeaning: 'زيتون', color: '#c86fa8' },
  { char: 'س', name: 'سين', sound: 'سَ', latin: 'sin', isolated: 'س', initial: 'سـ', medial: 'ـسـ', final: 'ـس', canConnectLeft: true, example: 'سَمَك', exampleMeaning: 'سمك', color: '#d96c7e' },
  { char: 'ش', name: 'شين', sound: 'شَ', latin: 'shin', isolated: 'ش', initial: 'شـ', medial: 'ـشـ', final: 'ـش', canConnectLeft: true, example: 'شَمس', exampleMeaning: 'شمس', color: '#e77a61' },
  { char: 'ص', name: 'صاد', sound: 'صَ', latin: 'sad', isolated: 'ص', initial: 'صـ', medial: 'ـصـ', final: 'ـص', canConnectLeft: true, example: 'صَقر', exampleMeaning: 'صقر', color: '#e09055' },
  { char: 'ض', name: 'ضاد', sound: 'ضَ', latin: 'dad', isolated: 'ض', initial: 'ضـ', medial: 'ـضـ', final: 'ـض', canConnectLeft: true, example: 'ضِفدع', exampleMeaning: 'ضفدع', color: '#d4a754' },
  { char: 'ط', name: 'طاء', sound: 'طَ', latin: 'ta2', isolated: 'ط', initial: 'طـ', medial: 'ـطـ', final: 'ـط', canConnectLeft: true, example: 'طَائرة', exampleMeaning: 'طائرة', color: '#b6af60' },
  { char: 'ظ', name: 'ظاء', sound: 'ظَ', latin: 'dha', isolated: 'ظ', initial: 'ظـ', medial: 'ـظـ', final: 'ـظ', canConnectLeft: true, example: 'ظَرف', exampleMeaning: 'ظرف', color: '#7fb66f' },
  { char: 'ع', name: 'عين', sound: 'عَ', latin: 'ain', isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع', canConnectLeft: true, example: 'عِنَب', exampleMeaning: 'عنب', color: '#54af94' },
  { char: 'غ', name: 'غين', sound: 'غَ', latin: 'ghain', isolated: 'غ', initial: 'غـ', medial: 'ـغـ', final: 'ـغ', canConnectLeft: true, example: 'غَزال', exampleMeaning: 'غزال', color: '#4d9cbb' },
  { char: 'ف', name: 'فاء', sound: 'فَ', latin: 'fa', isolated: 'ف', initial: 'فـ', medial: 'ـفـ', final: 'ـف', canConnectLeft: true, example: 'فِيل', exampleMeaning: 'فيل', color: '#6287d1' },
  { char: 'ق', name: 'قاف', sound: 'قَ', latin: 'qaf', isolated: 'ق', initial: 'قـ', medial: 'ـقـ', final: 'ـق', canConnectLeft: true, example: 'قَمَر', exampleMeaning: 'قمر', color: '#7e6fcb' },
  { char: 'ك', name: 'كاف', sound: 'كَ', latin: 'kaf', isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك', canConnectLeft: true, example: 'كِتاب', exampleMeaning: 'كتاب', color: '#a165be' },
  { char: 'ل', name: 'لام', sound: 'لَ', latin: 'lam', isolated: 'ل', initial: 'لـ', medial: 'ـلـ', final: 'ـل', canConnectLeft: true, example: 'لَيمون', exampleMeaning: 'ليمون', color: '#c667a1' },
  { char: 'م', name: 'ميم', sound: 'مَ', latin: 'mim', isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم', canConnectLeft: true, example: 'مَوز', exampleMeaning: 'موز', color: '#d96478' },
  { char: 'ن', name: 'نون', sound: 'نَ', latin: 'nun', isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن', canConnectLeft: true, example: 'نَجمَة', exampleMeaning: 'نجمة', color: '#e3725c' },
  { char: 'ه', name: 'هاء', sound: 'هـ', latin: 'ha2', isolated: 'ه', initial: 'هـ', medial: 'ـهـ', final: 'ـه', canConnectLeft: true, example: 'هِلال', exampleMeaning: 'هلال', color: '#df8854' },
  { char: 'و', name: 'واو', sound: 'وَ', latin: 'waw', isolated: 'و', initial: 'و', medial: 'ـو', final: 'ـو', canConnectLeft: false, example: 'وَردَة', exampleMeaning: 'وردة', color: '#cd9c54' },
  { char: 'ي', name: 'ياء', sound: 'يَ', latin: 'ya', isolated: 'ي', initial: 'يـ', medial: 'ـيـ', final: 'ـي', canConnectLeft: true, example: 'يَد', exampleMeaning: 'يد', color: '#abaa62' },
];

const letterMap = new Map(masterAlphabet.map(l => [l.char, l]));
const nonConnectingSet = new Set(['ا','د','ذ','ر','ز','و','أ','إ','آ','ؤ','ء','ة','ى','ئ']);
const canConnectLeft = (char: string) => {
  const found = letterMap.get(char as LetterKey);
  if (found) return found.canConnectLeft;
  return !nonConnectingSet.has(char);
};

type ShapedLetter = {
  char: string;
  form: 'isolated' | 'initial' | 'medial' | 'final';
  glyph: string;
  data?: LetterData;
  connectsRight: boolean;
  connectsLeft: boolean;
};

function shapeArabicWord(word: string): ShapedLetter[] {
  // Keep only Arabic letters
  const chars = Array.from(word).filter(c => /[\u0600-\u06FF]/.test(c));
  if (chars.length === 0) return [];

  const result: ShapedLetter[] = chars.map((char, i) => {
    const prevChar = i > 0 ? chars[i - 1] : null;
    const nextChar = i < chars.length - 1 ? chars[i + 1] : null;

    const prevCanConnect = prevChar ? canConnectLeft(prevChar) : false;
    const thisCanConnect = canConnectLeft(char);

    const connectsRight = !!prevChar && prevCanConnect;
    const connectsLeft = !!nextChar && thisCanConnect;

    let form: ShapedLetter['form'] = 'isolated';
    if (connectsRight && connectsLeft) form = 'medial';
    else if (connectsRight && !connectsLeft) form = 'final';
    else if (!connectsRight && connectsLeft) form = 'initial';
    else form = 'isolated';

    const data = letterMap.get(char as LetterKey);
    let glyph = char;
    if (data) {
      glyph = data[form] || data.isolated;
    }

    return { char, form, glyph, data, connectsRight, connectsLeft };
  });

  return result; // logical order (rightmost char first), render RTL
}

const QUICK_WORDS = [
  'الماس', 'مدرسة', 'كتاب', 'سلام', 'عربي', 'قلم', 'وردة', 'نور', 'بحر', 'نجمة', 'بيت', 'قمر'
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'lab' | 'board'>('lab');
  const [dictQuery, setDictQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<LetterData | null>(masterAlphabet[11]); // س

  const [labWord, setLabWord] = useState('الماس');
  const shaped = useMemo(() => shapeArabicWord(labWord), [labWord]);

  // --- Canvas Board ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);
  const lastPtRef = useRef<{x:number,y:number} | null>(null);

  const [penMode, setPenMode] = useState<'pen' | 'calligraphy' | 'highlighter'>('pen');
  const [eraserOn, setEraserOn] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [inkColor, setInkColor] = useState('#1f2937');

  const historyRef = useRef<string[]>([]);
  const historyIdxRef = useRef(-1);

  const inkColors = [
    '#1f2937','#115e59','#1d4ed8','#7c3aed','#be185d','#b45309', '#0f766e','#ea580c'
  ];

  const sizeConfig = eraserOn ? { min: 10, max: 50, label: 'حجم الممسحة:' } : { min: 2, max: 15, label: 'حجم القلم:' };

  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    // trim any redo states
    if (historyIdxRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
    }
    historyRef.current.push(dataUrl);
    historyIdxRef.current = historyRef.current.length - 1;
    if (historyRef.current.length > 28) {
      historyRef.current.shift();
      historyIdxRef.current--;
    }
  }, []);

  const restoreFromHistory = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const url = historyRef.current[idx];
    if (!url) return;
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // paint the paper background back
      ctx.fillStyle = '#fdfcf8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    };
    img.src = url;
  }, []);

  const undo = useCallback(() => {
    if (historyIdxRef.current > 0) {
      historyIdxRef.current--;
      restoreFromHistory(historyIdxRef.current);
    }
  }, [restoreFromHistory]);

  const redo = useCallback(() => {
    if (historyIdxRef.current < historyRef.current.length - 1) {
      historyIdxRef.current++;
      restoreFromHistory(historyIdxRef.current);
    }
  }, [restoreFromHistory]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#fdfcf8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    saveHistory();
  }, [saveHistory]);

  // Setup canvas sizing
  useEffect(() => {
    if (activeTab !== 'board') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w < 10 || h < 10) return;
      const imgData = historyIdxRef.current >=0 ? historyRef.current[historyIdxRef.current] : null;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // repaint
      ctx.fillStyle = '#fdfcf8';
      ctx.fillRect(0, 0, w, h);
      if (imgData) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, w, h);
        img.src = imgData;
      } else {
        saveHistory();
      }
    };

    const ro = new ResizeObserver(setCanvasSize);
    ro.observe(canvas);
    setCanvasSize();

    return () => ro.disconnect();
  }, [activeTab, saveHistory]);

  const getCanvasPoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const drawSegment = (x0: number, y0: number, x1: number, y1: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (eraserOn) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#fdfcf8';
      ctx.globalAlpha = 1;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else if (penMode === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#ffe34d';
      ctx.globalAlpha = 0.42;
      ctx.lineWidth = Math.max(12, brushSize * 3.1);
      ctx.lineCap = 'round';
    } else if (penMode === 'calligraphy') {
      // Chiseled qalam effect
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = inkColor;
      ctx.globalAlpha = 1;
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      ctx.lineWidth = brushSize * 1.55;

      // Draw a slightly angled, flattened stroke
      const dx = x1 - x0;
      const dy = y1 - y0;
      const angle = Math.atan2(dy, dx);
      ctx.translate(x0, y0);
      ctx.rotate(angle - Math.PI / 6.5); // ~28° qalam tilt
      ctx.beginPath();
      ctx.moveTo(0, -brushSize * 0.42);
      ctx.lineTo(Math.hypot(dx, dy), -brushSize * 0.42);
      ctx.lineWidth = brushSize * 0.92;
      ctx.stroke();
      ctx.restore();
      lastPtRef.current = { x: x1, y: y1 };
      return;
    } else {
      // Standard smooth pen
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = inkColor;
      ctx.globalAlpha = 1;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.restore();
  };

  const startDraw = (x: number, y: number) => {
    isDrawingRef.current = true;
    lastPtRef.current = { x, y };
    // dot
    drawSegment(x, y, x + 0.01, y + 0.01);
  };

  const moveDraw = (x: number, y: number) => {
    if (!isDrawingRef.current || !lastPtRef.current) return;
    const last = lastPtRef.current;
    drawSegment(last.x, last.y, x, y);
    lastPtRef.current = { x, y };
  };

  const endDraw = () => {
    if (isDrawingRef.current) {
      saveHistory();
    }
    isDrawingRef.current = false;
    lastPtRef.current = null;
  };

  // pointer handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || activeTab !== 'board') return;

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      const p = getCanvasPoint(e.clientX, e.clientY);
      startDraw(p.x, p.y);
    };
    const onPointerMove = (e: PointerEvent) => {
      e.preventDefault();
      if (!isDrawingRef.current) return;
      const p = getCanvasPoint(e.clientX, e.clientY);
      moveDraw(p.x, p.y);
    };
    const finish = (e: PointerEvent) => {
      e.preventDefault();
      endDraw();
    };

    canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
    canvas.addEventListener('pointermove', onPointerMove, { passive: false });
    canvas.addEventListener('pointerup', finish, { passive: false });
    canvas.addEventListener('pointercancel', finish, { passive: false });
    canvas.addEventListener('pointerleave', finish);

    // Extra iOS touch prevention
    const tPrevent = (ev: TouchEvent) => { ev.preventDefault(); };
    canvas.addEventListener('touchstart', tPrevent, { passive: false });
    canvas.addEventListener('touchmove', tPrevent, { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', finish);
      canvas.removeEventListener('pointercancel', finish);
      canvas.removeEventListener('pointerleave', finish);
      canvas.removeEventListener('touchstart', tPrevent);
      canvas.removeEventListener('touchmove', tPrevent);
    };
  }, [activeTab, inkColor, brushSize, penMode, eraserOn, saveHistory]);

  const filteredDict = masterAlphabet.filter(l =>
    !dictQuery ||
    l.name.includes(dictQuery) ||
    l.char.includes(dictQuery) ||
    l.latin.toLowerCase().includes(dictQuery.toLowerCase())
  );

  const canUndo = historyIdxRef.current > 0;
  const canRedo = historyIdxRef.current < historyRef.current.length - 1;
  const [, forceRerender] = useState(0);
  // Force update on history changes (lightweight)
  useEffect(() => {
    if (activeTab !== 'board') return;
    const id = setInterval(()=>forceRerender(x=>x+1), 340);
    return ()=>clearInterval(id);
  }, [activeTab]);

  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-[#ebe6de] text-[#262626] antialiased" style={{ fontFamily: `"Noto Naskh Arabic", "Noto Kufi Arabic", "IBM Plex Sans Arabic", system-ui, "Segoe UI", Tahoma, Arial, sans-serif` }}>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap');
      * { font-family: "IBM Plex Sans Arabic", "Noto Naskh Arabic", system-ui, sans-serif; }
      .naskh { font-family: "Noto Naskh Arabic", serif; }
      ::-webkit-scrollbar { width: 0; height: 0; }
      input[type=range] { accent-color: #dd602d; }
      `}</style>

      {/* Page wrapper */}
      <div className="min-h-screen w-full flex justify-center py-5 sm:py-9 px-3">
        <div className="w-full max-w-[430px]">
          {/* Phone shell */}
          <div className="relative bg-[#faf8f4] rounded-[34px] shadow-[0_24px_80px_rgba(79,57,33,0.22)] ring-1 ring-black/[0.065] overflow-hidden">
            {/* Top status / header */}
            <div className="pt-[20px] pb-4 px-6 bg-[#faf8f4]">
              <div className="flex items-center justify-between text-[12.5px] text-stone-500">
                <span className="font-medium">{new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="flex items-center gap-1">
                  <span className="w-[16px] h-[9px] rounded-[3px] bg-stone-700/70 inline-block"></span>
                  <span className="w-[3px] h-[3px] rounded-full bg-stone-500 inline-block"></span>
                </div>
              </div>

              <div className="mt-6 flex items-start justify-between">
                <div>
                  <div className="text-[12.6px] text-stone-500">مرحباً بك في</div>
                  <h1 className="naskh text-[31px] leading-[1.22] font-[700] text-stone-800 tracking-tight">
                    مشكّل الحروف<br/>العربية
                  </h1>
                </div>
                <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-rose-200 via-amber-100 to-amber-200 flex items-center justify-center shadow-inner text-[22px] naskh font-bold text-stone-700">
                  خـ
                </div>
              </div>

              {/* Tab pills */}
              <div className="mt-5 flex items-center gap-2 text-[12.9px]">
                <button
                  onClick={()=>setActiveTab('dictionary')}
                  className={`px-3.5 py-2 rounded-full transition ${activeTab === 'dictionary' ? 'bg-[#222] text-white shadow' : 'bg-stone-200/85 text-stone-600 hover:bg-stone-200'}`}
                >القاموس</button>
                <button
                  onClick={()=>setActiveTab('lab')}
                  className={`px-3.5 py-2 rounded-full transition ${activeTab === 'lab' ? 'bg-[#e15a2f] text-white shadow-[0_8px_18px_rgba(225,90,47,0.32)]' : 'bg-stone-200/85 text-stone-600 hover:bg-stone-200'}`}
                >المختبر</button>
                <button
                  onClick={()=>setActiveTab('board')}
                  className={`px-3.5 py-2 rounded-full transition ${activeTab === 'board' ? 'bg-[#222] text-white shadow' : 'bg-stone-200/85 text-stone-600 hover:bg-stone-200'}`}
                >السبورة</button>
              </div>
            </div>

            {/* Main content - fixed height area to prevent scroll leaks */}
            <div className="px-5 pb-[92px]">
              {/* DICTIONARY */}
              {activeTab === 'dictionary' && (
                <section className="pb-2">
                  <div className="relative mb-3">
                    <input
                      placeholder="ابحث عن حرف… ألف، باء، b ..."
                      value={dictQuery}
                      onChange={e=>setDictQuery(e.target.value)}
                      className="w-full bg-white rounded-[18px] border border-stone-200 py-3.5 pr-11 pl-4 text-[14.3px] outline-none focus:border-stone-300 placeholder-stone-400 shadow-sm"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[17px]">⌕</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5 mb-4">
                    {filteredDict.map(l => (
                      <button
                        key={l.char}
                        onClick={()=>setSelectedLetter(l)}
                        className={`rounded-[21px] bg-white border shadow-[0_2px_9px_rgba(80,57,34,0.06)] px-3 py-3.5 transition-all duration-150 active:scale-[0.98] ${
                          selectedLetter?.char === l.char
                          ? 'ring-2 ring-[#e15a2f] border-[#f1b8a2]'
                          : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="naskh text-[30px] leading-none text-stone-800">{l.char}</div>
                        <div className="text-[11.5px] text-stone-500 mt-1">{l.name}</div>
                      </button>
                    ))}
                  </div>

                  {selectedLetter && (
                    <div className="bg-white rounded-[26px] shadow-[0_8px_28px_rgba(62,43,22,0.10)] border border-stone-200 px-5 pt-5 pb-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[16px] font-bold shadow" style={{ background: selectedLetter.color }}>
                            <span className="naskh text-[22px]">{selectedLetter.char}</span>
                          </div>
                          <div>
                            <div className="text-[16.5px] font-[700] text-stone-800">{selectedLetter.name}</div>
                            <div className="text-[12.2px] text-stone-500 -mt-0.5">{selectedLetter.sound} • {selectedLetter.latin}</div>
                          </div>
                        </div>
                        <button
                          onClick={()=>{
                            setLabWord(selectedLetter.example);
                            setActiveTab('lab');
                          }}
                          className="text-[12.4px] text-[#d14821] bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full transition"
                        >
                          جرّبه في المختبر →
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                        {[
                          {t:'منفصل', g:selectedLetter.isolated},
                          {t:'أولي', g:selectedLetter.initial},
                          {t:'وسطي', g:selectedLetter.medial},
                          {t:'نهائي', g:selectedLetter.final},
                        ].map(f=>(
                          <div key={f.t} className="rounded-[18px] bg-[#fbf7f1] border border-stone-200/80 py-3">
                            <div className="text-[11.3px] text-stone-500">{f.t}</div>
                            <div className="naskh text-[28px] text-stone-800 leading-tight">{f.g}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[13.2px] bg-amber-50/70 border border-amber-100 rounded-2xl px-4 py-3">
                        <div className="text-stone-600">مثال : <span className="naskh text-[20px] text-stone-800 mr-1">{selectedLetter.example}</span></div>
                        <div className="text-stone-500">{selectedLetter.exampleMeaning}</div>
                      </div>
                      <div className="mt-2 text-[11.8px] text-stone-500 text-center">
                        {selectedLetter.canConnectLeft ? 'حرف موصول — يتصل بما بعده' : 'حرف رافس — لا يتصل بما بعده'}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* WORD LAB */}
              {activeTab === 'lab' && (
                <section>
                  <div className="bg-white rounded-[26px] border border-stone-200 shadow-[0_10px_28px_rgba(62,43,22,0.09)] px-4 pt-4 pb-5">
                    <div className="text-[12.8px] text-stone-500 text-right mb-1.5">اكتب كلمة عربية</div>
                    <input
                      dir="rtl"
                      value={labWord}
                      onChange={e=>setLabWord(e.target.value)}
                      placeholder="اكتب هنا..."
                      className="w-full naskh text-[37px] text-stone-800 text-right bg-[#f8f2e9] rounded-[18px] border border-[#ecd8c2] px-4 py-4 outline-none focus:border-[#e3b997] focus:bg-[#f6efe4] transition"
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                      {QUICK_WORDS.map(w=>(
                        <button key={w} onClick={()=>setLabWord(w)}
                          className={`text-[12.6px] rounded-full px-3 py-1.5 border transition ${labWord===w ? 'bg-[#212121] text-white border-[#212121]':'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'}`}>{w}</button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-[12.5px] text-stone-500 mb-2 pr-1">تفكيك الحروف (قراءة من اليمين إلى اليسار)</div>
                    <div
                      dir="rtl"
                      className="bg-[#f3efe7] rounded-[26px] border border-stone-200 px-3 py-4 min-h-[154px]"
                    >
                      {shaped.length === 0 ? (
                        <div className="text-stone-400 text-center pt-10 text-sm">اكتب كلمة لترى التفكيك</div>
                      ) : (
                        <div className="flex flex-wrap justify-center gap-2.5">
                          {shaped.map((s, idx)=>(
                            <div key={idx} className="relative bg-white rounded-[20px] shadow-[0_5px_16px_rgba(68,47,30,0.08)] border border-stone-200 w-[78px] py-3 text-center">
                              <div className="naskh text-[36px] leading-none text-stone-800">{s.glyph}</div>
                              <div className="text-[11.8px] text-stone-500 mt-1">{s.data?.name || s.char}</div>
                              <div className="text-[10.7px] text-stone-400">
                                {s.form === 'isolated' ? 'منفصل' : s.form === 'initial' ? 'أولي' : s.form === 'medial' ? 'وسطي' : 'نهائي'}
                              </div>
                              {/* Connection dots */}
                              <div className="flex items-center justify-between px-3 mt-1">
                                <span className={`w-[6px] h-[6px] rounded-full ${s.connectsLeft ? 'bg-[#df5c31]' : 'bg-stone-200'}`}></span>
                                <span className={`w-[6px] h-[6px] rounded-full ${s.connectsRight ? 'bg-[#df5c31]' : 'bg-stone-200'}`}></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-[11.7px] text-stone-500 mt-2 text-center">
                      يتم تحديد الشكل تلقائيًا حسب موقع الحرف وقاعدة الاتصال. الحروف الرافسة: ا د ذ ر ز و
                    </div>
                  </div>

                  <div className="mt-3 bg-white rounded-[22px] border border-stone-200 px-4 py-3 text-[12.8px] text-stone-600 leading-relaxed">
                    <b className="text-stone-700">ملاحظة التشكيل:</b> تم إصلاح خطأ عكس الترتيب في المختبر. الحروف الآن تُعرض بالتسلسل الصحيح من اليمين إلى اليسار، وتحافظ على اتصالها الطبيعي.
                  </div>
                </section>
              )}

              {/* CANVAS BOARD */}
              {activeTab === 'board' && (
                <section>
                  <div className="bg-white rounded-[26px] border border-stone-200 shadow-[0_10px_34px_rgba(62,43,22,0.10)] p-[11px]">
                    <div className="relative rounded-[18px] overflow-hidden bg-[#fdfcf8] border border-stone-200"
                         style={{ touchAction: 'none' }}>
                      <canvas
                        ref={canvasRef}
                        className="w-full h-[438px] block"
                        style={{ touchAction: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
                      />
                      {/* faint ruled lines */}
                      <div className="pointer-events-none absolute inset-0 opacity-[0.20]" style={{
                        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 38px, rgba(156,132,106,0.9) 38px 39px)`
                      }} />
                      <div className="pointer-events-none absolute top-3 right-4 text-[11px] text-stone-400">السبورة التفاعلية</div>
                    </div>
                  </div>

                  {/* Tools */}
                  <div className="mt-3 bg-white rounded-[24px] border border-stone-200 shadow-[0_10px_26px_rgba(62,43,22,0.09)] px-4 pt-3 pb-4">
                    {/* Pen mode */}
                    <div className="flex items-center gap-2 mb-3">
                      <label className="text-[12.6px] text-stone-600 whitespace-nowrap">الأداة</label>
                      <select
                        value={penMode}
                        onChange={e=>{ setPenMode(e.target.value as any); setEraserOn(false); }}
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-[13.2px] text-stone-800 outline-none focus:border-stone-300"
                      >
                        <option value="pen">🖋️ قلم عادي</option>
                        <option value="calligraphy">✒️ خط عربي</option>
                        <option value="highlighter">🖍️ قلم فسفوري</option>
                      </select>
                      <button
                        onClick={() => {
                          setEraserOn(v => !v);
                          if (!eraserOn && brushSize < 10) setBrushSize(22);
                          if (eraserOn && brushSize > 15) setBrushSize(6);
                        }}
                        className={`px-3.5 py-[10px] text-[12.9px] rounded-xl border transition ${eraserOn ? 'bg-rose-600 text-white border-rose-600' : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'}`}
                      >
                        {eraserOn ? 'الممسحة ✓' : 'الممسحة'}
                      </button>
                    </div>

                    {!eraserOn && penMode !== 'highlighter' && (
                      <div className="flex items-center gap-[10px] mb-3 flex-wrap">
                        {inkColors.map(c => (
                          <button key={c}
                            onClick={()=>setInkColor(c)}
                            className={`w-7 h-7 rounded-full border-2 transition ${inkColor===c ? 'border-stone-800 scale-110':'border-white shadow'}`}
                            style={{ background: c }}
                            aria-label={`ink ${c}`}
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[12.3px] text-stone-600 mb-1">
                          <span>{sizeConfig.label}</span>
                          <span className="text-stone-500">{brushSize}px</span>
                        </div>
                        <input
                          id="brushThickness"
                          type="range"
                          min={sizeConfig.min}
                          max={sizeConfig.max}
                          value={Math.min(Math.max(brushSize, sizeConfig.min), sizeConfig.max)}
                          onChange={e=>setBrushSize(parseInt(e.target.value, 10))}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={undo}
                        disabled={!canUndo}
                        className={`flex-1 py-2.5 rounded-xl text-[13.3px] border transition ${canUndo ? 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700':'bg-stone-50 border-stone-100 text-stone-400'}`}
                      >
                        ↩️ تراجع
                      </button>
                      <button
                        onClick={redo}
                        disabled={!canRedo}
                        className={`flex-1 py-2.5 rounded-xl text-[13.3px] border transition ${canRedo ? 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700':'bg-stone-50 border-stone-100 text-stone-400'}`}
                      >
                        ↪️ تقدم
                      </button>
                      <button
                        onClick={clearCanvas}
                        className="px-4 py-2.5 rounded-xl text-[13.2px] bg-stone-900 text-white hover:bg-black transition"
                      >
                        🧼 مسح الكل
                      </button>
                    </div>

                    <div className="mt-2.5 text-[11.5px] text-stone-500 text-center">
                      اللمس محسّن بالكامل — touch-action: none • بدون تمرير أو تجمّد على iOS/Android
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Bottom nav */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="mx-3 mb-3 bg-white/95 backdrop-blur rounded-[26px] shadow-[0_10px_34px_rgba(46,30,18,0.18)] border border-stone-200 px-3 py-2 flex items-center justify-around">
                {[
                  { id: 'dictionary', label: 'القاموس', icon: '🔍' },
                  { id: 'lab', label: 'المختبر', icon: '🧪' },
                  { id: 'board', label: 'السبورة', icon: '✍️' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={()=>setActiveTab(t.id as any)}
                    className={`flex flex-col items-center justify-center min-w-[90px] py-2.5 rounded-[18px] transition-all ${
                      activeTab === t.id ? 'text-[#de5125]' : 'text-stone-500'
                    }`}
                  >
                    <span className="text-[20px]">{t.icon}</span>
                    <span className={`text-[12.2px] mt-0.5 ${activeTab === t.id ? 'font-[700]' : 'font-[500]'}`}>{t.label}</span>
                    {activeTab === t.id && <span className="w-9 h-[3px] rounded-full bg-[#e35b31] mt-1.5"></span>}
                  </button>
                ))}
              </div>
              <div className="flex justify-center pb-2">
                <div className="w-32 h-[5px] bg-stone-900/85 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="text-center text-[11.6px] text-stone-500 mt-4">
         تم انشاءه لغرض التعليم بواسطة سجاد البدر
          </div>
        </div>
      </div>
    </div>
  );
}
