
import React, { useState, useCallback, useEffect } from 'react';
import { PriceListData, PriceCategory } from './types';
import { INITIAL_PRICE_DATA } from './constants';
import PriceListRenderer from './components/PriceListRenderer';
import { processMemoWithAI } from './services/geminiService';
import * as XLSX from 'xlsx';

// 保存キーは以前のデータを引き継ぐためV3を維持
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
    const storedV3 = localStorage.getItem('DENTAL_PRICE_LIST_STORE_V3');
    const storedV4 = localStorage.getItem('DENTAL_PRICE_LIST_STORE_V4');
    const stored = storedV3 || storedV4;
    
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
    // DOMの状態を確定させるために少し待機してから実行
    setTimeout(() => {
      window.print();
      setTimeout(() => setIsPrinting(false), 1000);
    }, 500);
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

  // 正確な営業マンリスト
  const reps = [
    "寺町", "小山", "竹内", "中澤", "枡田", "藤丸", "中西", "片山", "山本",
    "今井", "阪本", "熊懐", "川合", "山田", "松井", "平", "宮川"
  ];

  const aiPlaceholder = "「医院名を〇〇に変更して」\n「保険冠の料金を全部200円引きにして」\n「メタルボンド前歯臼歯18,000円にして」\n...等の指示を入力";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans relative">
      {/* モバイル用フッターナビ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] flex shadow-[0_-4px_15px_rgba(0,0,0,0.1)] no-print">
        <button onClick={() => setMobileViewMode('edit')} className={`flex-1 py-3 text-sm font-black flex flex-col items-center gap-1 ${mobileViewMode === 'edit' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}>
          <span>✏️ 入力編集</span>
        </button>
        <button onClick={() => setMobileViewMode('preview')} className={`flex-1 py-3 text-sm font-black flex flex-col items-center gap-1 ${mobileViewMode === 'preview' ? 'text-orange-600 bg-orange-50' : 'text-gray-400'}`}>
          <span>📄 仕上がり確認</span>
        </button>
      </div>

      {/* サイドバー */}
      <div className={`no-print w-full md:w-1/3 bg-gray-100 border-r p-6 overflow-y-auto h-screen md:block ${mobileViewMode === 'preview' ? 'hidden' : 'block'} pb-24 md:pb-6`}>
        <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <img src="https://www.mystarz.co.jp/Mystarz%2dlogo.png" alt="MyStarz" className="h-8 object-contain" />
          <button onClick={() => setShowGuide(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-[11px] font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95">
            <span className="text-base">?</span>
            <span>使い方ガイド</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          <button onClick={handleSaveClinic} className="bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black active:scale-95 shadow-md hover:bg-emerald-700 transition-all">内容保存</button>
          <button onClick={handleExportExcel} className="bg-gray-800 text-white py-3 rounded-xl text-[10px] font-black active:scale-95 shadow-md hover:bg-gray-900 transition-all">Excel出力</button>
          <button onClick={handlePrint} className="bg-orange-600 text-white py-3 rounded-xl text-[10px] font-black active:scale-95 shadow-md hover:bg-orange-700 transition-all">PDF保存・印刷</button>
        </div>

        <div className="mb-8 bg-indigo-700 p-5 rounded-2xl shadow-xl text-white">
          <label className="text-[10px] font-black mb-2 flex justify-between items-center text-indigo-200 uppercase tracking-widest">
            <span>AI アシスタント</span>
            <span className="text-[8px] opacity-70 font-bold">Gemini Flash Lite</span>
          </label>
          <textarea 
            className="w-full bg-white/10 border-2 border-indigo-500 rounded-xl p-3 text-[11px] h-32 mb-3 outline-none placeholder-indigo-300 leading-relaxed" 
            placeholder={aiPlaceholder}
            value={memo} 
            onChange={(e) => setMemo(e.target.value)} 
          />
          <button onClick={handleUpdateMemo} disabled={isProcessing} className="w-full py-3 rounded-xl text-xs font-black bg-white text-indigo-800 active:scale-95 hover:bg-gray-100 transition-all shadow-lg">{isProcessing ? '解析中...' : 'AIで一括書き換え'}</button>
        </div>

        <div className="bg-white p-5 rounded-2xl border-2 border-gray-200 shadow-sm mb-6">
          <h2 className="text-[10px] font-black text-gray-400 mb-4 tracking-widest border-b pb-1 uppercase">基本情報設定</h2>
          <div className="space-y-4">
            <div>
               <label className="block text-[9px] text-gray-400 font-black mb-1">歯科医院名</label>
               <input type="text" className="w-full border-2 rounded-xl px-4 py-3 text-sm font-black border-gray-100 outline-none focus:ring-2 focus:ring-blue-500" placeholder="歯科医院名を入力（「様」は自動で入ります）" value={data.clinic.name} onChange={(e) => setData({...data, clinic: {...data.clinic, name: e.target.value}})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] text-gray-400 font-black mb-1">担当者</label>
                <select className="w-full border-2 rounded-xl px-3 py-2.5 text-xs font-bold border-gray-100 outline-none appearance-none" value={data.clinic.representative} onChange={(e) => setData({...data, clinic: {...data.clinic, representative: e.target.value}})}>
                  <option value="">選択してください</option>
                  {reps.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[9px] text-gray-400 font-black mb-1">発行日</label>
                <input type="date" className="w-full border-2 rounded-xl px-3 py-2.5 text-xs font-bold border-gray-100 outline-none" value={data.clinic.publishDate} onChange={(e) => setData({...data, clinic: {...data.clinic, publishDate: e.target.value}})} />
              </div>
            </div>
          </div>
        </div>

        {renderCategoryGroup("1. 保険技工物 料金表", insuranceCategories, "blue")}
        {renderCategoryGroup("2. 自費歯冠修復 料金一覧", privateCrownCategories, "green")}
        {renderCategoryGroup("3. インプラント 料金表", implantCategories, "orange")}
        {renderCategoryGroup("4. 自費義歯 料金一覧", privateDentureCategories, "orange")}
      </div>

      {/* プレビューエリア */}
      <div className={`flex-1 bg-gray-900 md:bg-gray-300 overflow-y-auto print:!block print:overflow-visible print:bg-white h-screen print:h-auto md:block ${mobileViewMode === 'edit' ? 'hidden' : 'block'}`}>
        <div className="no-print sticky top-0 bg-white/95 backdrop-blur-md border-b-2 p-4 z-50 flex justify-between items-center shadow-lg">
           <div className="flex items-center gap-2">
             <button onClick={() => setMobileViewMode('edit')} className="md:hidden px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-[10px] font-black active:scale-95">← 戻る</button>
             <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full hidden md:block">仕上がりプレビュー（PDF出力イメージ）</span>
           </div>
           <button onClick={handlePrint} className="bg-orange-600 text-white px-8 py-3 rounded-full font-black text-xs active:scale-95 shadow-lg border-b-4 border-orange-800 transition-all">PDF保存・印刷</button>
        </div>

        <div className="preview-area-container py-4 md:py-8 print:p-0 print:block">
          <PriceListRenderer data={data} />
        </div>
      </div>

      {/* ヘルプガイドモーダル */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 no-print" onClick={() => setShowGuide(false)}>
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button className="absolute top-6 right-6 text-gray-400 hover:text-black font-black text-2xl" onClick={() => setShowGuide(false)}>×</button>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">?</div>
              <h2 className="text-2xl font-black">MyStarz 料金表作成ツール 使い方</h2>
            </div>
            
            <p className="mb-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl text-[12px] font-bold text-orange-900 leading-relaxed italic">
              ＜PC/タブレットでの作成を想定しています。スマホではレビューが見切れます。できるだけ拠点のPC/タブレットでご利用ください。＞
            </p>

            <div className="space-y-8">
              <section>
                <h3 className="text-sm font-black text-indigo-600 mb-3 uppercase tracking-widest border-b pb-1">ステップ1：情報の入力</h3>
                <div className="text-sm">
                  <p className="text-gray-600">設定パネルで「歯科医院名」（「様」は自動で付くため入力不要）を入力し「担当者」を選択します。入力内容は即座に反映されます。</p>
                  <p className="mt-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100 text-[11px] font-bold text-indigo-800">
                    💡 プレビュー（右側）へ反映（PC/タブレット）<br/>
                    💡 プレビュー（スクロール下）へ反映（スマホ）
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-black text-indigo-600 mb-3 uppercase tracking-widest border-b pb-1">ステップ2：価格の微調整</h3>
                <div className="text-sm">
                  <p className="text-gray-600">各カテゴリー毎に、直接フォームへ金額を入力します。AIアシスタントにまとめて「全体を1割増しにして」のように指示することも可能です。AIアシスタント操作がポンコツ（細かい指示は時間がかかります）でうまくいかない場合は、各フォームから入力してください。</p>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-black text-indigo-600 mb-3 uppercase tracking-widest border-b pb-1">ステップ3：作成データの保存</h3>
                <div className="text-sm">
                  <p className="text-gray-600">PDFを作成、保存する前に、内容保存ボタンを押して必ず作成データを保存してください。</p>
                </div>
              </section>

              <section className="bg-orange-50 p-6 rounded-3xl border-2 border-orange-200">
                <h3 className="text-sm font-black text-orange-700 mb-4 flex items-center gap-2">
                  <span>📄</span> PDF保存のコツ
                </h3>
                <div className="space-y-4 text-[13px] leading-relaxed text-orange-900">
                  <div className="bg-white/60 p-4 rounded-xl space-y-2 font-bold">
                    <p>① PDF保存・印刷ボタン</p>
                    <p>② PDF形式で保存（送信先を確認）</p>
                    <p>③ 右の青い丸「PDF」ボタンクリック</p>
                    <p>④ ダウンロードフォルダが表示される</p>
                    <p>⑤ 右下の保存ボタンを押す</p>
                  </div>
                  <div className="text-[12px] font-medium space-y-2">
                    <p className="bg-white p-2 rounded-lg border border-orange-200">
                      上記の作業で、スマホのダウンロードフォルダに保存されます。
                    </p>
                    <p className="text-red-700 font-black">
                      ※スマホから直接印刷はできません。
                    </p>
                    <p className="text-gray-700">
                      印刷が必要な場合は、営業用PCから印刷するか、保存したPDFをLINEWORKSなどで事務に送って依頼してください。
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <button className="w-full mt-10 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl active:scale-95" onClick={() => setShowGuide(false)}>理解しました</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
