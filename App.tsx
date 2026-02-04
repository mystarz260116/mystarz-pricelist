
import React, { useState, useCallback, useEffect } from 'react';
import { PriceListData, PriceCategory } from './types';
import { INITIAL_PRICE_DATA } from './constants';
import PriceListRenderer from './components/PriceListRenderer';
import { processMemoWithAI } from './services/geminiService';
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'DENTAL_PRICE_LIST_STORE_V3';

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {showGuide && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10 rounded-t-3xl">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">📖 ガイド</h2>
              <button onClick={() => setShowGuide(false)} className="text-2xl font-bold">×</button>
            </div>
            <div className="p-8 space-y-6">
              <section className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                <h3 className="font-black text-orange-700 mb-3">スマホでのPDF保存手順</h3>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal ml-4 font-bold">
                  <li>「PDF出力」ボタンをタップ</li>
                  <li>プレビューで「PDF形式で保存」を選択</li>
                  <li>右上の青い丸ボタン「PDF」をクリック</li>
                  <li>ダウンロードフォルダが表示される</li>
                  <li>右下の「保存」ボタンを押す</li>
                </ol>
              </section>
            </div>
            <div className="p-6 border-t text-center">
              <button onClick={() => setShowGuide(false)} className="w-full py-4 bg-gray-800 text-white rounded-xl font-black">閉じる</button>
            </div>
          </div>
        </div>
      )}

      {/* モバイル用ナビ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] flex shadow-lg no-print">
        <button onClick={() => setMobileViewMode('edit')} className={`flex-1 py-3 text-xs font-black ${mobileViewMode === 'edit' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}>✏️ 編集</button>
        <button onClick={() => setMobileViewMode('preview')} className={`flex-1 py-3 text-xs font-black ${mobileViewMode === 'preview' ? 'text-orange-600 bg-orange-50' : 'text-gray-400'}`}>📄 確認</button>
      </div>

      {/* サイドバー */}
      <div className={`no-print w-full md:w-1/3 bg-gray-100 border-r p-6 overflow-y-auto h-screen md:block ${mobileViewMode === 'preview' ? 'hidden' : 'block'} pb-24 md:pb-6`}>
        <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center">
          <img src="https://www.mystarz.co.jp/Mystarz%2dlogo.png" alt="MyStarz" className="h-8 object-contain" />
          <button onClick={() => setShowGuide(true)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full font-bold">?</button>
        </div>

        {/* 3つのボタンを横並び */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button onClick={handleSaveClinic} className="bg-emerald-600 text-white py-3 rounded-lg text-[10px] font-black active:scale-95 shadow-md">内容保存</button>
          <button onClick={handleExportExcel} className="bg-gray-800 text-white py-3 rounded-lg text-[10px] font-black active:scale-95 shadow-md">Excel出力</button>
          <button onClick={handlePrint} className="bg-orange-600 text-white py-3 rounded-lg text-[10px] font-black active:scale-95 shadow-md">PDF出力</button>
        </div>

        <div className="mb-8 bg-indigo-700 p-4 rounded-xl shadow-xl text-white">
          <label className="text-[10px] font-black mb-2 block text-indigo-200 uppercase tracking-widest">AI アシスタント</label>
          <textarea className="w-full bg-white/10 border-2 border-indigo-500 rounded-lg p-3 text-[11px] h-32 mb-3 outline-none placeholder-indigo-300" placeholder="医院名を〇〇に変更して... 等" value={memo} onChange={(e) => setMemo(e.target.value)} />
          <button onClick={handleUpdateMemo} disabled={isProcessing} className="w-full py-3 rounded-lg text-xs font-black bg-white text-indigo-800 active:scale-95">{isProcessing ? '処理中...' : 'AIで一括書き換え'}</button>
        </div>

        <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-sm mb-6">
          <h2 className="text-[10px] font-black text-gray-400 mb-4 tracking-widest border-b pb-1 uppercase">基本情報</h2>
          <div className="space-y-4">
            <input type="text" className="w-full border-2 rounded-lg px-3 py-2 text-sm font-black border-gray-100 outline-none focus:ring-2 focus:ring-blue-500" placeholder="歯科医院名" value={data.clinic.name} onChange={(e) => setData({...data, clinic: {...data.clinic, name: e.target.value}})} />
            <div className="grid grid-cols-2 gap-4">
              <select className="w-full border-2 rounded-lg px-3 py-2 text-xs border-gray-100 outline-none" value={data.clinic.representative} onChange={(e) => setData({...data, clinic: {...data.clinic, representative: e.target.value}})}>
                <option value="">担当者</option>
                {reps.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <input type="date" className="w-full border-2 rounded-lg px-3 py-2 text-xs border-gray-100 outline-none" value={data.clinic.publishDate} onChange={(e) => setData({...data, clinic: {...data.clinic, publishDate: e.target.value}})} />
            </div>
          </div>
        </div>

        {renderCategoryGroup("1. 保険技工物", insuranceCategories, "blue")}
        {renderCategoryGroup("2. 自費歯冠修復", privateCrownCategories, "green")}
        {renderCategoryGroup("3. インプラント", implantCategories, "orange")}
        {renderCategoryGroup("4. 自費義歯", privateDentureCategories, "orange")}
      </div>

      {/* プレビュー表示エリア */}
      <div className={`flex-1 bg-gray-900 md:bg-gray-300 overflow-y-auto print:overflow-visible print:bg-white h-screen print:h-auto md:block ${mobileViewMode === 'edit' ? 'hidden' : 'block'}`}>
        <div className="no-print sticky top-0 bg-white border-b-2 p-4 z-50 flex justify-between items-center shadow-md">
           <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1 rounded-full">仕上がりプレビュー</span>
           <button onClick={handlePrint} className="bg-orange-600 text-white px-6 py-2 rounded-full font-black text-xs active:scale-95">PDF保存・印刷</button>
        </div>

        <div className="mobile-preview-container">
          <PriceListRenderer data={data} />
        </div>
      </div>
    </div>
  );
};

export default App;
