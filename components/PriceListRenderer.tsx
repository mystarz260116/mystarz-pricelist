
import React from 'react';
import { PriceListData, PriceCategory } from '../types';

interface Props {
  data: PriceListData;
}

const PriceListRenderer: React.FC<Props> = ({ data }) => {
  // 各カテゴリーの取得
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
          {parts[0]}(材料代<span className="text-red-600 font-bold">別</span>)
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

  // PDF出力時に色が消えないよう、透過色を使わずソリッドカラーを指定
  const CompactTable = ({ category, className = "" }: { category?: PriceCategory, className?: string }) => {
    if (!category) return null;
    return (
      <div className={`mb-2.5 ${className}`}>
        <div className="bg-[#047857] text-white px-3 py-1 text-[11px] font-bold rounded-t-sm shadow-sm flex justify-between items-center border-b border-[#065f46]">
          {renderHeader(category.title)}
        </div>
        <div className="border border-[#047857] bg-white overflow-hidden rounded-b-sm shadow-sm">
          {category.items.map((item, idx) => (
            <div key={idx} className={`flex justify-between px-3 py-1 text-[10px] border-b border-[#f0fdf4] last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f0fdf4]'}`}>
              <span className="flex-1 font-medium text-gray-700 truncate bg-transparent">{sanitizeName(item.name)}</span>
              <span className="w-32 text-right font-bold text-[#064e3b] whitespace-nowrap bg-transparent">¥ {item.price}</span>
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
          <div className="w-full text-right text-[10px] text-gray-400 mb-2 font-medium">発行日：{formattedDate}</div>
          <div className="w-full text-center border-y-2 border-gray-800 py-4 mb-6">
            <h1 className={`text-2xl font-bold mb-1 ${!data.clinic.name ? 'text-gray-200 italic' : 'text-gray-800'}`}>
              {data.clinic.name || '歯科医院名をご入力ください'} 様
            </h1>
            <p className="text-xl font-bold text-gray-700 tracking-[0.3em]">価格一覧表</p>
          </div>
          <div className="w-full flex justify-end mb-8">
            <div className="border border-gray-400 px-6 py-2 text-base bg-white shadow-sm">
              営業担当: <span className="font-bold underline underline-offset-4 px-2">{data.clinic.representative || '　　　'}</span>
            </div>
          </div>
          <div className="w-full flex-1 overflow-hidden mb-4">
             {implantCat && (
               <div className="mb-4">
                 <div className="bg-[#ea580c] text-white px-4 py-2 text-lg font-bold flex justify-between items-center rounded-t shadow-sm">
                   <span className="tracking-widest">{implantCat.title}</span>
                 </div>
                 <div className="border-2 border-[#ea580c] bg-white overflow-hidden rounded-b shadow-md">
                   {implantCat.items.map((item, idx) => (
                     <div key={idx} className={`flex justify-between px-4 py-1.5 text-[11px] border-b border-[#fff7ed] last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#fff7ed]'}`}>
                       <span className="flex-1 font-medium text-gray-700 bg-transparent">{sanitizeName(item.name)}</span>
                       <span className="w-44 text-right font-bold text-[#9a3412] bg-transparent">¥ {item.price}</span>
                     </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
          <div className="w-full mt-auto border-t-2 border-gray-100 pt-6">
             <div className="flex items-center justify-center gap-6 mb-4">
               <img src="https://www.mystarz.co.jp/Mystarz%2dlogo.png" alt="Logo" className="h-10 object-contain" />
               <div className="text-blue-900 font-bold text-2xl tracking-tighter whitespace-nowrap">TEL 072-691-7107</div>
             </div>
             <div className="text-center text-xs text-gray-600 mb-4">
               〒569-0806　高槻市明田町4-38 太陽ファルマテック株式会社内<br/><span className="font-bold">FAX 072-691-7108</span>
             </div>
             <div className="w-full border-t-2 border-gray-800 pt-3 text-center">
               <div className="text-xl font-bold text-gray-800 tracking-[0.2em]">株式会社マイ・スターズ 大阪</div>
             </div>
             <div className="w-full bg-gray-800 text-white py-1 text-[10px] tracking-widest uppercase text-center mt-2">MyStarz Dental Laboratory</div>
          </div>
        </div>
      </div>

      {/* PAGE 2: Insurance Prices */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-5 flex flex-col text-gray-800">
          <h2 className="text-[#1e40af] border-b-4 border-[#1e40af] mb-3 font-bold text-2xl italic pb-1">保険技工物 料金表</h2>
          
          <div className="flex flex-row gap-4 mb-2">
            <div className="w-1/2">
              <div className="bg-[#1e40af] text-white px-3 py-1 text-sm font-bold mb-1">保険冠</div>
              <div className="border-2 border-[#1e40af] bg-white">
                {hokenCrowns?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between px-2 py-0.5 text-[10px] border-b border-[#eff6ff] last:border-0">
                    <span className="font-medium bg-transparent">{sanitizeName(item.name)}</span>
                    <span className="font-bold bg-transparent">¥{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 flex flex-col gap-2">
              <div>
                <div className="bg-[#1e40af] text-white px-3 py-1 text-sm font-bold mb-1">CAD/CAM冠</div>
                <div className="border-2 border-[#1e40af] bg-white">
                  {hokenCadCam?.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-2 py-0.5 text-[10px] border-b border-[#eff6ff] last:border-0">
                      <span className="bg-transparent">{sanitizeName(item.name)}</span>
                      <span className="font-bold bg-transparent">¥{item.price}</span>
                    </div>
                  ))}
                  <div className="px-2 py-0.5 bg-[#f0f9ff] text-[8px] text-[#1e40af] border-t border-[#eff6ff] italic">※CAD/CAMは、すべて材料込みです。</div>
                </div>
              </div>
              <div>
                <div className="bg-[#1e40af] text-white px-3 py-1 text-sm font-bold mb-1">模型製作代（保険）・その他</div>
                <div className="border-2 border-[#1e40af] bg-white">
                  {hokenModelEtc?.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-2 py-1 text-[10px] border-b border-[#eff6ff] last:border-0">
                      <span className="bg-transparent">{sanitizeName(item.name)}</span>
                      <span className="font-bold bg-transparent">¥{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-4 mb-2">
            <div className="w-1/2">
              <div className="bg-[#1e40af] text-white px-3 py-1 text-sm font-bold mb-1">保険義歯</div>
              <div className="border-2 border-[#1e40af] bg-white overflow-hidden">
                {hokenDentures?.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between px-2 py-0.5 text-[10px] border-b border-[#eff6ff] last:border-0">
                    <span className="truncate pr-1 font-medium bg-transparent">{sanitizeName(item.name)}</span>
                    <span className="font-bold whitespace-nowrap bg-transparent">¥{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2">
              <div className="bg-[#1e40af] text-white px-3 py-1 text-sm font-bold mb-1">配列・完成 料金表</div>
              <table className="w-full text-[10px] border-collapse border-2 border-[#1e40af]">
                <thead className="bg-[#dbeafe] text-[9px]">
                  <tr>
                    <th className="border border-[#bfdbfe] p-1 text-left">内容</th>
                    <th className="border border-[#bfdbfe] p-1 w-16 text-center">レジン床</th>
                    <th className="border border-[#bfdbfe] p-1 w-16 text-center">熱可塑</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-right">
                  {hokenHairetsuKansei?.items.map((item, i) => (
                    <tr key={i}>
                      <td className="text-left border border-[#eff6ff] px-2 py-0.5 bg-transparent">{sanitizeName(item.name)}</td>
                      <td className="border border-[#eff6ff] px-2 py-0.5 font-bold bg-transparent">¥{parseMultiPrice(item.price, 0)}</td>
                      <td className="border border-[#eff6ff] px-2 py-0.5 font-bold bg-transparent">¥{parseMultiPrice(item.price, 1)}</td>
                    </tr>
                  ))}
                  <tr className="bg-[#eff6ff]"><td colSpan={3} className="text-[8px] text-[#1e40af] text-left px-2 py-0.5 italic bg-transparent">※再配列は、技工料・人工歯代が発生します。</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-1">
            <div className="bg-[#1e40af] text-white px-3 py-1 text-sm font-bold mb-1">義歯オプション・その他</div>
            <div className="border-2 border-[#1e40af] p-2 bg-white text-[10px]">
               <div className="flex flex-row gap-6">
                  <div className="w-1/2 space-y-0.5">
                     {hokenGishiOptions?.items.slice(0, 7).map((item, idx) => (
                       <div key={idx} className="flex justify-between border-b border-[#eff6ff]">
                         <span className="bg-transparent">{sanitizeName(item.name)}</span>
                         <span className="font-bold bg-transparent">¥{item.price}</span>
                       </div>
                     ))}
                  </div>
                  <div className="w-1/2 space-y-0.5">
                     {hokenGishiOptions?.items.slice(7, 14).map((item, idx) => (
                       <div key={idx} className="flex justify-between border-b border-[#eff6ff]">
                         <span className="bg-transparent">{sanitizeName(item.name)}</span>
                         <span className="font-bold bg-transparent">¥{item.price}</span>
                       </div>
                     ))}
                  </div>
               </div>
               {hokenGishiOptions?.items[14] && (
                 <div className="mt-1 flex justify-center items-center gap-4 bg-[#eff6ff] p-1 rounded">
                   <span className="font-bold bg-transparent">{sanitizeName(hokenGishiOptions.items[14].name)}</span>
                   <span className="font-bold bg-transparent">¥{hokenGishiOptions.items[14].price}</span>
                 </div>
               )}
            </div>
            <div className="mt-1 text-[8px] text-[#1e40af] font-bold italic text-left">
               ※再製時、技工料が発生する場合があります。
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 3: Private Dentures */}
      <div className="responsive-a4-wrapper">
        <div className="a4-page p-6 flex flex-col text-gray-800 overflow-hidden">
          <h2 className="text-[#ea580c] border-b-4 border-[#ea580c] mb-2 font-bold text-xl italic tracking-widest pb-1">自費義歯料金一覧</h2>
          
          <div className="mb-2">
            <div className="bg-[#ea580c] text-white px-3 py-1 text-xs font-bold shadow-sm rounded-t">自費義歯基本料</div>
            <div className="flex flex-row gap-3 border-2 border-[#ea580c] bg-white p-1 rounded-b">
              <div className="w-1/2">
                <table className="w-full text-[9px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412]"><tr><th className="border border-[#fed7aa] px-1 py-1 text-left">項目（排列）</th><th className="border border-[#fed7aa] px-1 py-1 text-right">料金</th></tr></thead>
                  <tbody className="bg-white">
                    {privateGishiBasic?.items.slice(0, 5).map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : ""}>
                        <td className="border border-[#fed7aa] px-1 py-1 bg-transparent">{sanitizeName(item.name)}</td>
                        <td className="border border-[#fed7aa] px-1 py-1 text-right font-bold bg-transparent">¥{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-1/2">
                <table className="w-full text-[9px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412]"><tr><th className="border border-[#fed7aa] px-1 py-1 text-left">項目（完成）</th><th className="border border-[#fed7aa] px-1 py-1 text-right">料金</th></tr></thead>
                  <tbody className="bg-white">
                    {privateGishiBasic?.items.slice(5, 10).map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : ""}>
                        <td className="border border-[#fed7aa] px-1 py-1 bg-transparent">{sanitizeName(item.name)}</td>
                        <td className="border border-[#fed7aa] px-1 py-1 text-right font-bold bg-transparent">¥{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="bg-[#ea580c] text-white px-3 py-1 text-xs font-bold shadow-sm rounded-t">ノンクラスプ</div>
            <div className="flex flex-row gap-3 border-2 border-[#ea580c] bg-white p-1 rounded-b">
              <div className="w-1/2">
                <table className="w-full text-[8px] border-collapse">
                  <thead className="bg-[#fff7ed] text-[#9a3412] font-bold border-b border-[#fed7aa]"><tr><th colSpan={2} className="px-1 py-1.5 text-left text-[9px]">エステショット・バイオプラスト</th></tr></thead>
                  <tbody className="bg-white">
                    {privateGishiNonclasp?.items.slice(0, 6).map((item, i) => (
                      <tr key={i} className={`font-bold ${i % 2 !== 0 ? 'bg-[#fffbf0] text-[7px]' : ''}`}>
                        <td className={`border-b border-[#ffedd5] px-1 py-1 bg-transparent ${i % 2 !== 0 ? 'pl-3 italic text-[#9a3412]' : ''}`}>{sanitizeName(item.name)}</td>
                        <td className="border-b border-[#ffedd5] px-1 py-1 text-right bg-transparent">¥{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-1/2">
                <table className="w-full text-[8px] border-collapse">
                  <thead className="bg-[#fff7ed] text-[#9a3412] font-bold border-b border-[#fed7aa]"><tr><th colSpan={2} className="px-1 py-1.5 text-left text-[9px]">TUM</th></tr></thead>
                  <tbody className="bg-white">
                    {privateGishiNonclasp?.items.slice(6, 12).map((item, i) => (
                      <tr key={i} className={`font-bold ${i % 2 !== 0 ? 'bg-[#fffbf0] text-[7px]' : ''}`}>
                        <td className={`border-b border-[#ffedd5] px-1 py-1 bg-transparent ${i % 2 !== 0 ? 'pl-3 italic text-[#9a3412]' : ''}`}>{sanitizeName(item.name)}</td>
                        <td className="border-b border-[#ffedd5] px-1 py-1 text-right bg-transparent">¥{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="bg-[#ea580c] text-white px-3 py-1 text-xs font-bold shadow-sm rounded-t">金属床</div>
            <div className="flex flex-row gap-3 border-2 border-[#ea580c] bg-white p-1 rounded-b">
              <div className="w-1/2">
                <table className="w-full text-[8px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412] border-b border-[#fed7aa]">
                    <tr><th className="px-1 py-1 text-left">内容</th><th>コバルト</th><th>チタン</th><th>貴金属</th></tr>
                  </thead>
                  <tbody className="bg-white text-right font-medium">
                    {privateGishiMetal?.items.slice(0, 2).map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : "border-b border-[#ffedd5]"}>
                        <td className="text-left px-1 py-1.5 font-bold bg-[#fff7ed]">{sanitizeName(item.name)}</td>
                        <td className="bg-transparent">¥{parseMultiPrice(item.price, 0)}</td>
                        <td className="bg-transparent">¥{parseMultiPrice(item.price, 1)}</td>
                        <td className="bg-transparent">¥{parseMultiPrice(item.price, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="w-1/2">
                <table className="w-full text-[8px] border-collapse">
                  <thead className="bg-[#ffedd5] text-[#9a3412] border-b border-[#fed7aa]">
                    <tr><th className="px-1 py-1 text-left">内容</th><th>コバルト</th><th>チタン</th><th>貴金属</th></tr>
                  </thead>
                  <tbody className="bg-white text-right font-medium">
                    {privateGishiMetal?.items.slice(2, 4).map((item, i) => (
                      <tr key={i} className={i % 2 !== 0 ? "bg-[#fff7ed]" : "border-b border-[#ffedd5]"}>
                        <td className="text-left px-1 py-1.5 font-bold bg-[#fff7ed]">{sanitizeName(item.name)}</td>
                        <td className="bg-transparent">¥{parseMultiPrice(item.price, 0)}</td>
                        <td className="bg-transparent">¥{parseMultiPrice(item.price, 1)}</td>
                        <td className="bg-transparent">¥{parseMultiPrice(item.price, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mb-2">
            <div className="bg-[#ea580c] text-white px-3 py-1 text-xs font-bold shadow-sm rounded-t">自費オプション</div>
            <div className="border-2 border-[#ea580c] bg-white p-1 rounded-b">
              <div className="flex flex-row gap-3 mb-1">
                <div className="w-1/2">
                  <table className="w-full text-[7.5px] border-collapse">
                    <thead className="bg-[#ffedd5] text-[#9a3412] border-b border-[#fed7aa]">
                      <tr><th className="px-1 py-1 text-left">内容</th><th>コバルト</th><th>チタン</th><th>貴金属</th></tr>
                    </thead>
                    <tbody className="bg-white text-right">
                      {privateGishiOptions?.items.slice(0, 5).map((item, i) => (
                        <tr key={i} className="border-b border-[#fff7ed]">
                          <td className="text-left px-1 py-1 bg-transparent">{sanitizeName(item.name)}</td>
                          <td className="bg-transparent">¥{parseMultiPrice(item.price, 0)}</td>
                          <td className="bg-transparent">¥{parseMultiPrice(item.price, 1)}</td>
                          <td className="bg-transparent">¥{parseMultiPrice(item.price, 2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-[#fff7ed]">
                        <td className="text-left px-1 py-1.5 font-bold bg-transparent">{sanitizeName(privateGishiOptions?.items[9]?.name || '')}</td>
                        <td colSpan={3} className="text-center font-bold bg-transparent">¥{privateGishiOptions?.items[9]?.price}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="w-1/2">
                  <table className="w-full text-[7.5px] border-collapse">
                    <thead className="bg-[#ffedd5] text-[#9a3412] border-b border-[#fed7aa]">
                      <tr><th className="px-1 py-1 text-left">内容</th><th>コバルト</th><th>チタン</th><th>貴金属</th></tr>
                    </thead>
                    <tbody className="bg-white text-right">
                      {privateGishiOptions?.items.slice(5, 9).map((item, i) => (
                        <tr key={i} className="border-b border-[#fff7ed]">
                          <td className="text-left px-1 py-1 bg-transparent">{sanitizeName(item.name)}</td>
                          <td className="bg-transparent">¥{parseMultiPrice(item.price, 0)}</td>
                          <td className="bg-transparent">¥{parseMultiPrice(item.price, 1)}</td>
                          <td className="bg-transparent">¥{parseMultiPrice(item.price, 2)}</td>
                        </tr>
                      ))}
                      <tr className="border-b border-[#fff7ed]">
                        <td className="text-left px-1 py-1 bg-transparent">{sanitizeName(privateGishiOptions?.items[10]?.name || '')}</td>
                        <td className="text-right bg-transparent">¥{parseMultiPrice(privateGishiOptions?.items[10]?.price || '', 0)}</td>
                        <td className="text-center italic bg-transparent">ー</td>
                        <td className="text-right bg-transparent">¥{parseMultiPrice(privateGishiOptions?.items[10]?.price || '', 1)}</td>
                      </tr>
                      <tr className="bg-[#fff7ed] font-bold">
                        <td className="text-left px-1 py-1.5 bg-transparent">特殊鉤・その他</td>
                        <td colSpan={3} className="text-center bg-transparent">お問い合わせください</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="text-[7px] text-[#9a3412] font-bold italic text-right pr-2">※貴金属は材料代別途</div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex flex-row gap-3">
               <div className="w-1/2">
                 <div className="bg-[#ea580c] text-white px-3 py-1 text-xs font-bold shadow-sm rounded-t">シリコン裏装</div>
                 <div className="border-2 border-[#ea580c] bg-white p-1 rounded-b text-[8.5px] space-y-1">
                   {privateGishiOthers?.items.slice(0, 4).map((item, idx) => (
                     <div key={idx} className="flex justify-between border-b border-[#fff7ed] pb-1 font-medium last:border-0 last:pb-0">
                       <span className="bg-transparent">{sanitizeName(item.name)}</span>
                       <span className="font-bold bg-transparent">¥{item.price}</span>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="w-1/2">
                 <div className="bg-[#ea580c] text-white px-3 py-1 text-xs font-bold shadow-sm rounded-t">その他</div>
                 <div className="border-2 border-[#ea580c] bg-white p-1 rounded-b text-[8.5px] space-y-2">
                   {privateGishiOthers?.items.slice(4, 6).map((item, idx) => (
                     <div key={idx} className="flex justify-between border-b border-[#fff7ed] pb-1.5 font-medium last:border-0 last:pb-0">
                       <span className="bg-transparent">{sanitizeName(item.name)}</span>
                       <span className="font-bold bg-transparent">¥{item.price}</span>
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
          <h2 className="text-[#065f46] border-b-4 border-[#065f46] mb-3 font-bold text-xl italic tracking-widest pb-1">自費歯冠修復料金一覧</h2>
          
          <div className="flex flex-col flex-1 overflow-hidden">
            <CompactTable category={zirconia} />
            <CompactTable category={emax} />
            <CompactTable category={mb} />

            <div className="flex gap-4">
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
