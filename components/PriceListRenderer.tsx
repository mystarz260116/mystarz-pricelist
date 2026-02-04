
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

  const sanitizeName = (name: string) => {
    let result = name.replace(/【.*?】\s*/g, '');
    result = result.includes('：') ? result.split('：')[1] : result;
    result = result.split(' (')[0];
    return result;
  };

  const CompactTable = ({ category, className = "" }: { category?: PriceCategory, className?: string }) => {
    if (!category) return null;
    return (
      <div className={`mb-2.5 ${className}`}>
        <div className="bg-[#047857] text-white px-3 py-1 text-[13px] font-black rounded-t shadow-sm">
          {category.title}
        </div>
        <div className="border-[2px] border-[#047857] bg-white overflow-hidden rounded-b shadow-sm">
          {category.items.map((item, idx) => (
            <div key={idx} className={`flex justify-between px-3 py-0.5 border-b border-[#f0fdf4] last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'}`}>
              <span className="flex-1 font-bold text-gray-800 truncate text-[11px] leading-tight">{sanitizeName(item.name)}</span>
              <span className="w-32 text-right font-black text-[#064e3b] whitespace-nowrap text-[11px] leading-tight">¥ {item.price}</span>
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
      
      {/* PAGE 1: 表紙 & インプラント */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-12 flex flex-col h-full bg-white relative">
          <div className="w-full text-right text-[11px] text-gray-400 mb-6 font-black">発行日：{formattedDate}</div>
          <div className="w-full text-center border-y-[3px] border-gray-800 py-8 mb-8 mt-2">
            <h1 className="text-2xl font-black mb-3 text-gray-800">{data.clinic.name || '歯科医院名'} 様</h1>
            <p className="text-lg font-black text-gray-700 tracking-[0.8em] mt-2">価格一覧表</p>
          </div>
          <div className="w-full flex justify-end mb-8 font-bold">
            営業担当: <span className="font-black underline underline-offset-8 text-xl px-2">{data.clinic.representative || '　　　'}</span>
          </div>
          <div className="w-full flex-1">
             {implantCat && (
               <div className="mb-4">
                 <div className="bg-[#ea580c] text-white px-8 py-2.5 text-[15px] font-black rounded-t shadow-md tracking-[0.4em]">{implantCat.title}</div>
                 <div className="border-[3px] border-[#ea580c] bg-white rounded-b overflow-hidden">
                   {implantCat.items.map((item, idx) => (
                     <div key={idx} className={`flex justify-between px-8 py-0.5 text-[10.5px] border-b last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fff7ed]'} font-bold`}>
                       <span className="flex-1 truncate">{sanitizeName(item.name)}</span>
                       <span className="w-40 text-right font-black text-[#9a3412]">¥ {item.price}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
          <div className="w-full mt-auto text-center border-t-[3px] border-gray-800 pt-6">
             <div className="text-xl font-black text-gray-800">株式会社マイ・スターズ 大阪</div>
             <div className="text-[10px] text-gray-500 font-bold">TEL 072-691-7107 / FAX 072-691-7108</div>
          </div>
        </div>
      </div>

      {/* PAGE 2: 保険 */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-6 flex flex-col text-gray-800">
          <h2 className="text-[#1e40af] border-b-[4px] border-[#1e40af] mb-4 font-black text-2xl italic pb-1 uppercase tracking-widest">保険技工物 料金表</h2>
          <div className="flex gap-4 mb-4">
             <div className="w-1/2">
                <div className="bg-[#1e40af] text-white px-3 py-1 text-[13px] font-black rounded-t">保険冠</div>
                <div className="border-2 border-[#1e40af] bg-white rounded-b">
                   {hokenCrowns?.items.map((item, i) => (
                     <div key={i} className="flex justify-between px-3 py-0.5 text-[10px] border-b last:border-0 font-bold">
                       <span className="truncate">{sanitizeName(item.name)}</span>
                       <span className="font-black text-blue-900">¥{item.price}</span>
                     </div>
                   ))}
                </div>
             </div>
             <div className="w-1/2 flex flex-col gap-4">
                <div className="border-2 border-[#1e40af] rounded overflow-hidden">
                  <div className="bg-[#1e40af] text-white px-3 py-1 text-[13px] font-black">CAD/CAM冠</div>
                  {hokenCadCam?.items.map((item, i) => (
                    <div key={i} className="flex justify-between px-3 py-0.5 text-[10px] border-b last:border-0 font-bold bg-white">
                      <span className="truncate">{sanitizeName(item.name)}</span>
                      <span className="font-black text-blue-900">¥{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="border-2 border-[#1e40af] rounded overflow-hidden">
                  <div className="bg-[#1e40af] text-white px-3 py-1 text-[13px] font-black">模型・その他</div>
                  {hokenModelEtc?.items.map((item, i) => (
                    <div key={i} className="flex justify-between px-3 py-0.5 text-[10px] border-b last:border-0 font-bold bg-white">
                      <span className="truncate">{sanitizeName(item.name)}</span>
                      <span className="font-black text-blue-900">¥{item.price}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
          <div className="flex-1 bg-white p-4 border-2 border-[#1e40af] rounded">
             <div className="text-[12px] font-black text-blue-900 mb-2 border-b border-blue-100">配列・完成 料金表</div>
             <table className="w-full text-[10px] font-bold border-collapse">
               <thead><tr className="bg-blue-50 text-blue-900"><th className="text-left px-2">項目</th><th className="w-20 text-right pr-2">レジン</th><th className="w-20 text-right pr-2">熱可塑</th></tr></thead>
               <tbody>
                 {hokenHairetsuKansei?.items.map((item, i) => (
                   <tr key={i} className="border-b last:border-0"><td className="px-2">{sanitizeName(item.name)}</td><td className="text-right pr-2">¥{parseMultiPrice(item.price, 0)}</td><td className="text-right pr-2">¥{parseMultiPrice(item.price, 1)}</td></tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      </div>

      {/* PAGE 3: 自費義歯 - 極限圧縮版 */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page px-8 py-4 flex flex-col text-gray-800 bg-white">
          <h2 className="text-[#ea580c] border-b-[5px] border-[#ea580c] mb-2 font-black text-2xl italic tracking-[0.2em] pb-1 uppercase">自費義歯料金一覧</h2>
          
          <div className="flex gap-3 mb-2">
            <div className="w-1/2">
              <div className="bg-[#ea580c] text-white px-4 py-1 text-[11px] font-black rounded-t">自費排列</div>
              <div className="border-[2px] border-[#ea580c] bg-white font-bold">
                {privateGishiBasic?.items.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex justify-between px-3 py-0.5 text-[9.5px] border-b last:border-0"><span className="truncate">{sanitizeName(item.name)}</span><span className="text-orange-900 font-black">¥{item.price}</span></div>
                ))}
              </div>
            </div>
            <div className="w-1/2">
              <div className="bg-[#ea580c] text-white px-4 py-1 text-[11px] font-black rounded-t">自費完成</div>
              <div className="border-[2px] border-[#ea580c] bg-white font-bold">
                {privateGishiBasic?.items.slice(5, 10).map((item, i) => (
                  <div key={i} className="flex justify-between px-3 py-0.5 text-[9.5px] border-b last:border-0"><span className="truncate">{sanitizeName(item.name)}</span><span className="text-orange-900 font-black">¥{item.price}</span></div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="bg-[#ea580c] text-white px-4 py-1 text-[11px] font-black rounded-t">{privateGishiNonclasp?.title}</div>
            <div className="border-[2px] border-[#ea580c] bg-white p-2 grid grid-cols-2 gap-4 font-bold">
               <div className="text-[9.5px] space-y-0.5">
                  <div className="text-orange-800 font-black border-b border-orange-50 mb-1">エステショット / バイオプラスト</div>
                  {privateGishiNonclasp?.items.slice(0, 6).map((item, i) => (
                    <div key={i} className="flex justify-between"><span>{sanitizeName(item.name)}</span><span className="text-orange-900">¥{item.price}</span></div>
                  ))}
               </div>
               <div className="text-[9.5px] space-y-0.5 border-l border-orange-50 pl-2">
                  <div className="text-orange-800 font-black border-b border-orange-50 mb-1">TUM</div>
                  {privateGishiNonclasp?.items.slice(6, 12).map((item, i) => (
                    <div key={i} className="flex justify-between"><span>{sanitizeName(item.name)}</span><span className="text-orange-900">¥{item.price}</span></div>
                  ))}
               </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="bg-[#ea580c] text-white px-4 py-1 text-[11px] font-black rounded-t">金属床 (コバルト / チタン / 貴金属)</div>
            <table className="w-full text-[9.5px] border-collapse border-[2px] border-[#ea580c] font-black">
               <thead className="bg-orange-50"><tr><th className="px-3 py-0.5 text-left border-r border-[#ea580c]">内容</th><th className="text-center border-r border-[#ea580c]">Co</th><th className="text-center border-r border-[#ea580c]">Ti</th><th className="text-center">貴金属</th></tr></thead>
               <tbody className="bg-white text-right">
                 {privateGishiMetal?.items.map((item, i) => (
                   <tr key={i} className="border-t border-[#ea580c]"><td className="text-left px-3 py-0.5 border-r border-[#ea580c]">{sanitizeName(item.name)}</td><td className="pr-2 border-r border-[#ea580c]">¥{parseMultiPrice(item.price, 0)}</td><td className="pr-2 border-r border-[#ea580c]">¥{parseMultiPrice(item.price, 1)}</td><td className="pr-2">¥{parseMultiPrice(item.price, 2)}</td></tr>
                 ))}
               </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto">
             <div>
               <div className="bg-[#ea580c] text-white px-3 py-1 text-[10px] font-black rounded-t">シリコン裏装加工</div>
               <div className="border-[2px] border-[#ea580c] p-2 bg-white text-[9px] font-black space-y-1">
                 {privateGishiOthers?.items.slice(0, 4).map((item, i) => (
                   <div key={i} className="flex justify-between border-b last:border-0 border-orange-50"><span>{sanitizeName(item.name)}</span><span>¥{item.price}</span></div>
                 ))}
               </div>
             </div>
             <div>
               <div className="bg-[#ea580c] text-white px-3 py-1 text-[10px] font-black rounded-t">その他・特記</div>
               <div className="border-[2px] border-[#ea580c] p-2 bg-white text-[9px] font-black min-h-[70px]">
                 <div className="text-[#9a3412] italic leading-tight">※貴金属は材料代別途。<br/>※ALL on 4 等はお見積り。</div>
                 <div className="mt-2 text-gray-500 font-bold">再製作・修理についてはお気軽にご相談ください。</div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* PAGE 4: 自費歯冠修復 */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-8 flex flex-col text-gray-800">
          <h2 className="text-[#065f46] border-b-[4px] border-[#065f46] mb-4 font-black text-2xl italic tracking-[0.1em] pb-1 uppercase">自費歯冠修復料金一覧</h2>
          <CompactTable category={zirconia} />
          <CompactTable category={emax} />
          <CompactTable category={mb} />
          <div className="grid grid-cols-2 gap-4">
             <CompactTable category={hybrid} />
             <CompactTable category={metal} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default PriceListRenderer;
