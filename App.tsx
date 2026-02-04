
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
  const [showEditor, setShowEditor] = useState(true);
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

  const aiPlaceholderText = `【AIへの具体的な指示の見本】
・KATANAを20,000円、レイヤリングを28,000円に変更して
・保険冠の項目をすべて一律で200円値上げして
・ジルコニア全般を現在の価格から5%値上げして
・担当者を「小山」に変更し、発行日を2月20日に設定して
・医院名を「ひまわり歯科クリニック」にして
・自費義歯のすべての項目名の末尾に「(材料代別)」と追記して
・CAD/CAM冠の価格をすべて一律5,500円に書き換えて
・ジルアドバンスド以外の項目をすべて500円引きにして`;

  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-x-hidden bg-gray-100">
      {/* 使い方ガイドモーダル */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10 rounded-t-3xl">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <span className="text-2xl">📖</span> 使い方ガイド
              </h2>
              <button onClick={() => setShowGuide(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-2xl font-bold transition-transform active:scale-90 hover:bg-gray-200">×</button>
            </div>
            
            <div className="p-8 space-y-10">
              {/* AIアシスタント */}
              <section className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl">🤖</div>
                  <h3 className="text-lg font-black text-indigo-700">AIに丸投げして編集する</h3>
                </div>
                <div className="ml-4 space-y-3">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    左側の紫色の枠に「メモ」を書いてボタンを押すだけで、AIが価格表を自動更新します。
                  </p>
                  <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-xl shadow-sm">
                    <p className="text-[11px] font-black text-indigo-900 mb-2 uppercase tracking-wider">指示の出し方のコツ：</p>
                    <ul className="text-[12px] text-indigo-800 space-y-2 font-bold">
                      <li className="flex gap-2"><span>✅</span>「ジルコニアをすべて1,000円値上げして」</li>
                      <li className="flex gap-2"><span>✅</span>「医院名をマイ・スターズ歯科にして。担当は小山」</li>
                      <li className="flex gap-2"><span>✅</span>「CAD/CAMの材料費をすべて500円安くして」</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 直接編集 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">✏️</div>
                  <h3 className="text-lg font-black text-blue-700">細かい部分は手動で直す</h3>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    各項目の右側にある価格の数字（例: 15,000）を直接クリックすると、キーボードで修正できます。「/」や「～」で区切られた金額も、それぞれ個別に変更可能です。
                  </p>
                </div>
              </section>

              {/* 印刷・保存 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🖨️</div>
                  <h3 className="text-lg font-black text-orange-700">PDF保存・印刷（A4用紙2枚構成）</h3>
                </div>
                <div className="ml-4 space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    「PDF保存・印刷」ボタンを押すとプレビューが表示されます。送信先を「PDFに保存」に設定して保存してください。
                  </p>
                  <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl shadow-sm">
                    <p className="text-xs text-orange-900 font-black mb-3 border-b border-orange-200 pb-2 flex items-center gap-2">
                      <span>📄</span> 用紙2枚（両面印刷）の仕上がりイメージ
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-orange-100 shadow-sm">
                        <p className="text-[10px] font-black text-orange-800 mb-1">【1枚目】表・裏</p>
                        <p className="text-[9px] text-gray-500 leading-tight">表紙・インプラント ／<br/>保険技工物 料金表</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-orange-100 shadow-sm">
                        <p className="text-[10px] font-black text-orange-800 mb-1">【2枚目】表・裏</p>
                        <p className="text-[9px] text-gray-500 leading-tight">自費義歯料金一覧 ／<br/>自費歯冠修復料金一覧</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 保存機能 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-xl">💾</div>
                  <h3 className="text-lg font-black text-emerald-700">医院ごとのデータを残す</h3>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    「内容を保存」を押すと、作成したデータがブラウザに保存されます。次回、左下の「保存済み医院リスト」からクリックするだけで瞬時に呼び出せます。
                  </p>
                </div>
              </section>

              {/* 困ったときは */}
              <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200">
                <p className="text-xs text-gray-500 font-black flex items-center gap-2 mb-2">
                  <span>💡</span> 困ったときは...
                </p>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  表示が崩れたり、AIの動きがおかしい場合は、ページを再読み込み（リフレッシュ）してください。保存済みのデータは消えませんのでご安心ください。
                </p>
              </div>
            </div>

            <div className="p-8 border-t bg-gray-50 rounded-b-3xl text-center">
              <button onClick={() => setShowGuide(false)} className="w-full max-w-sm py-4 bg-gray-800 text-white rounded-xl font-black text-sm active:scale-95 transition-all shadow-xl hover:bg-gray-900">内容を理解しました！</button>
            </div>
          </div>
        </div>
      )}

      {/* モバイル用タブ切り替え（最下部固定） */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[60] flex shadow-[0_-4px_15px_rgba(0,0,0,0.1)] no-print">
        <button onClick={() => setMobileViewMode('edit')} className={`flex-1 py-3 text-sm font-black flex flex-col items-center gap-1 transition-all ${mobileViewMode === 'edit' ? 'text-blue-600 bg-blue-50' : 'text-gray-400'}`}>
          <span className="text-xl">✏️</span><span>編集</span>
        </button>
        <button onClick={() => setMobileViewMode('preview')} className={`flex-1 py-3 text-sm font-black flex flex-col items-center gap-1 transition-all ${mobileViewMode === 'preview' ? 'text-orange-600 bg-orange-50' : 'text-gray-400'}`}>
          <span className="text-xl">📄</span><span>確認・出力</span>
        </button>
      </div>

      <div className={`no-print w-full md:w-1/3 bg-gray-100 border-r p-6 overflow-y-auto h-screen md:block ${mobileViewMode === 'preview' ? 'hidden' : 'block'} pb-24 md:pb-6`}>
        <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-lg border border-gray-100 shadow-inner">
                <img src="https://www.mystarz.co.jp/Mystarz%2dlogo.png" alt="MyStarz Logo" className="h-8 object-contain" />
              </div>
              <h1 className="text-[13px] font-black text-gray-800 italic leading-tight">営業部用<br/>料金表 作成ツール</h1>
            </div>
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
          <textarea className="w-full bg-white/10 text-white border-2 border-indigo-500 rounded-lg p-3 text-[11px] h-48 mb-3 outline-none placeholder-indigo-300 leading-relaxed scrollbar-hide" placeholder={aiPlaceholderText} value={memo} onChange={(e) => setMemo(e.target.value)} />
          <button onClick={handleUpdateMemo} disabled={isProcessing} className={`w-full py-3 rounded-lg text-xs font-black bg-white text-indigo-800 active:scale-95 transition-all shadow-lg hover:bg-gray-100 ${isProcessing ? 'opacity-50' : ''}`}>
            {isProcessing ? 'AI解析中...' : 'AIで価格表を一括書き換え'}
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
                  <option value="寺町">寺町</option><option value="小山">小山</option><option value="竹内">竹内</option><option value="今井">今井</option><option value="松井">松井</option>
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

        <div className="mt-12 pt-8 border-t-2 border-gray-200 pb-12">
          <h2 className="text-xs font-black text-gray-800 mb-4 tracking-widest uppercase flex items-center justify-between">
            保存済み医院リスト
            <span className="text-[8px] bg-gray-100 px-2 py-0.5 rounded text-gray-400 font-bold">端末内保存</span>
          </h2>
          <div className="max-h-80 overflow-y-auto border-2 border-gray-200 rounded-xl bg-white shadow-inner">
            {savedLists.length === 0 ? <div className="p-8 text-center text-[10px] text-gray-400 font-bold">履歴がありません</div> : (
              <ul className="divide-y divide-gray-100">
                {savedLists.map((list, i) => (
                  <li key={i} className="group p-3 hover:bg-emerald-50 cursor-pointer transition-all flex justify-between items-center" onClick={() => handleLoadClinic(list)}>
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="text-[11px] font-black text-gray-700 truncate group-hover:text-emerald-800">{list.clinic.name}</div>
                      <div className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-2">
                        <span className="font-bold">{list.clinic.publishDate.replace(/-/g, '/')}</span>
                        <span className="opacity-30">|</span>
                        <span>担当: {list.clinic.representative || '未設定'}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button className="text-[9px] bg-emerald-600 text-white px-3 py-2 rounded font-black whitespace-nowrap shadow-sm group-hover:bg-emerald-500 transform group-active:scale-95 transition-all">編集読み込み</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 右メインエリア（プレビュー） */}
      <div className={`flex-1 relative bg-gray-900 md:bg-gray-300 overflow-y-auto print:overflow-visible print:bg-white h-screen print:h-auto md:block ${mobileViewMode === 'edit' ? 'hidden' : 'block'} pb-32 md:pb-0`}>
        <div className="no-print sticky top-0 bg-white/95 backdrop-blur-md border-b-2 border-gray-200 p-4 z-50 flex justify-between items-center shadow-lg">
          <div className="flex gap-2">
            <button onClick={() => setMobileViewMode('edit')} className="md:hidden px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-[10px] font-black shadow-sm active:scale-95">← 編集に戻る</button>
            <div className="hidden md:flex items-center px-4 bg-gray-50 rounded-lg border-2 border-gray-200">
              <span className="text-[10px] font-black text-gray-400">プレビュー（全4ページ）</span>
            </div>
          </div>
          <button onClick={handlePrint} disabled={isPrinting} className={`bg-orange-600 text-white px-8 md:px-12 py-3 rounded-full shadow-xl hover:bg-orange-700 font-black text-sm transition-all border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 ${isPrinting ? 'opacity-70' : ''}`}>
            {isPrinting ? 'PDF生成中...' : 'PDF保存・印刷'}
          </button>
        </div>

        <div className="flex flex-col items-center justify-start p-4 md:p-8 print:p-0 print:block">
          <div className="mobile-preview-container flex flex-col items-center gap-8 md:gap-12">
            <PriceListRenderer data={data} />
          </div>
        </div>
        
        <div className="no-print text-center text-gray-400 text-[10px] font-bold py-12 border-t border-white/10 mt-8">
          - 料金表の終端です -<br/>
          ( 下に何もない場合は、すべてのページが表示されています )
        </div>
      </div>
    </div>
  );
};

export default App;
