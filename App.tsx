import React, { useState, useCallback, useEffect } from 'react';
import { PriceListData, PriceCategory } from './types';
import { INITIAL_PRICE_DATA } from './constants';
import PriceListRenderer from './components/PriceListRenderer';
import { processMemoWithAI } from './services/geminiService';
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'DENTAL_PRICE_LIST_STORE_V1';

const App: React.FC = () => {
  const [data, setData] = useState<PriceListData>(INITIAL_PRICE_DATA);
  const [memo, setMemo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEditor, setShowEditor] = useState(true);
  const [savedLists, setSavedLists] = useState<PriceListData[]>([]);

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
      alert('AIが価格表を更新しました！プレビューを確認してください。');
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
    if (!data.clinic.name || data.clinic.name === "歯科医院名をご入力ください") {
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
    if (confirm(`${clinicData.clinic.name} のデータを読み込みますか？現在の編集内容は破棄されます。`)) {
      setData(JSON.parse(JSON.stringify(clinicData)));
    }
  };

  const handleExportExcel = () => {
    if (savedLists.length === 0) {
      alert("保存されている医院データがありません。先に「保存」を行ってください。");
      return;
    }

    const wb = XLSX.utils.book_new();
    savedLists.forEach(clinicData => {
      const rows = clinicData.categories.flatMap(cat => 
        cat.items.map(item => ({
          'カテゴリー': cat.title,
          '項目名': item.name,
          '価格 (¥)': item.price
        }))
      );
      const ws = XLSX.utils.json_to_sheet(rows);
      const sheetName = clinicData.clinic.name.substring(0, 31).replace(/[\[\]\*\?\/\\]/g, "");
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, `歯科医院料金表一括データ_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderPriceInputs = (catId: string, itemIdx: number, price: string, themeColor: string) => {
    // 1. " / " (スペースありスラッシュ) で分割して複数カラムに対応
    const parts = price.split(' / ');
    
    const inputFocusClasses: {[key: string]: string} = {
      blue: 'focus:ring-blue-500 border-blue-200',
      green: 'focus:ring-emerald-500 border-emerald-200',
      orange: 'focus:ring-orange-500 border-orange-200',
    };

    const updatePart = (partIndex: number, newValue: string, suffix: string) => {
      const newParts = [...parts];
      newParts[partIndex] = newValue + suffix;
      handleManualPriceChange(catId, itemIdx, newParts.join(' / '));
    };

    return (
      <div className="flex items-center gap-1.5 flex-wrap justify-end">
        {parts.map((part, pIdx) => {
          // 2. 各パート内の「価格数字」と「単位などの文字」を分離
          // 数字、カンマ、～、- 以外の文字をサフィックス（単位）とみなす
          const match = part.match(/^([\d,～\-]*)(.*)$/);
          const value = match ? match[1] : part;
          const suffix = match ? match[2] : "";

          return (
            <React.Fragment key={pIdx}>
              <div className="flex items-center gap-0.5">
                <input
                  type="text"
                  className={`w-20 border rounded px-1.5 py-1 text-[11px] text-right transition-all outline-none focus:ring-2 bg-gray-50/50 hover:bg-white focus:bg-white ${inputFocusClasses[themeColor]}`}
                  value={value}
                  onChange={(e) => updatePart(pIdx, e.target.value, suffix)}
                />
                {suffix && <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap">{suffix}</span>}
              </div>
              {pIdx < parts.length - 1 && <span className="text-gray-300 font-bold text-[11px]">/</span>}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const insuranceCategories = data.categories.filter(c => 
    ['hoken-kan', 'hoken-cadcam', 'hoken-model-etc', 'hoken-gishi', 'hoken-hairetsu-kansei', 'hoken-gishi-options'].includes(c.id)
  );
  const privateCrownCategories = data.categories.filter(c => 
    ['zirconia-p4', 'emax-p4', 'mb-p4', 'hybrid-p4', 'metal-p4', 'model-p4', 'fiber-p4'].includes(c.id)
  );
  const implantCategories = data.categories.filter(c => c.id === 'implant');
  const privateDentureCategories = data.categories.filter(c => 
    ['private-gishi-basic', 'private-gishi-nonclasp', 'private-gishi-metal', 'private-gishi-options', 'private-gishi-others'].includes(c.id)
  );

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
                  <div key={idx} className="flex flex-col gap-1 group">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-gray-600 flex-1 truncate group-hover:text-gray-900 transition-colors">
                        {item.name}
                      </span>
                      {renderPriceInputs(cat.id, idx, item.price, themeColor)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-x-hidden">
      <div className={`no-print w-full md:w-1/3 bg-gray-100 border-r p-6 overflow-y-auto h-screen ${!showEditor ? 'hidden' : ''}`}>
        <div className="mb-6 border-b-2 border-gray-300 pb-4">
          <h1 className="text-xl font-bold text-gray-800 mb-1 italic">料金表 作成依頼</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sales Support System</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
           <button onClick={handleSaveClinic} className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-2 rounded-lg text-[11px] font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 transform active:scale-95">
            編集内容を保存
          </button>
          <button onClick={handleExportExcel} className="bg-gray-800 hover:bg-black text-white py-3 px-2 rounded-lg text-[11px] font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 transform active:scale-95">
            Excel一括出力
          </button>
        </div>

        <div className="mb-8 bg-indigo-700 p-5 rounded-xl shadow-xl border-2 border-indigo-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white p-1 rounded-full"><svg className="w-3 h-3 text-indigo-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg></div>
            <label className="text-[11px] font-black text-white uppercase tracking-widest">AI メモ一括反映</label>
          </div>
          <textarea className="w-full border-indigo-500 bg-white/10 text-white border-2 rounded-lg p-3 text-xs h-24 mb-4 focus:ring-2 focus:ring-white outline-none placeholder-indigo-200 shadow-inner" placeholder="例：ジルコニアKATANAを20000円に。担当者を鈴木に。など" value={memo} onChange={(e) => setMemo(e.target.value)} />
          <button onClick={handleUpdateMemo} disabled={isProcessing} className={`w-full py-3 rounded-lg text-xs font-black shadow-lg transition-all transform active:scale-95 ${isProcessing ? 'bg-indigo-300 text-indigo-500' : 'bg-white text-indigo-800 hover:bg-indigo-50 active:bg-indigo-100'}`}>
            {isProcessing ? '解析して反映中...' : 'AIで一括書き換え'}
          </button>
        </div>

        <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-md mb-8">
          <h2 className="text-[10px] font-black text-gray-400 mb-4 tracking-widest uppercase border-b-2 border-gray-50 pb-1">基本情報</h2>
          <div className="space-y-5 px-1">
            <div>
               <label className="block text-[10px] text-gray-500 font-bold mb-1 ml-1">歯科医院名</label>
               <input type="text" className="w-full border-2 rounded-lg px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none border-gray-100 bg-gray-50/30" value={data.clinic.name} onChange={(e) => setData({...data, clinic: {...data.clinic, name: e.target.value}})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold mb-1 ml-1">営業担当</label>
                <input type="text" className="w-full border-2 rounded-lg px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none border-gray-100 bg-gray-50/30" value={data.clinic.representative} onChange={(e) => setData({...data, clinic: {...data.clinic, representative: e.target.value}})} />
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-bold mb-1 ml-1">発行日</label>
                <input type="date" className="w-full border-2 rounded-lg px-4 py-3 text-xs focus:ring-2 focus:ring-blue-500 outline-none border-gray-100 bg-gray-50/30" value={data.clinic.publishDate} onChange={(e) => setData({...data, clinic: {...data.clinic, publishDate: e.target.value}})} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="py-2 border-t-2 border-gray-300"></div>
          {renderCategoryGroup("1. 保険技工物 料金表", insuranceCategories, "blue")}
          <div className="py-2 border-t-2 border-gray-300"></div>
          {renderCategoryGroup("2. 自費歯冠修復料金一覧", privateCrownCategories, "green")}
          <div className="py-2 border-t-2 border-gray-300"></div>
          {renderCategoryGroup("3. インプラント", implantCategories, "orange")}
          <div className="py-2 border-t-2 border-gray-300"></div>
          {renderCategoryGroup("4. 自費義歯料金一覧", privateDentureCategories, "orange")}
        </div>

        <div className="mt-10 mb-6 flex flex-col items-center">
           <button onClick={handleSaveClinic} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-2 rounded-xl text-sm font-black shadow-xl transition-all flex items-center justify-center gap-3 transform active:scale-95 border-b-4 border-emerald-800">
            医院データを保存する
          </button>
        </div>

        <div className="mt-12 pt-8 border-t-4 border-gray-300">
          <h2 className="text-xs font-black text-gray-800 mb-4 flex items-center gap-2 tracking-widest uppercase">
            保存済み医院リスト
          </h2>
          <div className="max-h-80 overflow-y-auto border-2 border-gray-200 rounded-xl bg-white shadow-inner">
            {savedLists.length === 0 ? (
              <div className="p-10 text-center text-[10px] text-gray-400 italic">保存された医院はありません</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {savedLists.map((list, i) => (
                  <li key={i} className="flex items-center justify-between p-4 hover:bg-emerald-50 cursor-pointer group transition-all" onClick={() => handleLoadClinic(list)}>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-gray-700 group-hover:text-emerald-800">{list.clinic.name}</span>
                      <span className="text-[10px] text-gray-400 font-serif tracking-tighter">{list.clinic.publishDate} / {list.clinic.representative}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className={`flex-1 relative bg-gray-300 overflow-y-auto print:overflow-visible print:bg-white h-screen print:h-auto ${showEditor ? '' : 'w-full'}`}>
        <div className="no-print sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-gray-200 p-4 z-50 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-5">
            <button onClick={() => setShowEditor(!showEditor)} className="px-6 py-3 bg-gray-100 hover:bg-white border-2 border-gray-300 rounded-lg text-xs font-black transition-all shadow-sm active:bg-gray-200 transform active:scale-95">
              {showEditor ? '← 入力パネルを閉じる' : '編集を開始する'}
            </button>
            <div className="flex flex-col">
               <span className="text-xs font-black text-gray-800 tracking-tighter uppercase italic leading-none">Price List Preview</span>
               <span className="text-[9px] text-gray-500 font-black tracking-widest">DENTAL LAB SYSTEM v1.0</span>
            </div>
          </div>
          <button onClick={handlePrint} className="bg-orange-600 text-white px-12 py-3.5 rounded-full shadow-2xl hover:bg-orange-700 font-black text-sm transition-all flex items-center gap-3 transform active:scale-95 hover:scale-105 border-b-4 border-orange-800">
            PDF印刷
          </button>
        </div>
        <div className="flex justify-center p-4 print:p-0 print:block">
          <PriceListRenderer data={data} />
        </div>
      </div>
    </div>
  );
};

export default App;