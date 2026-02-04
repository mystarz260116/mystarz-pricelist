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

  const CompactTable = ({ category, className = "" }: { category?: PriceCategory, className?: string }) => {
    if (!category) return null;
    return (
      <div className={`mb-3 ${className}`}>
        <div className="bg-[#047857] text-white px-3 py-1.5 text-[13px] font-black rounded-t-sm shadow-sm flex justify-between items-center border-b border-[#065f46]">
          {renderHeader(category.title)}
        </div>
        <div className="border-2 border-[#047857] bg-white overflow-hidden rounded-b-sm shadow-sm">
          {category.items.map((item, idx) => (
            <div key={idx} className={`flex justify-between px-3 py-1.5 text-[11.5px] border-b border-[#f0fdf4] last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'}`}>
              <span className="flex-1 font-bold text-gray-800 truncate">{sanitizeName(item.name)}</span>
              <span className="w-32 text-right font-black text-[#064e3b] whitespace-nowrap">¥ {item.price}</span>
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
        <div className="a4-page p-8 flex flex-col items-center">
          <div className="w-full text-right text-[11px] text-gray-500 mb-2 font-black">発行日：{formattedDate}</div>
          <div className="w-full text-center border-y-[3px] border-gray-800 py-6 mb-8">
            <h1 className={`text-3xl font-black mb-2 ${!data.clinic.name ? 'text-gray-200 italic' : 'text-gray-800'}`}>
              {data.clinic.name || '歯科医院名をご入力ください'} 様
            </h1>
            <p className="text-2xl font-black text-gray-700 tracking-[0.4em] mt-1">価格一覧表</p>
          </div>
          <div className="w-full flex justify-end mb-10">
            <div className="border-2 border-gray-400 px-8 py-3 text-lg bg-white shadow-sm font-bold">
              営業担当: <span className="font-black underline underline-offset-8 px-4 text-xl">{data.clinic.representative || '　　　'}</span>
            </div>
          </div>
          <div className="w-full flex-1 overflow-hidden mb-4">
             {implantCat && (
               <div className="mb-4">
                 <div className="bg-[#ea580c] text-white px-5 py-3 text-xl font-black flex justify-between items-center rounded-t shadow-md">
                   <span className="tracking-[0.2em]">{implantCat.title}</span>
                 </div>
                 <div className="border-[3px] border-[#ea580c] bg-white overflow-hidden rounded-b shadow-lg">
                   {implantCat.items.map((item, idx) => (
                     <div key={idx} className={`flex justify-between px-5 py-2 text-[13px] border-b border-[#fff7ed] last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fff7ed]'}`}>
                       <span className="flex-1 font-bold text-gray-800">{sanitizeName(item.name)}</span>
                       <span className="w-48 text-right font-black text-[#9a3412]">¥ {item.price}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
          <div className="w-full mt-auto border-t-2 border-gray-100 pt-8">
             <div className="flex items-center justify-center gap-8 mb-6">
               <img src="https://www.mystarz.co.jp/Mystarz%2dlogo.png" alt="Logo" className="h-14 object-contain" />
               <div className="text-blue-900 font-black text-3xl tracking-tighter whitespace-nowrap">TEL 072-691-7107</div>
             </div>
             <div className="text-center text-[13px] text-gray-700 font-bold mb-6 leading-relaxed">
               〒569-0806　高槻市明田町4-38 太陽ファルマテック株式会社内<br/><span className="text-lg font-black tracking-widest text-blue-900">FAX 072-691-7108</span>
             </div>
             <div className="w-full border-t-[3px] border-gray-800 pt-4 text-center">
               <div className="text-2xl font-black text-gray-800 tracking-[0.3em]">株式会社マイ・スターズ 大阪</div>
             </div>
             <div className="w-full bg-gray-800 text-white py-1.5 text-[11px] tracking-widest uppercase text-center mt-3 font-bold">MyStarz Dental Laboratory</div>
          </div>
        </div>
      </div>

      {/* PAGE 2: Insurance Prices */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-6 flex flex-col text-gray-800">
          <h2 className="text-[#1e40af] border-b-[5px] border-[#1e40af] mb-4 font-black text-3xl italic pb-2 tracking-widest uppercase">保険技工物 料金表</h2>
          
          <div className="flex flex-row gap-5 mb-3">
            <div className="w-1/2">
              <div className="bg-[#1e40af] text-white px-3 py-1.5 text-[15px] font-black mb-1 rounded-t-sm shadow">保険冠</div>
              <div className="border-2 border-[#1e40af] bg-white rounded-b-sm">
                {hokenCrowns?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between px-3 py-1 text-[11.5px] border-b border-[#eff6ff] last:border-0 font-bold">
                    <span className="text-gray-800">{sanitizeName(item.name)}</span>
                    <span className="font-black text-blue-900">¥{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 flex flex-col gap-3">
              <div>
                <div className="bg-[#1e40af] text-white px-3 py-1.5 text-[15px] font-black mb-1 rounded-t-sm shadow">CAD/CAM冠</div>
                <div className="border-2 border-[#1e40af] bg-white rounded-b-sm">
                  {hokenCadCam?.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-3 py-1 text-[11.5px] border-b border-[#eff6ff] last:border-0 font-bold">
                      <span className="text-gray-800">{sanitizeName(item.name)}</span>
                      <span className="font-black text-blue-900">¥{item.price}</span>
                    </div>
                  ))}
                  <div className="px-3 py-1 bg-[#f0f9ff] text-[10px] text-[#1e40af] border-t border-[#eff6ff] italic font-bold">※CAD/CAMは、すべて材料込みです。</div>
                </div>
              </div>
              <div>
                <div className="bg-[#1e40af] text-white px-3 py-1.5 text-[15px] font-black mb-1 rounded-t-sm shadow">その他（保険）</div>
                <div className="border-2 border-[#1e40af] bg-white rounded-b-sm">
                  {hokenModelEtc?.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-3 py-1.5 text-[11.5px] border-b border-[#eff6ff] last:border-0 font-bold">
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
              <div className="bg-[#1e40af] text-white px-3 py-1.5 text-[15px] font-black mb-1 rounded-t-sm shadow">保険義歯</div>
              <div className="border-2 border-[#1e40af] bg-white overflow-hidden rounded-b-sm">
                {hokenDentures?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between px-3 py-1 text-[11.5px] border-b border-[#eff6ff] last:border-0 font-bold">
                    <span className="truncate pr-1 text-gray-800">{sanitizeName(item.name)}</span>
                    <span className="font-black text-blue-900 whitespace-nowrap">¥{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2">
              <div className="bg-[#1e40af] text-white px-3 py-1.5 text-[15px] font-black mb-1 rounded-t-sm shadow">配列・完成 料金表</div>
              <table className="w-full text-[11px] border-collapse border-2 border-[#1e40af]">
                <thead className="bg-[#dbeafe] text-[10px]">
                  <tr>
                    <th className="border border-[#bfdbfe] p-1.5 text-left font-black">内容</th>
                    <th className="border border-[#bfdbfe] p-1.5 w-20 text-center font-black">レジン床</th>
                    <th className="border border-[#bfdbfe] p-1.5 w-20 text-center font-black">熱可塑</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-right font-bold">
                  {hokenHairetsuKansei?.items.map((item, i) => (
                    <tr key={i}>
                      <td className="text-left border border-[#eff6ff] px-2 py-1 bg-transparent text-gray-800">{sanitizeName(item.name)}</td>
                      <td className="border border-[#eff6ff] px-2 py-1 font-black text-blue-900">¥{parseMultiPrice(item.price, 0)}</td>
                      <td className="border border-[#eff6ff] px-2 py-1 font-black text-blue-900">¥{parseMultiPrice(item.price, 1)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#eff6ff]"><td colSpan={3} className="text-[10px] text-[#1e40af] text-left px-2 py-1.5 italic font-black">※再配列は、技工料・人工歯代が発生します。</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-1">
            <div className="bg-[#1e40af] text-white px-3 py-1.5 text-[15px] font-black mb-1 rounded-t-sm shadow">義歯オプション・修理等</div>
            <div className="border-2 border-[#1e40af] p-3 bg-white text-[11px] rounded-b-sm">
               <div className="flex flex-row gap-8">
                  <div className="w-1/2 space-y-1">
                     {hokenGishiOptions?.items.slice(0, 7).map((item, idx) => (
                       <div key={idx} className="flex justify-between border-b border-[#eff6ff] font-bold">
                         <span className="text-gray-800">{sanitizeName(item.name)}</span>
                         <span className="font-black text-blue-900">¥{item.price}</span>
                       </div>
                     ))}
                  </div>
                  <div className="w-1/2 space-y-1">
                     {hokenGishiOptions?.items.slice(7, 14).map((item, idx) => (
                       <div key={idx} className="flex justify-between border-b border-[#eff6ff] font-bold">
                         <span className="text-gray-800">{sanitizeName(item.name)}</span>
                         <span className="font-black text-blue-900">¥{item.price}</span>
                       </div>
                     ))}
                  </div>
               </div>
               {hokenGishiOptions?.items[14] && (
                 <div className="mt-2 flex justify-center items-center gap-6 bg-[#eff6ff] p-2 rounded border border-blue-100">
                   <span className="font-black text-blue-900 text-sm">{sanitizeName(hokenGishiOptions.items[14].name)}</span>
                   <span className="font-black text-blue-900 text-sm">¥{hokenGishiOptions.items[14].price}</span>
                 </div>
               )}
            </div>
            <div className="mt-2 text-[11px] text-[#1e40af] font-black italic text-right px-1">
               ※再製時、技工料が発生する場合があります。
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 3: Private Dentures */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-6 flex flex-col text-gray-800 overflow-hidden">
          <h2 className="text-[#ea580c] border-b-[5px] border-[#ea580c] mb-3 font-black text-2xl italic tracking-[0.2em] pb-2 uppercase">自費義歯料金一覧</h2>
          
          <div className="mb-3">
            <div className="bg-[#ea580c] text-white px-3 py-1.5 text-[14px] font-black shadow shadow-orange-200/50 rounded-t">自費義歯基本料（排列・完成）</div>
            <div className="flex flex-row gap-4 border-2 border-[#ea580c] bg-white p-2 rounded-b">
              <div className="w-1/2">
                <table className="w-full text-[11px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412] font-black"><tr><th className="border border-[#fed7aa] px-2 py-1.5 text-left">内容（排列）</th><th className="border border-[#fed7aa] px-2 py-1.5 text-right w-24">料金</th></tr></thead>
                  <tbody className="bg-white font-bold">
                    {privateGishiBasic?.items.slice(0, 5).map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : ""}>
                        <td className="border border-[#fed7aa] px-2 py-1.5 text-gray-800">{sanitizeName(item.name)}</td>
                        <td className="border border-[#fed7aa] px-2 py-1.5 text-right font-black text-orange-900">¥{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-1/2">
                <table className="w-full text-[11px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412] font-black"><tr><th className="border border-[#fed7aa] px-2 py-1.5 text-left">内容（完成）</th><th className="border border-[#fed7aa] px-2 py-1.5 text-right w-24">料金</th></tr></thead>
                  <tbody className="bg-white font-bold">
                    {privateGishiBasic?.items.slice(5, 10).map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : ""}>
                        <td className="border border-[#fed7aa] px-2 py-1.5 text-gray-800">{sanitizeName(item.name)}</td>
                        <td className="border border-[#fed7aa] px-2 py-1.5 text-right font-black text-orange-900">¥{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="bg-[#ea580c] text-white px-3 py-1.5 text-[14px] font-black shadow shadow-orange-200/50 rounded-t">ノンクラスプ（エステ・TUM）</div>
            <div className="flex flex-row gap-4 border-2 border-[#ea580c] bg-white p-2 rounded-b">
              <div className="w-1/2">
                <table className="w-full text-[10px] border-collapse">
                  <thead className="bg-[#fff7ed] text-[#9a3412] font-black border-b border-[#fed7aa]"><tr><th colSpan={2} className="px-2 py-2 text-left text-[11px]">エステショット / バイオプラスト</th></tr></thead>
                  <tbody className="bg-white">
                    {privateGishiNonclasp?.items.slice(0, 6).map((item, i) => (
                      <tr key={i} className={`font-black ${i % 2 !== 0 ? 'bg-[#fffbf0] text-[9.5px]' : ''}`}>
                        <td className={`border-b border-[#ffedd5] px-2 py-1.5 ${i % 2 !== 0 ? 'pl-5 italic text-[#9a3412]' : 'text-gray-800'}`}>{sanitizeName(item.name)}</td>
                        <td className={`border-b border-[#ffedd5] px-2 py-1.5 text-right ${i % 2 !== 0 ? 'text-orange-700' : 'text-orange-900'}`}>¥{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-1/2">
                <table className="w-full text-[10px] border-collapse">
                  <thead className="bg-[#fff7ed] text-[#9a3412] font-black border-b border-[#fed7aa]"><tr><th colSpan={2} className="px-2 py-2 text-left text-[11px]">TUM (熱可塑性樹脂)</th></tr></thead>
                  <tbody className="bg-white">
                    {privateGishiNonclasp?.items.slice(6, 12).map((item, i) => (
                      <tr key={i} className={`font-black ${i % 2 !== 0 ? 'bg-[#fffbf0] text-[9.5px]' : ''}`}>
                        <td className={`border-b border-[#ffedd5] px-2 py-1.5 ${i % 2 !== 0 ? 'pl-5 italic text-[#9a3412]' : 'text-gray-800'}`}>{sanitizeName(item.name)}</td>
                        <td className={`border-b border-[#ffedd5] px-2 py-1.5 text-right ${i % 2 !== 0 ? 'text-orange-700' : 'text-orange-900'}`}>¥{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="bg-[#ea580c] text-white px-3 py-1.5 text-[14px] font-black shadow shadow-orange-200/50 rounded-t">金属床 (コバルト / チタン / 貴金属)</div>
            <div className="flex flex-row gap-4 border-2 border-[#ea580c] bg-white p-2 rounded-b">
              <div className="w-1/2">
                <table className="w-full text-[9px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412] border-b border-[#fed7aa] font-black">
                    <tr><th className="px-1 py-1 text-left text-[10px]">内容</th><th>コバルト</th><th>チタン</th><th>貴金属</th></tr>
                  </thead>
                  <tbody className="bg-white text-right font-black">
                    {privateGishiMetal?.items.slice(0, 2).map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : "border-b border-[#ffedd5]"}>
                        <td className="text-left px-2 py-2 font-black bg-[#fff7ed] text-orange-900">{sanitizeName(item.name)}</td>
                        <td className="px-1">¥{parseMultiPrice(item.price, 0)}</td>
                        <td className="px-1">¥{parseMultiPrice(item.price, 1)}</td>
                        <td className="px-1">¥{parseMultiPrice(item.price, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-1/2">
                <table className="w-full text-[9px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412] border-b border-[#fed7aa] font-black">
                    <tr><th className="px-1 py-1 text-left text-[10px]">内容</th><th>コバルト</th><th>チタン</th><th>貴金属</th></tr>
                  </thead>
                  <tbody className="bg-white text-right font-black">
                    {privateGishiMetal?.items.slice(2, 4).map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : "border-b border-[#ffedd5]"}>
                        <td className="text-left px-2 py-2 font-black bg-[#fff7ed] text-orange-900">{sanitizeName(item.name)}</td>
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

          <div className="mb-3">
            <div className="bg-[#ea580c] text-white px-3 py-1.5 text-[14px] font-black shadow shadow-orange-200/50 rounded-t">自費オプション（鉤・バー・シリコン）</div>
            <div className="border-2 border-[#ea580c] bg-white p-2 rounded-b">
              <div className="flex flex-row gap-4 mb-1">
                <div className="w-1/2">
                  <table className="w-full text-[8.5px] border-collapse">
                    <thead className="bg-[#ffedd5] text-[#9a3412] border-b border-[#fed7aa] font-black">
                      <tr><th className="px-2 py-1 text-left">内容</th><th>コバルト</th><th>チタン</th><th>貴金属</th></tr>
                    </thead>
                    <tbody className="bg-white text-right font-black">
                      {privateGishiOptions?.items.slice(0, 5).map((item, i) => (
                        <tr key={i} className="border-b border-[#fff7ed]">
                          <td className="text-left px-2 py-1.5 text-gray-800">{sanitizeName(item.name)}</td>
                          <td className="px-1">¥{parseMultiPrice(item.price, 0)}</td>
                          <td className="px-1">¥{parseMultiPrice(item.price, 1)}</td>
                          <td className="px-1">¥{parseMultiPrice(item.price, 2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-[#fff7ed]">
                        <td className="text-left px-2 py-2 font-black text-orange-900">{sanitizeName(privateGishiOptions?.items[9]?.name || '')}</td>
                        <td colSpan={3} className="text-center font-black text-orange-900">¥{privateGishiOptions?.items[9]?.price}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="w-1/2">
                  <table className="w-full text-[8.5px] border-collapse">
                    <thead className="bg-[#ffedd5] text-[#9a3412] border-b border-[#fed7aa] font-black">
                      <tr><th className="px-2 py-1 text-left">内容</th><th>コバルト</th><th>チタン</th><th>貴金属</th></tr>
                    </thead>
                    <tbody className="bg-white text-right font-black">
                      {privateGishiOptions?.items.slice(5, 9).map((item, i) => (
                        <tr key={i} className="border-b border-[#fff7ed]">
                          <td className="text-left px-2 py-1.5 text-gray-800">{sanitizeName(item.name)}</td>
                          <td className="px-1">¥{parseMultiPrice(item.price, 0)}</td>
                          <td className="px-1">¥{parseMultiPrice(item.price, 1)}</td>
                          <td className="px-1">¥{parseMultiPrice(item.price, 2)}</td>
                        </tr>
                      ))}
                      <tr className="border-b border-[#fff7ed]">
                        <td className="text-left px-2 py-1.5 text-gray-800">{sanitizeName(privateGishiOptions?.items[10]?.name || '')}</td>
                        <td className="text-right px-1">¥{parseMultiPrice(privateGishiOptions?.items[10]?.price || '', 0)}</td>
                        <td className="text-center italic opacity-30">ー</td>
                        <td className="text-right px-1">¥{parseMultiPrice(privateGishiOptions?.items[10]?.price || '', 1)}</td>
                      </tr>
                      <tr className="bg-[#fff7ed] font-black">
                        <td className="text-left px-2 py-2 text-orange-900">特殊鉤・その他</td>
                        <td colSpan={3} className="text-center text-orange-900">お問い合わせください</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="text-[10px] text-[#9a3412] font-black italic text-right pr-2 tracking-widest mt-1">※貴金属は材料代別途となります。</div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex flex-row gap-4">
               <div className="w-1/2">
                 <div className="bg-[#ea580c] text-white px-3 py-1.5 text-[14px] font-black shadow shadow-orange-200/50 rounded-t">シリコン裏装加工</div>
                 <div className="border-2 border-[#ea580c] bg-white p-2 rounded-b text-[11px] space-y-1.5">
                   {privateGishiOthers?.items.slice(0, 4).map((item, idx) => (
                     <div key={idx} className="flex justify-between border-b border-[#fff7ed] pb-1 font-black last:border-0 last:pb-0">
                       <span className="text-gray-800">{sanitizeName(item.name)}</span>
                       <span className="text-orange-900">¥{item.price}</span>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="w-1/2">
                 <div className="bg-[#ea580c] text-white px-3 py-1.5 text-[14px] font-black shadow shadow-orange-200/50 rounded-t">その他（マウスガード等）</div>
                 <div className="border-2 border-[#ea580c] bg-white p-2 rounded-b text-[11px] space-y-3">
                   {privateGishiOthers?.items.slice(4, 6).map((item, idx) => (
                     <div key={idx} className="flex justify-between border-b border-[#fff7ed] pb-1 font-black last:border-0 last:pb-0">
                       <span className="text-gray-800">{sanitizeName(item.name)}</span>
                       <span className="text-orange-900">¥{item.price}</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 4: Private Crowns */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-6 flex flex-col text-gray-800">
          <h2 className="text-[#065f46] border-b-[5px] border-[#065f46] mb-4 font-black text-2xl italic tracking-[0.2em] pb-2 uppercase">自費歯冠修復料金一覧</h2>
          
          <div className="flex flex-col flex-1 overflow-hidden">
            <CompactTable category={zirconia} />
            <CompactTable category={emax} />
            <CompactTable category={mb} />

            <div className="flex gap-5">
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
        </div>
      </div>

    </div>
  );
};

export default PriceListRenderer;