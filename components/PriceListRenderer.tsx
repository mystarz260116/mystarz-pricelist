
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
  
  const rawHokenOptions = data.categories.find(c => c.id === 'hoken-gishi-options')?.items || [];
  const solderItem = rawHokenOptions.find(item => item.name.includes('ロー着'));
  const filteredHokenOptions = rawHokenOptions.filter(item => !item.name.includes('ロー着'));

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
    <div className="flex flex-col gap-0 items-center py-0 print:block w-full">
      
      {/* PAGE 1: FRONT COVER & IMPLANT */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-12 flex flex-col h-full bg-white relative">
          <div className="w-full text-right text-[11px] text-gray-400 mb-6 font-black">発行日：{formattedDate}</div>
          
          <div className="w-full text-center border-y-[3px] border-gray-800 py-8 mb-8 mt-2">
            <h1 className={`text-2xl font-black mb-3 ${!data.clinic.name ? 'text-gray-200 italic' : 'text-gray-800'}`}>
              {data.clinic.name || '歯科医院名をご入力ください'} 様
            </h1>
            <p className="text-lg font-black text-gray-700 tracking-[0.8em] mt-2">価格一覧表</p>
          </div>

          <div className="w-full flex justify-end mb-8">
            <div className="border-[2px] border-gray-400 px-6 py-2.5 text-md bg-white shadow-sm font-bold flex items-center gap-4">
              営業担当: <span className="font-black underline underline-offset-8 text-xl px-2">{data.clinic.representative || '　　　'}</span>
            </div>
          </div>

          <div className="w-full flex-1">
             {implantCat && (
               <div className="mb-4">
                 <div className="bg-[#ea580c] text-white px-8 py-2.5 text-[15px] font-black flex justify-between items-center rounded-t shadow-md">
                   <span className="tracking-[0.4em]">{implantCat.title}</span>
                 </div>
                 <div className="border-[3px] border-[#ea580c] bg-white overflow-hidden rounded-b shadow-lg">
                   {implantCat.items.map((item, idx) => (
                     <div key={idx} className={`flex justify-between px-8 py-1 text-[10.5px] border-b border-[#fff7ed] last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fff7ed]'}`}>
                       <span className="flex-1 font-bold text-gray-800 leading-tight py-0.5">{sanitizeName(item.name)}</span>
                       <span className="w-40 text-right font-black text-[#9a3412] leading-tight text-[11px] py-0.5">¥ {item.price}</span>
                     </div>
                   ))}
                 </div>
                 <div className="mt-1.5 text-right text-[9px] text-[#9a3412] font-black italic px-2">
                   ※その他、ALL on 4、インプラントブリッジ等はお見積りさせて頂きます。
                 </div>
               </div>
             )}
          </div>
          
          {/* テキストベースの高品質フッター */}
          <div className="w-full mt-auto pt-8 pb-4">
             <div className="flex items-center justify-center gap-8 mb-2">
               <img src="https://www.mystarz.co.jp/Mystarz%2dlogo.png" alt="Logo" className="h-7 object-contain" />
               <div className="text-blue-900 font-black text-xl tracking-tighter whitespace-nowrap">TEL 072-691-7107</div>
             </div>
             <div className="text-center text-[9px] text-gray-500 font-bold mb-4 leading-relaxed">
               〒569-0806　高槻市明田町4-38 太陽ファルマテック株式会社内<br/>
               <span className="text-sm font-black tracking-widest text-blue-900">FAX 072-691-7108</span>
             </div>
             <div className="w-full border-t-[3px] border-gray-800 pt-2.5 text-center">
               <div className="text-xl font-black text-gray-800 tracking-tight">株式会社マイ・スターズ 大阪</div>
             </div>
          </div>
        </div>
      </div>

      {/* PAGE 2: 保険料金表 */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-6 flex flex-col text-gray-800">
          <h2 className="text-[#1e40af] border-b-[4px] border-[#1e40af] mb-2 font-black text-2xl italic pb-1 tracking-widest uppercase">保険技工物 料金表</h2>
          <div className="flex flex-row gap-5 mb-2">
            <div className="w-1/2">
              <div className="bg-[#1e40af] text-white px-3 py-1 text-[13.5px] font-black mb-0.5 rounded-t shadow">保険冠</div>
              <div className="border-2 border-[#1e40af] bg-white rounded-b">
                {hokenCrowns?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between px-3 py-0.5 text-[10.5px] border-b border-[#eff6ff] last:border-0 font-bold">
                    <span className="text-gray-800 truncate">{sanitizeName(item.name)}</span>
                    <span className="font-black text-blue-900 whitespace-nowrap">¥{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 flex flex-col gap-2">
              <div>
                <div className="bg-[#1e40af] text-white px-3 py-1 text-[13.5px] font-black mb-0.5 rounded-t shadow">CAD/CAM冠</div>
                <div className="border-2 border-[#1e40af] bg-white rounded-b">
                  {hokenCadCam?.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-3 py-0.5 text-[10.5px] border-b border-[#eff6ff] last:border-0 font-bold">
                      <span className="text-gray-800 truncate">{sanitizeName(item.name)}</span>
                      <span className="font-black text-blue-900">¥{item.price}</span>
                    </div>
                  ))}
                  <div className="px-3 py-0.5 bg-[#f0f9ff] text-[9px] text-[#1e40af] border-t border-[#eff6ff] italic font-bold">※CAD/CAMは、すべて材料込みです。</div>
                </div>
              </div>
              <div>
                <div className="bg-[#1e40af] text-white px-3 py-1 text-[13.5px] font-black mb-0.5 rounded-t shadow">その他（保険）</div>
                <div className="border-2 border-[#1e40af] bg-white rounded-b">
                  {hokenModelEtc?.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-3 py-0.5 text-[10.5px] border-b border-[#eff6ff] last:border-0 font-bold">
                      <span className="text-gray-800">{sanitizeName(item.name)}</span>
                      <span className="font-black text-blue-900">¥{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-5 mb-2">
            <div className="w-1/2">
              <div className="bg-[#1e40af] text-white px-3 py-1 text-[13.5px] font-black mb-0.5 rounded-t shadow">保険義歯</div>
              <div className="border-2 border-[#1e40af] bg-white overflow-hidden rounded-b">
                {hokenDentures?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between px-3 py-0.5 text-[10.5px] border-b border-[#eff6ff] last:border-0 font-bold">
                    <span className="truncate pr-1 text-gray-800">{sanitizeName(item.name)}</span>
                    <span className="font-black text-blue-900 whitespace-nowrap">¥{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2">
              <div className="bg-[#1e40af] text-white px-3 py-1 text-[13.5px] font-black mb-0.5 rounded-t shadow">配列・完成 料金表</div>
              <table className="w-full text-[10.5px] border-collapse border-2 border-[#1e40af]">
                <thead className="bg-[#dbeafe] text-[9px]">
                  <tr>
                    <th className="border border-[#bfdbfe] p-1 text-left font-black">内容</th>
                    <th className="border border-[#bfdbfe] p-1 w-20 text-center font-black">レジン床</th>
                    <th className="border border-[#bfdbfe] p-1 w-20 text-center font-black">熱可塑</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-right font-bold">
                  {hokenHairetsuKansei?.items.map((item, i) => (
                    <tr key={i}>
                      <td className="text-left border border-[#eff6ff] px-2 py-0.5 bg-transparent text-gray-800">{sanitizeName(item.name)}</td>
                      <td className="border border-[#eff6ff] px-2 py-0.5 font-black text-blue-900">¥{parseMultiPrice(item.price, 0)}</td>
                      <td className="border border-[#eff6ff] px-2 py-0.5 font-black text-blue-900">¥{parseMultiPrice(item.price, 1)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#f0f9ff]">
                    <td className="text-left border border-[#eff6ff] px-2 py-0.5 font-black text-[#1e40af]">{sanitizeName(solderItem?.name || 'ロー着(Co-Cr)')}</td>
                    <td colSpan={2} className="text-center border border-[#eff6ff] px-2 py-0.5 font-black text-blue-900 italic">
                      ¥ {solderItem?.price || '2,500/１箇所'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="mb-0 flex-1">
            <div className="bg-[#1e40af] text-white px-3 py-1 text-[13.5px] font-black mb-0.5 rounded-t shadow">義歯オプション・修理等</div>
            <div className="border-2 border-[#1e40af] p-2 bg-white text-[10px] rounded-b">
               <div className="flex flex-row gap-6">
                  <div className="w-1/2 space-y-0.5">
                     {filteredHokenOptions.slice(0, 7).map((item, idx) => (
                       <div key={idx} className="flex justify-between border-b border-[#eff6ff] font-bold">
                         <span className="text-gray-800 truncate pr-2">{sanitizeName(item.name)}</span>
                         <span className="font-black text-blue-900 whitespace-nowrap">¥{item.price}</span>
                       </div>
                     ))}
                  </div>
                  <div className="w-1/2 space-y-0.5">
                     {filteredHokenOptions.slice(7, 14).map((item, idx) => (
                       <div key={idx} className="flex justify-between border-b border-[#eff6ff] font-bold">
                         <span className="text-gray-800 truncate pr-2">{sanitizeName(item.name)}</span>
                         <span className="font-black text-blue-900 whitespace-nowrap">¥{item.price}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 3: 自費義歯料金一覧 */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-10 flex flex-col text-gray-800 bg-white overflow-hidden">
          <h2 className="text-[#ea580c] border-b-[5px] border-[#ea580c] mb-3 font-black text-2xl italic tracking-[0.3em] pb-2 uppercase">自費義歯料金一覧</h2>
          
          <div className="flex flex-row gap-4 mb-2">
            <div className="w-1/2">
              <div className="bg-[#ea580c] text-white px-4 py-1.5 text-[12px] font-black shadow-sm rounded-t">自費義歯排列料</div>
              <div className="border-[2px] border-[#ea580c] bg-white rounded-b overflow-hidden shadow-sm">
                {privateGishiBasic?.items.slice(0, 5).map((item, i) => (
                  <div key={i} className={`flex justify-between px-3 py-1.5 text-[10px] border-b border-[#fff7ed] last:border-0 font-bold ${i % 2 !== 0 ? 'bg-[#fff7ed]' : ''}`}>
                    <span className="text-gray-700">{sanitizeName(item.name)}</span>
                    <span className="text-orange-900 font-black">¥{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2">
              <div className="bg-[#ea580c] text-white px-4 py-1.5 text-[12px] font-black shadow-sm rounded-t">自費義歯完成料</div>
              <div className="border-[2px] border-[#ea580c] bg-white rounded-b overflow-hidden shadow-sm">
                {privateGishiBasic?.items.slice(5, 10).map((item, i) => (
                  <div key={i} className={`flex justify-between px-3 py-1.5 text-[10px] border-b border-[#fff7ed] last:border-0 font-bold ${i % 2 !== 0 ? 'bg-[#fff7ed]' : ''}`}>
                    <span className="text-gray-700">{sanitizeName(item.name)}</span>
                    <span className="text-orange-900 font-black">¥{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="bg-[#ea580c] text-white px-4 py-1.5 text-[12px] font-black shadow-sm rounded-t">{privateGishiNonclasp?.title}</div>
            <div className="flex flex-row gap-2 border-[2px] border-[#ea580c] bg-white p-3 rounded-b shadow-sm">
              <div className="w-1/2">
                <div className="text-[9px] font-black text-orange-800 border-b border-orange-100 mb-1.5 px-1 uppercase tracking-tighter bg-orange-50/50">エステショット / バイオプラスト</div>
                {privateGishiNonclasp?.items.slice(0, 6).map((item, i) => (
                  <div key={i} className={`flex justify-between px-2 py-1.5 text-[10px] font-black border-b border-[#fff7ed] last:border-0 ${i % 2 !== 0 ? 'text-orange-700 italic pl-4' : 'text-gray-800'}`}>
                    <span>{sanitizeName(item.name)}</span>
                    <span className="text-orange-900">¥{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="w-1/2 border-l-2 border-orange-50 pl-3">
                <div className="text-[9px] font-black text-orange-800 border-b border-orange-100 mb-1.5 px-1 uppercase tracking-tighter bg-orange-50/50">TUM</div>
                {privateGishiNonclasp?.items.slice(6, 12).map((item, i) => (
                  <div key={i} className={`flex justify-between px-2 py-1.5 text-[10px] font-black border-b border-[#fff7ed] last:border-0 ${i % 2 !== 0 ? 'text-orange-700 italic pl-4' : 'text-gray-800'}`}>
                    <span>{sanitizeName(item.name)}</span>
                    <span className="text-orange-900">¥{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="bg-[#ea580c] text-white px-4 py-1.5 text-[12px] font-black shadow-sm rounded-t">金属床 (コバルト / チタン / 貴金属)</div>
            <div className="border-[2px] border-[#ea580c] bg-white rounded-b overflow-hidden shadow-sm">
               <table className="w-full text-[10px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412] font-black border-b border-[#fed7aa]">
                    <tr><th className="px-4 py-2 text-left">内容</th><th className="w-20 text-center">コバルト</th><th className="w-20 text-center">チタン</th><th className="w-20 text-center">貴金属</th></tr>
                  </thead>
                  <tbody className="bg-white font-black text-right">
                    {privateGishiMetal?.items.map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : "border-b border-[#ffedd5]"}>
                        <td className="text-left px-4 py-2 text-orange-900">{sanitizeName(item.name)}</td>
                        <td className="px-2 text-gray-800">¥{parseMultiPrice(item.price, 0)}</td>
                        <td className="px-2 text-gray-800">¥{parseMultiPrice(item.price, 1)}</td>
                        <td className="px-2 text-gray-800">¥{parseMultiPrice(item.price, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>

          <div className="mb-2">
            <div className="bg-[#ea580c] text-white px-4 py-1.5 text-[12px] font-black shadow-sm rounded-t">{privateGishiOptions?.title}</div>
            <div className="border-[2px] border-[#ea580c] bg-white p-3 rounded-b shadow-sm">
              <div className="flex flex-row gap-4">
                <div className="w-1/2">
                  <table className="w-full text-[9px] border-collapse font-black">
                    <thead className="bg-[#ffedd5] text-[#9a3412] border-b border-[#fed7aa]">
                      <tr><th className="px-1 py-1.5 text-left">内容</th><th className="w-9">Co</th><th className="w-9">Ti</th><th className="w-9">貴</th></tr>
                    </thead>
                    <tbody className="text-right">
                      {privateGishiOptions?.items.slice(0, 6).map((item, i) => (
                        <tr key={i} className="border-b border-[#fff7ed]"><td className="text-left px-1 py-1.5 truncate">{sanitizeName(item.name)}</td><td>{parseMultiPrice(item.price, 0)}</td><td>{parseMultiPrice(item.price, 1)}</td><td>{parseMultiPrice(item.price, 2)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="w-1/2 border-l-2 border-orange-50 pl-5">
                  <table className="w-full text-[9px] border-collapse font-black">
                    <thead className="bg-[#ffedd5] text-[#9a3412] border-b border-[#fed7aa]">
                      <tr><th className="px-1 py-1.5 text-left">内容</th><th className="w-9">Co</th><th className="w-9">Ti</th><th className="w-9">貴</th></tr>
                    </thead>
                    <tbody className="text-right">
                      {privateGishiOptions?.items.slice(6, 11).map((item, i) => (
                        <tr key={i} className="border-b border-[#fff7ed]"><td className="text-left px-1 py-1.5 truncate">{sanitizeName(item.name)}</td><td>{parseMultiPrice(item.price, 0)}</td><td>{parseMultiPrice(item.price, 1)}</td><td>{parseMultiPrice(item.price, 2)}</td></tr>
                      ))}
                      <tr className="font-bold text-orange-900 bg-[#fff7ed]"><td className="text-left px-1 py-1.5">自費：トレー / 咬合床</td><td colSpan={3} className="text-center font-black">各 ¥2,500</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1">
            <div className="flex flex-row gap-6">
               <div className="w-1/2">
                 <div className="bg-[#ea580c] text-white px-4 py-1.5 text-[11px] font-black shadow-sm rounded-t">シリコン裏装加工</div>
                 <div className="border-[2px] border-[#ea580c] bg-white p-3 rounded-b text-[10px] space-y-1.5 font-black shadow-sm">
                   {privateGishiOthers?.items.slice(0, 4).map((item, idx) => (
                     <div key={idx} className="flex justify-between border-b border-[#fff7ed] last:border-0 py-1">
                       <span className="text-gray-700">{sanitizeName(item.name)}</span>
                       <span className="text-orange-900 font-black whitespace-nowrap">¥{item.price}</span>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="w-1/2">
                 <div className="bg-[#ea580c] text-white px-4 py-1.5 text-[11px] font-black shadow-sm rounded-t">その他・特記事項</div>
                 <div className="border-[2px] border-[#ea580c] bg-white p-3 rounded-b text-[10px] space-y-1.5 font-black shadow-sm flex flex-col min-h-[105px]">
                   {privateGishiOthers?.items.slice(4).map((item, idx) => (
                     <div key={idx} className="flex justify-between border-b border-[#fff7ed] last:border-0 py-1">
                       <span className="text-gray-700">{sanitizeName(item.name)}</span>
                       <span className="text-orange-900 font-black whitespace-nowrap">¥{item.price}</span>
                     </div>
                   ))}
                   <div className="mt-auto text-[8px] text-[#9a3412] italic pt-2 leading-tight border-t border-orange-50">
                     ※貴金属は材料代別途となります。<br/>
                     ※再製作・修理等についてはお気軽にご相談ください。
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 4: 自費歯冠修復料金一覧 */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-8 flex flex-col text-gray-800 h-full">
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
        </div>
      </div>
    </div>
  );
};

export default PriceListRenderer;
