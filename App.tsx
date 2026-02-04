
import React, { useState, useCallback, useEffect } from 'react';
import { PriceListData, PriceCategory } from './types';
import { INITIAL_PRICE_DATA } from './constants';
import PriceListRenderer from './components/PriceListRenderer';
import { processMemoWithAI } from './services/geminiService';
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'DENTAL_PRICE_LIST_STORE_V2';

const App: React.FC = () => {
  const [data, setData] = useState<PriceListData>(INITIAL_PRICE_DATA);
  const [memo, setMemo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [savedLists, setSavedLists] = useState<PriceListData[]>([]);
  const [mobileViewMode, setMobileViewMode] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedLists(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load saved lists", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLists));
  }, [savedLists]);

  const handleUpdateMemo = async () => {
    if (!memo.trim()) return;
    setIsProcessing(true);
    try {
      const updated = await processMemoWithAI(memo, data);
      setData(updated);
      setMemo('');
      alert('AIが価格表を更新しました！');
    } catch (e) {
      alert('AI処理中にエラーが発生しました。');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualPriceChange = (catId: string, itemIdx: number, newFullPrice: string) => {
    const newData = { ...data };
    const cat = newData.categories.find(c => c.id === catId);
    if (cat) {
      cat.items[itemIdx].price = newFullPrice;
      setData(newData);
    }
  };

  const handleSaveClinic = () => {
    if (!data.clinic.name) {
      alert("医院名を入力してください。");
      return;
    }
    const existingIdx = savedLists.findIndex(l => l.clinic.name === data.clinic.name);
    const newSavedLists = [...savedLists];
    if (existingIdx >= 0) {
      newSavedLists[existingIdx] = data;
      alert(`${data.clinic.name} のデータを更新保存しました。`);
    } else {
      newSavedLists.push(data);
      alert(`${data.clinic.name} のデータを新規保存しました。`);
    }
    setSavedLists(newSavedLists);
  };

  const handleLoadClinic = (clinicData: PriceListData) => {
    if (confirm(`${clinicData.clinic.name} のデータを読み込みますか？`)) {
      setData(JSON.parse(JSON.stringify(clinicData)));
      setMobileViewMode('edit');
    }
  };

  const handleExportExcel = () => {
    if (savedLists.length === 0) {
      alert("先に保存を行ってください。");
      return;
    }
    const wb = XLSX.utils.book_new();
    savedLists.forEach(clinicData => {
      const rows = clinicData.categories.flatMap(cat => 
        cat.items.map(item => ({
          'カテゴリー': cat.title,
          '項目名': item.name,
          '価格': item.price
        }))
      );
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, clinicData.clinic.name.substring(0, 31));
    });
    XLSX.writeFile(wb, `歯科医院データ_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => setIsPrinting(false), 1000);
    }, 200);
  };

  const renderPriceInputs = (catId: string, itemIdx: number, price: string, themeColor: string) => {
    const segments = price.split(/(\s\/\s|～)/);
    const inputFocusClasses: {[key: string]: string} = {
      blue: 'focus:ring-blue-500 border-blue-200',
      green: 'focus:ring-emerald-500 border-emerald-200',
      orange: 'focus:ring-orange-500 border-orange-200',
    };

    const updateSegment = (segIdx: number, newVal: string, suffix: string) => {
      const newSegments = [...segments];
      newSegments[segIdx] = newVal + suffix;
      handleManualPriceChange(catId, itemIdx, newSegments.join(''));
    };

    return (
      <div className="flex items-center gap-1 flex-wrap justify-end">
        {segments.map((seg, sIdx) => {
          if (seg === ' / ' || seg === '～') {
            return <span key={sIdx} className="text-gray-400 font-black text-[11px] px-0.5">{seg.trim()}</span>;
          }
          const match = seg.match(/^([^0-9]*[\d,]+)(.*)$/);
          const value = match ? match[1] : seg;
          const suffix = match ? match[2] : "";
          return (
            <div key={sIdx} className="flex items-center gap-0.5">
              <input
                type="text"
                className={`w-20 border rounded px-1 py-1 text-[11px] text-right transition-all outline-none focus:ring-2 bg-gray-50/50 hover:bg-white focus:bg-white ${inputFocusClasses[themeColor]}`}
                value={value}
                onChange={(e) => updateSegment(sIdx, e.target.value, suffix)}
              />
              {suffix && <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap bg-gray-100/50 px-1 rounded">{suffix}</span>}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCategoryGroup = (title: string, categories: PriceCategory[], themeColor: string) => {
    if (categories.length === 0) return null;
    const colorClasses: {[key: string]: string} = {
      blue: 'border-blue-600 text-blue-800 bg-blue-50',
      green: 'border-emerald-600 text-emerald-800 bg-emerald-50',
      orange: 'border-orange-600 text-orange-800 bg-orange-50',
    };

    return (
      <div className="mb-6 bg-white shadow-sm rounded-lg border-2 border-gray-100 overflow-hidden">
        <div className={`flex items-center gap-2 py-3 px-4 border-l-8 ${colorClasses[themeColor]}`}>
          <h2 className="text-[13px] font-black tracking-widest">{title}</h2>
        </div>
        <div className="p-4 space-y-8 bg-white">
          {categories.map((cat) => (
            <div key={cat.id}>
              <h3 className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-tighter border-b-2 border-gray-100 pb-1 flex justify-between">
                <span className="bg-gray-100 px-2 rounded-t">{cat.title}</span>
              </h3>
              <div className="space-y-3">
                {cat.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 group">
                    <span className="text-[10px] text-gray-600 flex-1 truncate group-hover:text-gray-900 transition-colors">{item.name}</span>
                    {renderPriceInputs(cat.id, idx, item.price, themeColor)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const insuranceCategories = data.categories.filter(c => ['hoken-kan', 'hoken-cadcam', 'hoken-model-etc', 'hoken-gishi', 'hoken-hairetsu-kansei', 'hoken-gishi-options'].includes(c.id));
  const privateCrownCategories = data.categories.filter(c => ['zirconia-p4', 'emax-p4', 'mb-p4', 'hybrid-p4', 'metal-p4', 'model-p4', 'fiber-p4'].includes(c.id));
  const implantCategories = data.categories.filter(c => c.id === 'implant');
  const privateDentureCategories = data.categories.filter(c => ['private-gishi-basic', 'private-gishi-nonclasp', 'private-gishi-metal', 'private-gishi-options', 'private-gishi-others'].includes(c.id));

  const reps = ["寺町", "小山", "竹内", "今井", "松井", "佐藤", "田中", "鈴木", "高橋", "渡辺", "伊藤", "山本", "中村", "小林", "加藤"];

  const aiPlaceholderText = `【AIへの指示の例】
・医院名を「マイ・スターズ歯科」にして
・担当者を「寺町」に変更
・発行日を「2024年10月1日」にして
・ジルコニア全項目を500円値上げ
・インプラントの全項目を10%OFFにして`;

  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-x-hidden bg-gray-100">
      {showGuide && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10 rounded-t-3xl">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📖</span> 使い方・PDF出力ガイド
              </h2>
              <button onClick={() => setShowGuide(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-2xl font-bold hover:bg-gray-200">×</button>
            </div>
            
            <div className="p-8 space-y-10">
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl">🤖</div>
                  <h3 className="text-lg font-black text-indigo-700">AIに指示して一括編集</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed ml-4">
                  左側の紫色のAIアシスタント枠に「医院名」や「値上げ額」をメモしてボタンを押すだけで、全ページを自動更新します。
                </p>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🖨️</div>
                  <h3 className="text-lg font-black text-orange-700">正式なPDFを作成する手順</h3>
                </div>
                <div className="ml-4 space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed font-bold">
                    右上の「PDF保存・印刷」ボタンを押した後、以下の設定を確認してください。
                  </p>
                  <ol className="text-xs text-gray-600 space-y-3 list-decimal ml-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <li><span className="font-black">送信先：</span>「PDFに保存」を選択してください。</li>
                    <li><span className="font-black">詳細設定：</span>「背景のグラフィック」に必ずチェックを入れてください。</li>
                    <li><span className="font-black">印刷形式：</span>A4用紙2枚分が出力されます。</li>
                    <li><span className="font-black">両面印刷：</span>「両面印刷（長辺とじ）」を選択すると、2枚の表裏で4ページ構成になります。</li>
                  </ol>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">📄</div>
                  <h3 className="text-lg font-black text-blue-700">ページ構成（全4ページ）</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 ml-4">
                   <div className="bg-gray-50 p-3 rounded-lg border">
                     <p className="text-[10px] font-black mb-1">【1枚目】</p>
                     <p className="text-[9px]">表：表紙・インプラント</p>
                     <p className="text-[9px]">裏：保険技工物 料金表</p>
                   </div>
                   <div className="bg-gray-50 p-3 rounded-lg border">
                     <p className="text-[10px] font-black mb-1">【2枚目】</p>
                     <p className="text-[9px]">表：自費義歯 料金一覧</p>
                     <p className="text-[9px]">裏：自費歯冠修復 料金一覧</p>
                   </div>
                </div>
              </section>
            </div>

            <div className="p-8 border-t bg-gray-50 rounded-b-3xl text-center">
              <button onClick={() => setShowGuide(false)} className="w-full max-w-sm py-4 bg-gray-800 text-white rounded-xl font-black text-sm active:scale-95 shadow-xl hover:bg-gray-900">内容を理解しました</button>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] flex shadow-[0_-4px_15px_rgba(0,0,0,0.1)] no-print">
        <button onClick={() => setMobileViewMode('edit')} className={`flex-1 py-3 text-sm font-black flex flex-col items-center gap-1 transition-all ${mobileViewMode === 'edit' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}>
          <span className="text-xl">✏️</span><span>入力・編集</span>
        </button>
        <button onClick={() => setMobileViewMode('preview')} className={`flex-1 py-3 text-sm font-black flex flex-col items-center gap-1 transition-all ${mobileViewMode === 'preview' ? 'text-orange-600 bg-orange-50' : 'text-gray-400'}`}>
          <span className="text-xl">📄</span><span>仕上がり確認</span>
        </button>
      </div>

      <div className={`no-print w-full md:w-1/3 bg-gray-100 border-r p-6 overflow-y-auto h-screen md:block ${mobileViewMode === 'preview' ? 'hidden' : 'block'} pb-24 md:pb-6`}>
        <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg border border-gray-100 shadow-inner">
              <img src="https://www.mystarz.co.jp/Mystarz%2dlogo.png" alt="MyStarz Logo" className="h-8 object-contain" />
            </div>
            <h1 className="text-[13px] font-black text-gray-800 italic leading-tight">営業部用<br/>料金表 作成ツール</h1>
          </div>
          <button onClick={() => setShowGuide(true)} className="w-10 h-10 flex flex-col items-center justify-center bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-sm active:scale-90 hover:bg-blue-100 transition-all">
            <span className="text-lg font-bold">?</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <button onClick={handleSaveClinic} className="bg-emerald-600 text-white py-3 rounded-lg text-[11px] font-bold shadow-md active:scale-95 hover:bg-emerald-700 transition-colors">内容を保存</button>
          <button onClick={handleExportExcel} className="bg-gray-800 text-white py-3 rounded-lg text-[11px] font-bold shadow-md active:scale-95 hover:bg-gray-900 transition-colors">Excel出力</button>
        </div>

        <div className="mb-8 bg-indigo-700 p-5 rounded-xl shadow-xl">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-black text-indigo-100 tracking-widest uppercase">AI アシスタント</label>
            <span className="text-[8px] bg-indigo-800 text-indigo-300 px-2 py-0.5 rounded font-bold">Gemini Flash</span>
          </div>
          <textarea className="w-full bg-white/10 text-white border-2 border-indigo-500 rounded-lg p-3 text-[11px] h-40 mb-3 outline-none placeholder-indigo-300 leading-relaxed scrollbar-hide" placeholder={aiPlaceholderText} value={memo} onChange={(e) => setMemo(e.target.value)} />
          <button onClick={handleUpdateMemo} disabled={isProcessing} className={`w-full py-3 rounded-lg text-xs font-black bg-white text-indigo-800 active:scale-95 transition-all shadow-lg hover:bg-gray-100 ${isProcessing ? 'opacity-50' : ''}`}>
            {isProcessing ? 'AI解析中...' : 'AIで一括書き換え'}
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-md mb-8">
          <h2 className="text-[10px] font-black text-gray-400 mb-4 tracking-widest uppercase border-b-2 border-gray-50 pb-1">基本情報</h2>
          <div className="space-y-4">
            <div>
               <label className="block text-[10px] text-gray-500 font-bold mb-1 ml-1">歯科医院名</label>
               <input type="text" className="w-full border-2 rounded-lg px-3 py-2 text-sm font-bold border-gray-100 outline-none focus:ring-2 focus:ring-blue-500" placeholder="歯科医院名をご入力ください" value={data.clinic.name} onChange={(e) => setData({...data, clinic: {...data.clinic, name: e.target.value}})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold mb-1 ml-1">担当者</label>
                <select className="w-full border-2 rounded-lg px-3 py-2 text-xs border-gray-100 outline-none appearance-none" value={data.clinic.representative} onChange={(e) => setData({...data, clinic: {...data.clinic, representative: e.target.value}})}>
                  <option value="">選択</option>
                  {reps.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-bold mb-1 ml-1">発行日</label>
                <input type="date" className="w-full border-2 rounded-lg px-3 py-2 text-xs border-gray-100 outline-none" value={data.clinic.publishDate} onChange={(e) => setData({...data, clinic: {...data.clinic, publishDate: e.target.value}})} />
              </div>
            </div>
          </div>
        </div>

        {renderCategoryGroup("1. 保険技工物 料金表", insuranceCategories, "blue")}
        {renderCategoryGroup("2. 自費歯冠修復料金一覧", privateCrownCategories, "green")}
        {renderCategoryGroup("3. インプラント", implantCategories, "orange")}
        {renderCategoryGroup("4. 自費義歯料金一覧", privateDentureCategories, "orange")}
      </div>

      <div className={`flex-1 relative bg-gray-900 md:bg-gray-300 overflow-y-auto print:overflow-visible print:bg-white h-screen print:h-auto md:block ${mobileViewMode === 'edit' ? 'hidden' : 'block'} pb-32 md:pb-0`}>
        <div className="no-print sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-gray-200 p-4 z-50 flex justify-between items-center shadow-lg">
          <div className="flex gap-2">
            <button onClick={() => setMobileViewMode('edit')} className="md:hidden px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-[10px] font-black shadow-sm active:scale-95">← 入力に戻る</button>
            <div className="hidden md:flex items-center px-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <span className="text-[10px] font-black text-gray-400">仕上がりプレビュー</span>
            </div>
          </div>
          <button onClick={handlePrint} disabled={isPrinting} className={`bg-orange-600 text-white px-8 md:px-12 py-3 rounded-full shadow-xl hover:bg-orange-700 font-black text-sm transition-all border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 ${isPrinting ? 'opacity-70' : ''}`}>
            {isPrinting ? 'PDF生成中...' : 'PDF保存・印刷'}
          </button>
        </div>

        <div className="flex flex-col items-center justify-start p-4 md:p-8 print:p-0 print:block">
          <div className="mobile-preview-container flex flex-col items-center">
            <PriceListRenderer data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
