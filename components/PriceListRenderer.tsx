
import React from 'react';
import { PriceListData, PriceCategory } from '../types';

interface Props {
  data: PriceListData;
}

const PriceListRenderer: React.FC<Props> = ({ data }) => {
  const hokenCrowns = data.categories.find(c => c.id === 'hoken-kan');
  const hokenCadCam = data.categories.find(c => c.id === 'hoken-cadcam');
  const hokenModelEtc = data.categories.find(c => c.id === 'hoken-model-etc');
  const hokenDentures = data.categories.find(c => c.id === 'hoken-gishi');
  const hokenHairetsuKansei = data.categories.find(c => c.id === 'hoken-hairetsu-kansei');
  const hokenGishiOptions = data.categories.find(c => c.id === 'hoken-gishi-options');
  const implantCat = data.categories.find(c => c.id === 'implant');
  const zirconia = data.categories.find(c => c.id === 'zirconia-p4');
  const emax = data.categories.find(c => c.id === 'emax-p4');
  const mb = data.categories.find(c => c.id === 'mb-p4');
  const hybrid = data.categories.find(c => c.id === 'hybrid-p4');
  const metal = data.categories.find(c => c.id === 'metal-p4');
  const model = data.categories.find(c => c.id === 'model-p4');
  const fiber = data.categories.find(c => c.id === 'fiber-p4');
  const privateGishiBasic = data.categories.find(c => c.id === 'private-gishi-basic');
  const privateGishiNonclasp = data.categories.find(c => c.id === 'private-gishi-nonclasp');
  const privateGishiMetal = data.categories.find(c => c.id === 'private-gishi-metal');
  const privateGishiOptions = data.categories.find(c => c.id === 'private-gishi-options');
  const privateGishiOthers = data.categories.find(c => c.id === 'private-gishi-others');

  const formattedDate = data.clinic.publishDate.replace(/-/g, '/');

  const renderHeader = (title: string) => {
    if (title.includes('(材料代別)')) {
      const parts = title.split('(材料代別)');
      return (
        <span className="tracking-wider">
          {parts[0]}(材料代<span className="text-red-600 font-black">別</span>)
        </span>
      );
    }
    return <span className="tracking-wider">{title}</span>;
  };

  const sanitizeName = (name: string) => {
    let result = name.replace(/【.*?】\s*/g, '');
    result = result.includes('：') ? result.split('：')[1] : result;
    result = result.split(' (')[0];
    return result;
  };

  // 4ページ目専用の適度なゆとりを持つテーブル
  const CompactTable = ({ category, className = "" }: { category?: PriceCategory, className?: string }) => {
    if (!category) return null;
    return (
      <div className={`mb-3 ${className}`}>
        <div className="bg-[#047857] text-white px-3 py-1 text-[13px] font-black rounded-t shadow-sm flex justify-between items-center">
          {renderHeader(category.title)}
        </div>
        <div className="border-[2px] border-[#047857] bg-white overflow-hidden rounded-b shadow-sm">
          {category.items.map((item, idx) => (
            <div key={idx} className={`flex justify-between px-3 py-1 border-b border-[#f0fdf4] last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'}`}>
              <span className="flex-1 font-bold text-gray-800 truncate text-[11.2px] leading-tight">{sanitizeName(item.name)}</span>
              <span className="w-32 text-right font-black text-[#064e3b] whitespace-nowrap text-[11.2px] leading-tight">¥ {item.price}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const parseMultiPrice = (priceStr: string, index: number) => {
    const prices = priceStr.split('/').map(p => p.trim());
    return prices[index] || '-';
  };

  return (
    <div className="flex flex-col gap-0 items-center py-8 print:py-0 bg-gray-300 print:bg-white print:block min-h-screen print:min-h-0">
      
      {/* PAGE 1: FRONT COVER */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-10 flex flex-col items-center">
          <div className="w-full text-right text-[11px] text-gray-400 mb-1 font-black">発行日：{formattedDate}</div>
          <div className="w-full text-center border-y-[3px] border-gray-800 py-6 mb-8">
            <h1 className={`text-3xl font-black mb-1 ${!data.clinic.name ? 'text-gray-200 italic' : 'text-gray-800'}`}>
              {data.clinic.name || '歯科医院名をご入力ください'} 様
            </h1>
            <p className="text-xl font-black text-gray-700 tracking-[0.5em] mt-1">価格一覧表</p>
          </div>
          <div className="w-full flex justify-end mb-8">
            <div className="border-2 border-gray-400 px-6 py-2.5 text-base bg-white shadow-sm font-bold">
              営業担当: <span className="font-black underline underline-offset-4 px-4 text-xl">{data.clinic.representative || '　　　'}</span>
            </div>
          </div>
          <div className="w-full flex-1">
             {implantCat && (
               <div className="mb-4">
                 <div className="bg-[#ea580c] text-white px-6 py-2.5 text-lg font-black flex justify-between items-center rounded-t shadow-md">
                   <span className="tracking-[0.3em]">{implantCat.title}</span>
                 </div>
                 <div className="border-[3px] border-[#ea580c] bg-white overflow-hidden rounded-b shadow-lg">
                   {implantCat.items.map((item, idx) => (
                     <div key={idx} className={`flex justify-between px-6 py-1.5 text-[12.5px] border-b border-[#fff7ed] last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fff7ed]'}`}>
                       <span className="flex-1 font-bold text-gray-800 leading-tight">{sanitizeName(item.name)}</span>
                       <span className="w-48 text-right font-black text-[#9a3412] leading-tight">¥ {item.price}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
          <div className="w-full mt-auto border-t-2 border-gray-100 pt-6">
             <div className="flex items-center justify-center gap-6 mb-4">
               <img src="https://www.mystarz.co.jp/Mystarz%2dlogo.png" alt="Logo" className="h-10 object-contain" />
               <div className="text-blue-900 font-black text-2xl tracking-tighter whitespace-nowrap">TEL 072-691-7107</div>
             </div>
             <div className="text-center text-[11px] text-gray-700 font-bold mb-4 leading-relaxed">
               〒569-0806　高槻市明田町4-38 太陽ファルマテック株式会社内<br/><span className="text-lg font-black tracking-widest text-blue-900">FAX 072-691-7108</span>
             </div>
             <div className="w-full border-t-[2.5px] border-gray-800 pt-4 text-center">
               <div className="text-2xl font-black text-gray-800 tracking-[0.4em]">株式会社マイ・スターズ 大阪</div>
             </div>
             <div className="w-full bg-gray-800 text-white py-1.5 text-[10px] tracking-widest uppercase text-center mt-3 font-bold">MyStarz Dental Laboratory</div>
          </div>
        </div>
      </div>

      {/* PAGE 2: Insurance Prices (Fixed Overflow) */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-7 flex flex-col text-gray-800">
          <h2 className="text-[#1e40af] border-b-[4px] border-[#1e40af] mb-2.5 font-black text-2xl italic pb-1.5 tracking-widest uppercase">保険技工物 料金表</h2>
          
          <div className="flex flex-row gap-5 mb-3">
            <div className="w-1/2">
              <div className="bg-[#1e40af] text-white px-4 py-1.5 text-[14px] font-black mb-1 rounded-t shadow">保険冠</div>
              <div className="border-2 border-[#1e40af] bg-white rounded-b">
                {hokenCrowns?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between px-3 py-0.5 text-[11px] border-b border-[#eff6ff] last:border-0 font-bold">
                    <span className="text-gray-800 truncate">{sanitizeName(item.name)}</span>
                    <span className="font-black text-blue-900 whitespace-nowrap">¥{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 flex flex-col gap-3">
              <div>
                <div className="bg-[#1e40af] text-white px-4 py-1.5 text-[14px] font-black mb-1 rounded-t shadow">CAD/CAM冠</div>
                <div className="border-2 border-[#1e40af] bg-white rounded-b">
                  {hokenCadCam?.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-3 py-0.5 text-[11px] border-b border-[#eff6ff] last:border-0 font-bold">
                      <span className="text-gray-800 truncate">{sanitizeName(item.name)}</span>
                      <span className="font-black text-blue-900">¥{item.price}</span>
                    </div>
                  ))}
                  <div className="px-3 py-0.5 bg-[#f0f9ff] text-[9.5px] text-[#1e40af] border-t border-[#eff6ff] italic font-bold">※CAD/CAMは、すべて材料込みです。</div>
                </div>
              </div>
              <div>
                <div className="bg-[#1e40af] text-white px-4 py-1.5 text-[14px] font-black mb-1 rounded-t shadow">その他（保険）</div>
                <div className="border-2 border-[#1e40af] bg-white rounded-b">
                  {hokenModelEtc?.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-3 py-0.5 text-[11px] border-b border-[#eff6ff] last:border-0 font-bold">
                      <span className="text-gray-800">{sanitizeName(item.name)}</span>
                      <span className="font-black text-blue-900">¥{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-5 mb-3">
            <div className="w-1/2">
              <div className="bg-[#1e40af] text-white px-4 py-1.5 text-[14px] font-black mb-1 rounded-t shadow">保険義歯</div>
              <div className="border-2 border-[#1e40af] bg-white overflow-hidden rounded-b">
                {hokenDentures?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between px-3 py-0.5 text-[11px] border-b border-[#eff6ff] last:border-0 font-bold">
                    <span className="truncate pr-1 text-gray-800">{sanitizeName(item.name)}</span>
                    <span className="font-black text-blue-900 whitespace-nowrap">¥{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2">
              <div className="bg-[#1e40af] text-white px-4 py-1.5 text-[14px] font-black mb-1 rounded-t shadow">配列・完成 料金表</div>
              <table className="w-full text-[11px] border-collapse border-2 border-[#1e40af]">
                <thead className="bg-[#dbeafe] text-[9.5px]">
                  <tr>
                    <th className="border border-[#bfdbfe] p-1 text-left font-black">内容</th>
                    <th className="border border-[#bfdbfe] p-1 w-20 text-center font-black">レジン床</th>
                    <th className="border border-[#bfdbfe] p-1 w-20 text-center font-black">熱可塑</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-right font-bold text-[10.5px]">
                  {hokenHairetsuKansei?.items.map((item, i) => (
                    <tr key={i}>
                      <td className="text-left border border-[#eff6ff] px-2 py-0.5 bg-transparent text-gray-800">{sanitizeName(item.name)}</td>
                      <td className="border border-[#eff6ff] px-2 py-0.5 font-black text-blue-900">¥{parseMultiPrice(item.price, 0)}</td>
                      <td className="border border-[#eff6ff] px-2 py-0.5 font-black text-blue-900">¥{parseMultiPrice(item.price, 1)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#eff6ff]"><td colSpan={3} className="text-[9px] text-[#1e40af] text-left px-2 py-1 italic font-black">※再配列は、人工歯代が発生します。</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-0 flex-1">
            <div className="bg-[#1e40af] text-white px-4 py-1.5 text-[14px] font-black mb-1 rounded-t shadow">義歯オプション・修理等</div>
            <div className="border-2 border-[#1e40af] p-2 bg-white text-[10.5px] rounded-b">
               <div className="flex flex-row gap-6">
                  <div className="w-1/2 space-y-0.5">
                     {hokenGishiOptions?.items.slice(0, 7).map((item, idx) => (
                       <div key={idx} className="flex justify-between border-b border-[#eff6ff] font-bold">
                         <span className="text-gray-800">{sanitizeName(item.name)}</span>
                         <span className="font-black text-blue-900">¥{item.price}</span>
                       </div>
                     ))}
                  </div>
                  <div className="w-1/2 space-y-0.5">
                     {hokenGishiOptions?.items.slice(7, 14).map((item, idx) => (
                       <div key={idx} className="flex justify-between border-b border-[#eff6ff] font-bold">
                         <span className="text-gray-800">{sanitizeName(item.name)}</span>
                         <span className="font-black text-blue-900">¥{item.price}</span>
                       </div>
                     ))}
                  </div>
               </div>
               {hokenGishiOptions?.items[14] && (
                 <div className="mt-2 flex justify-center items-center gap-4 bg-[#eff6ff] p-1.5 rounded border border-blue-100">
                   <span className="font-black text-blue-900 text-[11px]">{sanitizeName(hokenGishiOptions.items[14].name)}</span>
                   <span className="font-black text-blue-900 text-[11px]">¥{hokenGishiOptions.items[14].price}</span>
                 </div>
               )}
            </div>
            <div className="mt-1.5 text-[10.5px] text-[#1e40af] font-black italic text-right px-1">
               ※再製時、技工料が発生する場合があります。
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 3: Private Dentures */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-8 flex flex-col text-gray-800 overflow-hidden">
          <h2 className="text-[#ea580c] border-b-[4px] border-[#ea580c] mb-4 font-black text-2xl italic tracking-[0.2em] pb-2 uppercase">自費義歯料金一覧</h2>
          
          <div className="mb-4">
            <div className="bg-[#ea580c] text-white px-4 py-1.5 text-[15px] font-black shadow rounded-t">自費義歯基本料（排列・完成）</div>
            <div className="flex flex-row gap-6 border-2 border-[#ea580c] bg-white p-2 rounded-b">
              <div className="w-1/2">
                <table className="w-full text-[11px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412] font-black"><tr><th className="border border-[#fed7aa] px-3 py-1.5 text-left">内容（排列）</th><th className="border border-[#fed7aa] px-3 py-1.5 text-right w-24">料金</th></tr></thead>
                  <tbody className="bg-white font-bold">
                    {privateGishiBasic?.items.slice(0, 5).map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : ""}>
                        <td className="border border-[#fed7aa] px-3 py-1 text-gray-800">{sanitizeName(item.name)}</td>
                        <td className="border border-[#fed7aa] px-3 py-1 text-right font-black text-orange-900">¥{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-1/2">
                <table className="w-full text-[11px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412] font-black"><tr><th className="border border-[#fed7aa] px-3 py-1.5 text-left">内容（完成）</th><th className="border border-[#fed7aa] px-3 py-1.5 text-right w-24">料金</th></tr></thead>
                  <tbody className="bg-white font-bold">
                    {privateGishiBasic?.items.slice(5, 10).map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : ""}>
                        <td className="border border-[#fed7aa] px-3 py-1 text-gray-800">{sanitizeName(item.name)}</td>
                        <td className="border border-[#fed7aa] px-3 py-1 text-right font-black text-orange-900">¥{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-[#ea580c] text-white px-4 py-1.5 text-[15px] font-black shadow rounded-t">ノンクラスプ（エステ・TUM）</div>
            <div className="flex flex-row gap-6 border-2 border-[#ea580c] bg-white p-2 rounded-b">
              <div className="w-1/2">
                <table className="w-full text-[11px] border-collapse">
                  <thead className="bg-[#fff7ed] text-[#9a3412] font-black border-b border-[#fed7aa]"><tr><th colSpan={2} className="px-3 py-1.5 text-left text-[12px]">エステショット / バイオプラスト</th></tr></thead>
                  <tbody className="bg-white">
                    {privateGishiNonclasp?.items.slice(0, 6).map((item, i) => (
                      <tr key={i} className={`font-black ${i % 2 !== 0 ? 'bg-[#fffbf0] text-[10px]' : ''}`}>
                        <td className={`border-b border-[#ffedd5] px-3 py-1 ${i % 2 !== 0 ? 'pl-6 italic text-[#9a3412]' : 'text-gray-800'}`}>{sanitizeName(item.name)}</td>
                        <td className={`border-b border-[#ffedd5] px-3 py-1 text-right ${i % 2 !== 0 ? 'text-orange-700' : 'text-orange-900'}`}>¥{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-1/2">
                <table className="w-full text-[11px] border-collapse">
                  <thead className="bg-[#fff7ed] text-[#9a3412] font-black border-b border-[#fed7aa]"><tr><th colSpan={2} className="px-3 py-1.5 text-left text-[12px]">TUM (熱可塑性樹脂)</th></tr></thead>
                  <tbody className="bg-white">
                    {privateGishiNonclasp?.items.slice(6, 12).map((item, i) => (
                      <tr key={i} className={`font-black ${i % 2 !== 0 ? 'bg-[#fffbf0] text-[10px]' : ''}`}>
                        <td className={`border-b border-[#ffedd5] px-3 py-1 ${i % 2 !== 0 ? 'pl-6 italic text-[#9a3412]' : 'text-gray-800'}`}>{sanitizeName(item.name)}</td>
                        <td className={`border-b border-[#ffedd5] px-3 py-1 text-right ${i % 2 !== 0 ? 'text-orange-700' : 'text-orange-900'}`}>¥{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-[#ea580c] text-white px-4 py-1.5 text-[15px] font-black shadow rounded-t">金属床 (コバルト / チタン / 貴金属)</div>
            <div className="flex flex-row gap-6 border-2 border-[#ea580c] bg-white p-2 rounded-b">
              <div className="w-1/2 pr-3 border-r border-[#fed7aa]">
                <table className="w-full text-[10px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412] border-b border-[#fed7aa] font-black">
                    <tr><th className="px-2 py-1.5 text-left">内容</th><th>Co</th><th>Ti</th><th>貴</th></tr>
                  </thead>
                  <tbody className="bg-white text-right font-black">
                    {privateGishiMetal?.items.slice(0, 2).map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : "border-b border-[#ffedd5]"}>
                        <td className="text-left px-3 py-1.5 font-black bg-[#fff7ed] text-orange-900 leading-tight">{sanitizeName(item.name)}</td>
                        <td className="px-1">¥{parseMultiPrice(item.price, 0)}</td>
                        <td className="px-1">¥{parseMultiPrice(item.price, 1)}</td>
                        <td className="px-1">¥{parseMultiPrice(item.price, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-1/2 pl-1">
                <table className="w-full text-[10px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412] border-b border-[#fed7aa] font-black">
                    <tr><th className="px-2 py-1.5 text-left">内容</th><th>Co</th><th>Ti</th><th>貴</th></tr>
                  </thead>
                  <tbody className="bg-white text-right font-black">
                    {privateGishiMetal?.items.slice(2, 4).map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : "border-b border-[#ffedd5]"}>
                        <td className="text-left px-3 py-1.5 font-black bg-[#fff7ed] text-orange-900 leading-tight">{sanitizeName(item.name)}</td>
                        <td className="px-1">¥{parseMultiPrice(item.price, 0)}</td>
                        <td className="px-1">¥{parseMultiPrice(item.price, 1)}</td>
                        <td className="px-1">¥{parseMultiPrice(item.price, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-auto mb-2 text-right text-[11px] text-[#9a3412] font-black italic pr-2 tracking-widest">※貴金属は材料代別途となります。</div>
        </div>
      </div>

      {/* PAGE 4: Private Crowns - Balanced Airy Layout */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-8 flex flex-col text-gray-800">
          <h2 className="text-[#065f46] border-b-[4px] border-[#065f46] mb-4 font-black text-2xl italic tracking-[0.2em] pb-2 uppercase">自費歯冠修復料金一覧</h2>
          
          <div className="flex flex-col flex-1">
            <CompactTable category={zirconia} />
            <CompactTable category={emax} />
            <CompactTable category={mb} />

            <div className="flex gap-6">
              <div className="w-1/2 flex flex-col">
                <CompactTable category={hybrid} />
                <CompactTable category={model} />
              </div>
              <div className="w-1/2 flex flex-col">
                <CompactTable category={metal} />
                <CompactTable category={fiber} />
              </div>
            </div>
          </div>
          <div className="mt-auto pt-3 text-right text-[11px] text-gray-500 font-bold italic border-t border-gray-100">
            ※材料代別の項目は、別途貴金属等の費用が発生します。
          </div>
        </div>
      </div>

    </div>
  );
};

export default PriceListRenderer;
