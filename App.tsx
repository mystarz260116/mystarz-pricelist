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
  const [showEditor, setShowEditor] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
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
    if (confirm(`${clinicData.clinic.name} のデータを読み込みますか？`)) {
      setData(JSON.parse(JSON.stringify(clinicData)));
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
            return (
              <span key={sIdx} className="text-gray-400 font-black text-[11px] px-0.5">
                {seg.trim()}
              </span>
            );
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
              {suffix && (
                <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap bg-gray-100/50 px-1 rounded">
                  {suffix}
                </span>
              )}
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
                    <span className="text-[10px] text-gray-600 flex-1 truncate group-hover:text-gray-900 transition-colors">
                      {item.name}
                    </span>
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

  const samplePrompts = [
    { label: "価格を特定変更", text: "KATANAを20000円、レイヤリングを28000円に変更して" },
    { label: "一律値上げ", text: "保険冠の項目をすべて一律100円値上げして" },
    { label: "医院/担当者変更", text: "担当者を寺町さんに変更して、発行日を明日に設定" }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-x-hidden">
      {/* 使い方ガイドモーダル */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10 rounded-t-3xl">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                使い方ガイド <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-400">Ver. 2.0</span>
              </h2>
              <button onClick={() => setShowGuide(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-2xl font-bold transition-transform active:scale-90">×</button>
            </div>
            <div className="p-8 space-y-10">
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-md">1</div>
                  <h3 className="font-bold text-gray-800 text-lg">金額の修正方法（手動）</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed pl-11">
                  項目ごとの金額をクリックすると直接入力できます。<br/>
                  <span className="font-bold text-blue-600">「3,000 ～ 8,000」</span>や<br/>
                  <span className="font-bold text-blue-600">「2,500 / １箇所」</span>のような単位付きも、数字の部分だけを書き換えるだけで自動で反映されます。
                </p>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md">2</div>
                  <h3 className="font-bold text-gray-800 text-lg">AIで一括書き換え 🤖</h3>
                </div>
                <div className="bg-indigo-50 rounded-2xl p-6 pl-11 ml-11 border border-indigo-100">
                  <p className="text-sm text-indigo-900 leading-relaxed mb-4 font-bold">
                    左パネルの青いボックスに「会話するように」指示を書くだけ！
                  </p>
                  <ul className="text-xs space-y-2 text-indigo-700 list-disc list-inside font-medium">
                    <li>「ジルコニアを全部2,000円値上げして」</li>
                    <li>「担当者を○○に変更して、日付は今日にして」</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md">3</div>
                  <h3 className="font-bold text-gray-800 text-lg">自分だけの「マイ・ツール」保存 📱</h3>
                </div>
                <div className="pl-11 space-y-3">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    <span className="font-bold text-emerald-700 underline decoration-2">「編集内容を保存」</span>を押すと、このツールを動かしている<span className="font-bold">「あなた自身のスマホ」</span>の中にデータが記憶されます。
                  </p>
                  <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-r-lg text-xs text-emerald-900 shadow-sm">
                    <p className="font-bold mb-1">✨ 事務に頼らなくてもOK！</p>
                    <p>データは社内サーバーや事務のPCには送信されません。<span className="font-bold">あなただけの専用管理ツール</span>です。現場で即座に過去データを呼び出し、自分自身で修正して最新の料金表を提示できます。</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold shadow-md">4</div>
                  <h3 className="font-bold text-gray-800 text-lg">印刷と配布のステップ 📄</h3>
                </div>
                <div className="pl-11 space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    スマホから直接印刷するのは難しいため、以下の流れがスムーズです。
                  </p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-white border-2 border-orange-100 p-4 rounded-xl shadow-sm">
                      <p className="text-xs font-black text-orange-600 mb-1">【方法A】事務に印刷を頼む</p>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        スマホで<span className="font-bold">「PDF印刷」</span>ボタンを押し、プレビュー画面から「共有（保存）」を選択。保存したPDFを<span className="font-bold text-blue-600">LINE WORKS等で事務の担当者に送り</span>、「印刷お願いします！」と伝えるだけ。
                      </p>
                    </div>
                    <div className="bg-white border-2 border-gray-100 p-4 rounded-xl shadow-sm">
                      <p className="text-xs font-black text-gray-400 mb-1">【方法B】PCで自分で印刷する</p>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        事務所のPCからこのURLを開き、スマホと同じ手順でデータを呼び出して、そのままプリンターから出力できます。
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <div className="p-6 bg-gray-50 text-center rounded-b-3xl">
              <button onClick={() => setShowGuide(false)} className="bg-gray-800 text-white px-12 py-3 rounded-full font-bold text-sm hover:bg-black transition-all shadow-xl active:scale-95">理解しました！</button>
            </div>
          </div>
        </div>
      )}

      <div className={`no-print w-full md:w-1/3 bg-gray-100 border-r p-6 overflow-y-auto h-screen ${!showEditor ? 'hidden' : ''}`}>
        <div className="mb-6 border-b-2 border-gray-300 pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-gray-800 mb-1 italic">料金表 作成依頼</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sales Support System</p>
          </div>
          <button 
            onClick={() => setShowGuide(true)} 
            className="flex flex-col items-center gap-0.5 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg transition-all border border-blue-200 shadow-sm transform active:scale-95"
          >
            <span className="text-lg font-bold leading-none">?</span>
            <span className="text-[8px] font-black">使い方</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <button onClick={handleSaveClinic} className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-2 rounded-lg text-[11px] font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 transform active:scale-95">編集内容を保存</button>
          <button onClick={handleExportExcel} className="bg-gray-800 hover:bg-black text-white py-3 px-2 rounded-lg text-[11px] font-bold shadow-lg transition-all flex items-center justify-center gap-1.5 transform active:scale-95">Excel一括出力</button>
        </div>

        {/* AI メモセクション */}
        <div className="mb-8 bg-indigo-700 p-5 rounded-xl shadow-xl border-2 border-indigo-800">
          <div className="flex justify-between items-center mb-3">
            <label className="text-[11px] font-black text-white uppercase tracking-widest block">AI メモ一括反映</label>
            <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded font-bold">Gemini 2.5 Flash</span>
          </div>
          
          <textarea 
            className="w-full border-indigo-500 bg-white/10 text-white border-2 rounded-lg p-3 text-xs h-32 mb-3 focus:ring-2 focus:ring-white outline-none placeholder-indigo-200 shadow-inner" 
            placeholder={"【入力例】\n・KATANAを20,000円、レイヤリングを28,000円にして\n・保険冠をすべて一律で100円値上げして\n・担当者を寺町さんに変えて、発行日を2月10日にして\n・自費義歯の基本料を10%安くして"} 
            value={memo} 
            onChange={(e) => setMemo(e.target.value)} 
          />
          
          <div className="flex flex-wrap gap-2 mb-4">
            {samplePrompts.map((p, i) => (
              <button 
                key={i} 
                onClick={() => setMemo(p.text)}
                className="text-[9px] bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded border border-indigo-400/50 transition-colors shadow-sm"
              >
                {p.label}
              </button>
            ))}
          </div>

          <button onClick={handleUpdateMemo} disabled={isProcessing} className={`w-full py-3 rounded-lg text-xs font-black shadow-lg transition-all transform active:scale-95 ${isProcessing ? 'bg-indigo-300 text-indigo-500 cursor-not-allowed' : 'bg-white text-indigo-800 hover:bg-indigo-50'}`}>
            {isProcessing ? 'AI解析中...' : 'AIで一括書き換え'}
          </button>
          <p className="text-[9px] text-indigo-200 mt-2 text-center font-medium">※会話するように指示するだけで価格表が更新されます。</p>
        </div>

        <div className="bg-white p-5 rounded-xl border-2 border-gray-200 shadow-md mb-8">
          <h2 className="text-[10px] font-black text-gray-400 mb-4 tracking-widest uppercase border-b-2 border-gray-50 pb-1">基本情報</h2>
          <div className="space-y-4">
            <div>
               <label className="block text-[10px] text-gray-500 font-bold mb-1 ml-1">歯科医院名</label>
               <input type="text" className="w-full border-2 rounded-lg px-3 py-2 text-sm font-bold border-gray-100 bg-gray-50/30 outline-none focus:ring-2 focus:ring-blue-500" value={data.clinic.name} onChange={(e) => setData({...data, clinic: {...data.clinic, name: e.target.value}})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-500 font-bold mb-1 ml-1">担当者</label>
                <select 
                  className="w-full border-2 rounded-lg px-3 py-2 text-xs border-gray-100 bg-gray-50/30 outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  value={data.clinic.representative}
                  onChange={(e) => setData({...data, clinic: {...data.clinic, representative: e.target.value}})}
                >
                  <option value="">担当者を選択</option>
                  <optgroup label="北浜営業">
                    <option value="寺町">寺町</option>
                    <option value="小山">小山</option>
                    <option value="竹内">竹内</option>
                    <option value="中澤">中澤</option>
                    <option value="枡田">枡田</option>
                    <option value="藤丸">藤丸</option>
                    <option value="中西">中西</option>
                    <option value="片山">片山</option>
                    <option value="山本">山本</option>
                  </optgroup>
                  <optgroup label="高槻営業">
                    <option value="今井">今井</option>
                    <option value="阪本">阪本</option>
                    <option value="熊懐">熊懐</option>
                    <option value="川合">川合</option>
                    <option value="山田">山田</option>
                    <option value="松井">松井</option>
                    <option value="平">平</option>
                    <option value="宮川">宮川</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-500 font-bold mb-1 ml-1">発行日</label>
                <input type="date" className="w-full border-2 rounded-lg px-3 py-2 text-xs border-gray-100 bg-gray-50/30 outline-none focus:ring-2 focus:ring-blue-500" value={data.clinic.publishDate} onChange={(e) => setData({...data, clinic: {...data.clinic, publishDate: e.target.value}})} />
              </div>
            </div>
          </div>
        </div>

        {renderCategoryGroup("1. 保険技工物 料金表", insuranceCategories, "blue")}
        {renderCategoryGroup("2. 自費歯冠修復料金一覧", privateCrownCategories, "green")}
        {renderCategoryGroup("3. インプラント", implantCategories, "orange")}
        {renderCategoryGroup("4. 自費義歯料金一覧", privateDentureCategories, "orange")}

        <div className="mt-12 pt-8 border-t-4 border-gray-300">
          <h2 className="text-xs font-black text-gray-800 mb-4 tracking-widest uppercase flex items-center gap-2">
            保存済み医院リスト <span className="text-[8px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded font-black tracking-normal">端末内保存</span>
          </h2>
          <div className="max-h-60 overflow-y-auto border-2 border-gray-200 rounded-xl bg-white shadow-inner">
            {savedLists.length === 0 ? (
              <div className="p-8 text-center text-[10px] text-gray-400">履歴なし</div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {savedLists.map((list, i) => (
                  <li key={i} className="p-3 hover:bg-emerald-50 cursor-pointer transition-colors" onClick={() => handleLoadClinic(list)}>
                    <div className="text-[11px] font-black text-gray-700">{list.clinic.name}</div>
                    <div className="text-[9px] text-gray-400 flex justify-between">
                      <span>{list.clinic.publishDate} / {list.clinic.representative}</span>
                      <span className="text-[8px] text-emerald-600 font-bold">読込可</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <p className="text-[9px] text-gray-400 mt-2 italic px-1">※履歴は現在使用中のブラウザにのみ表示されます。</p>
        </div>
      </div>

      <div className={`flex-1 relative bg-gray-300 overflow-y-auto print:overflow-visible print:bg-white h-screen print:h-auto`}>
        <div className="no-print sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-gray-200 p-4 z-50 flex justify-between items-center shadow-lg">
          <button onClick={() => setShowEditor(!showEditor)} className="px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-[10px] font-black shadow-sm transform active:scale-95 transition-all">
            {showEditor ? '← パネル閉じる' : '編集パネルを開く'}
          </button>
          <button onClick={() => window.print()} className="bg-orange-600 text-white px-10 py-3 rounded-full shadow-xl hover:bg-orange-700 font-black text-sm transition-all border-b-4 border-orange-800 active:border-b-0 active:translate-y-1">
            PDF出力・印刷
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