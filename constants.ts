
import { PriceListData } from './types';

const getLocalDate = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const INITIAL_PRICE_DATA: PriceListData = {
  clinic: {
    name: "",
    representative: "",
    publishDate: getLocalDate(),
    expiryDate: ""
  },
  categories: [
    // --- 保険技工物 ---
    {
      id: 'hoken-kan',
      title: '保険冠',
      color: 'blue',
      items: [
        { name: 'コア', price: '1,100' },
        { name: 'インレー（単）', price: '1,600' },
        { name: 'インレー（複）A', price: '1,900' },
        { name: 'インレー（複）B', price: '2,100' },
        { name: '4/5冠', price: '2,300' },
        { name: '3/4冠', price: '2,300' },
        { name: 'FMC', price: '2,800' },
        { name: '鋳造ポンティック', price: '3,100' },
        { name: 'HR', price: '5,300' },
        { name: 'HRポンティック', price: '5,600' },
        { name: 'レジン前装金属ポンティック（小臼歯）', price: '3,800' },
        { name: 'レジン前装金属ポンティック（大臼歯）', price: '3,800' },
        { name: 'HJC（前歯／臼歯）', price: '4,500' },
        { name: 'チタンクラウン', price: '7,500' },
        { name: 'TEK', price: '1,000' },
        { name: 'ファイバーポスト', price: '4,000' },
        { name: 'ポスト追加', price: '890' },
      ]
    },
    {
      id: 'hoken-cadcam',
      title: 'CAD/CAM冠',
      color: 'blue',
      items: [
        { name: '小臼歯(Ⅰ)', price: '5,700' },
        { name: '小臼歯(Ⅱ)', price: '6,600' },
        { name: '大臼歯(Ⅲ)', price: '7,700' },
        { name: 'エンドクラウン(Ⅲ)', price: '13,000' },
        { name: '前歯(Ⅳ)', price: '5,700' },
        { name: 'PEEK冠(Ⅴ)', price: '15,000' },
        { name: 'CAD/CAMインレー(Ⅰ)', price: '5,700' },
        { name: 'CAD/CAMインレー(Ⅱ)', price: '6,600' },
        { name: 'CAD/CAMインレー(Ⅲ)', price: '7,700' },
      ]
    },
    {
      id: 'hoken-model-etc',
      title: '模型製作代（保険）・その他',
      color: 'blue',
      items: [
        { name: '模型製作代（保険）', price: '300' },
        { name: '石膏注入', price: '500' },
      ]
    },
    {
      id: 'hoken-gishi',
      title: '保険義歯',
      color: 'blue',
      items: [
        { name: '個人トレー', price: '1,500' },
        { name: '咬合床（WAX床）', price: '1,500' },
        { name: '咬合床（オストロンベース）', price: '2,400' },
        { name: '補強芯', price: '1,200' },
        { name: '保持装置', price: '500' },
        { name: '鋳造二腕鉤', price: '1,800' },
        { name: '鋳造単鉤', price: '1,800' },
        { name: '鋳造双子鉤', price: '2,000' },
        { name: '鋳造間接支台装置（レスト、フック、スパー）', price: '900' },
        { name: '鋳造バー', price: '3,500' },
        { name: '線造二腕鉤（レスト付）', price: '1,400' },
        { name: '線造二腕鉤（レスト無）', price: '1,150' },
        { name: '線造双子鉤', price: '2,000' },
        { name: '線造単鉤', price: '1,100' },
        { name: 'コンビネーション鉤', price: '2,200' },
        { name: '３次元有床プリント義歯', price: 'お尋ねください' },
      ]
    },
    {
      id: 'hoken-hairetsu-kansei',
      title: '排列・完成 (レジン床 / 熱可塑性樹脂)',
      color: 'blue',
      items: [
        { name: '排列 1~4歯 (レジン/熱可塑)', price: '800 / 800' },
        { name: '排列 5~8歯 (レジン/熱可塑)', price: '1,200 / 1,200' },
        { name: '排列 9~11歯 (レジン/熱可塑)', price: '1,500 / 1,500' },
        { name: '排列 12~14歯 (レジン/熱可塑)', price: '1,500 / 2,000' },
        { name: '排列 総義歯 (レジン/熱可塑)', price: '2,000 / 2,800' },
        { name: '完成 1~4歯 (レジン/熱可塑)', price: '3,960 / 4,200' },
        { name: '完成 5~8歯 (レジン/熱可塑)', price: '4,800 / 5,880' },
        { name: '完成 9~11歯 (レジン/熱可塑)', price: '6,600 / 6,840' },
        { name: '完成 12~14歯 (レジン/熱可塑)', price: '9,000 / 9,600' },
        { name: '完成 総義歯 (レジン/熱可塑)', price: '11,600 / 15,000' },
      ]
    },
    {
      id: 'hoken-gishi-options',
      title: '義歯オプション・修理等',
      color: 'blue',
      items: [
        { name: 'リベース　1～4歯　裏装', price: '2,300' },
        { name: 'リベース　5～8歯　裏装', price: '2,800' },
        { name: 'リベース　9～11歯　裏装', price: '3,500' },
        { name: 'リベース　12～14歯　裏装', price: '5,500' },
        { name: 'リベース　総義歯　裏装', price: '7,500' },
        { name: '修理基本料（～8歯）', price: '3,000' },
        { name: '修理基本料（9歯～14歯）', price: '3,000' },
        { name: '名前入れ', price: '2,000' },
        { name: '増歯', price: '500' },
        { name: '増鉤', price: '800' },
        { name: 'アルタードキャスト模型', price: '2,500' },
        { name: 'ナイトガード（ソフト）', price: '7,000' },
        { name: 'ナイトガード（ハード）', price: '8,000' },
        { name: 'ナイトガード（S＆H）', price: '8,500' },
        { name: 'バイトプレート（重合）', price: '12,000' },
        { name: 'カスタムトレー（BLE）', price: '5,000' },
        { name: 'スリープスプリント（プレス）', price: '14,000' },
        { name: 'スリープスプリント（レジン）', price: '21,000' },
        { name: 'ロー着(Co-Cr)', price: '2,500/１箇所' },
      ]
    },

    // --- 自費歯冠修復 ---
    {
      id: 'zirconia-p4',
      title: 'ジルコニア(材料代込み)',
      color: 'green',
      items: [
        { name: 'KATANA', price: '18,000' },
        { name: 'KATANA（レイヤリング）', price: '25,000' },
        { name: 'KATANA　インレー', price: '15,000' },
        { name: 'ジルアドバンスド', price: '15,000' },
        { name: 'ジルアドバンスド（レイヤリング）', price: '22,000' },
        { name: 'ジルアドバンスド　インレー', price: '15,000' },
        { name: 'サクラ ストローマン', price: '18,000' },
        { name: 'サクラ ストローマン（レイヤリング）', price: '25,000' },
        { name: 'Wグラデーション', price: '18,000' },
        { name: 'Wグラデーション（レイヤリング）', price: '25,000' },
        { name: 'Wグラデーション　インレー', price: '15,000' },
      ]
    },
    {
      id: 'emax-p4',
      title: 'e.max(材料代込み)',
      color: 'green',
      items: [
        { name: 'インレー（単）', price: '10,000' },
        { name: 'インレー（複）', price: '11,000' },
        { name: 'ベニヤ・アンレー', price: '12,000' },
        { name: 'フルクラウン', price: '15,000' },
      ]
    },
    {
      id: 'mb-p4',
      title: 'メタルボンド(材料代別)',
      color: 'green',
      items: [
        { name: '前歯', price: '20,000' },
        { name: '臼歯', price: '20,000' },
        { name: 'MBカラーレス', price: '3,000/歯 追加' },
        { name: 'ホワイトWAX', price: '500/歯' },
        { name: '前ロウ着', price: '5,000' },
        { name: '後ロウ着', price: '5,000' },
      ]
    },
    {
      id: 'hybrid-p4',
      title: 'ハイブリッド',
      color: 'green',
      items: [
        { name: 'インレー（単）', price: '5,000' },
        { name: 'インレー（複）', price: '6,000' },
        { name: 'ジャケットクラウン（前歯）', price: '8,000' },
        { name: 'ジャケットクラウン（臼歯）', price: '9,000' },
        { name: '金属裏装（前歯）※材料代抜き', price: '11,000' },
        { name: '金属裏装（臼歯）※材料代抜き', price: '12,000' },
        { name: 'ラミネートベニヤ', price: '9,000' },
        { name: 'ファイバーリボン(1歯)', price: '3,000' },
      ]
    },
    {
      id: 'metal-p4',
      title: '自費メタル',
      color: 'green',
      items: [
        { name: '自費コア', price: '1,800' },
        { name: '分割式メタルコア', price: '3,500' },
        { name: '自費　インレー　単', price: '2,500' },
        { name: '自費　インレー　複', price: '3,000' },
        { name: '自費　アンレー', price: '4,000' },
        { name: '自費　4/5・3/4冠', price: '4,500' },
        { name: '自費　FMC', price: '4,500' },
        { name: '自費　根面板', price: '3,000' },
      ]
    },
    {
      id: 'model-p4',
      title: '模型製作代（自費）',
      color: 'green',
      items: [
        { name: '模型製作（自費）支台歯1～2本', price: '600' },
        { name: '模型製作（自費）支台歯3～4本', price: '800' },
        { name: '模型製作（自費）支台歯5本以上', price: '1,000' },
        { name: '3Dプリンター模型（1顎）', price: '4,000' },
      ]
    },
    {
      id: 'fiber-p4',
      title: '自費ファイバーコア等',
      color: 'green',
      items: [
        { name: 'ファイバーコア', price: '5,000' },
        { name: 'ポスト追加', price: '1,000/本' },
      ]
    },

    // --- インプラント ---
    {
      id: 'implant',
      title: 'インプラント',
      color: 'orange',
      items: [
        { name: 'トランスファーモデル（ガム模型付き）', price: '3,000～5,000' },
        { name: 'カスタムアバットメント（チタン）', price: '30,000～' },
        { name: 'カスタムアバットメント（ジルコニア）', price: '34,000' },
        { name: 'カスタムアバットメント（鋳接）', price: '10,000' },
        { name: '既製アバットメント形成料', price: 'A: 5,000 / B: 10,000' },
        { name: 'スクリューリテイン技術料', price: '10,000' },
        { name: 'ベースアバットメント基本技工料', price: '16,000' },
        { name: 'ストローマン バリオベース', price: '20,000' },
        { name: 'ポジショニングガイド（レジンパターン）', price: '1,000／歯' },
        { name: 'インプラント ロー着（1ヶ）', price: '8,000' },
        { name: '診断用WAXUP(１歯)', price: '1,000／歯' },
        { name: 'インプラント プロビジョナル', price: '3,000／歯' },
        { name: 'サージカル or 診断用テンプレート（ステント） 1～4歯', price: '8,000' },
        { name: 'サージカル or 診断用テンプレート（ステント） 5～10歯', price: '10,000' },
        { name: 'サージカル or 診断用テンプレート（ステント） 11～14歯', price: '15,000' },
        { name: '造影埋込料 １ケ', price: '1,000' },
        { name: 'インプラントカスタムトレー', price: '3,000～' },
        { name: 'レジンバイト', price: '5,000' },
      ]
    },

    // --- 自費義歯 ---
    {
      id: 'private-gishi-basic',
      title: '自費義歯基本料 (排列/完成)',
      color: 'orange',
      items: [
        { name: '自費排列 1~4歯', price: '1,200' },
        { name: '自費排列 5~8歯', price: '2,000' },
        { name: '自費排列 9~11歯', price: '3,000' },
        { name: '自費排列 12~14歯', price: '4,200' },
        { name: '自費排列 総義歯', price: '5,000' },
        { name: '自費完成 1~4歯', price: '5,800' },
        { name: '自費完成 5~8歯', price: '6,400' },
        { name: '自費完成 9~11歯', price: '8,800' },
        { name: '自費完成 12~14歯', price: '13,200' },
        { name: '自費完成 総義歯', price: '23,000' },
      ]
    },
    {
      id: 'private-gishi-nonclasp',
      title: 'ノンクラスプ（排列料、クラスプ、人工歯別）',
      color: 'orange',
      items: [
        { name: '【エステ・バイオ】 1類完成', price: '25,000' },
        { name: '【エステ・バイオ】 1類床材料費', price: '3,000' },
        { name: '【エステ・バイオ】 2類完成', price: '28,000' },
        { name: '【エステ・バイオ】 2類床材料費', price: '4,000' },
        { name: '【エステ・バイオ】 3類完成', price: '30,000' },
        { name: '【エステ・バイオ】 3類床材料費', price: '5,000' },
        { name: '【TUM】 1類完成', price: '30,000' },
        { name: '【TUM】 1類床材料費', price: '3,000' },
        { name: '【TUM】 2類完成', price: '33,000' },
        { name: '【TUM】 2類床材料費', price: '4,000' },
        { name: '【TUM】 3類完成', price: '35,000' },
        { name: '【TUM】 3類床材料費', price: '5,000' },
      ]
    },
    {
      id: 'private-gishi-metal',
      title: '金属床 (コバルト / チタン / 貴金属)',
      color: 'orange',
      items: [
        { name: '金属床 1類 (Co/Ti/貴)', price: '10,500 / 21,000 / 16,300' },
        { name: '金属床 2類 (Co/Ti/貴)', price: '15,800 / 31,600 / 24,400' },
        { name: '金属床 3類 (Co/Ti/貴)', price: '24,200 / 40,000 / 31,500' },
        { name: '金属床 4類 (Co/Ti/貴)', price: '25,200 / 43,000 / 32,800' },
      ]
    },
    {
      id: 'private-gishi-options',
      title: '自費オプション',
      color: 'orange',
      items: [
        { name: '単純鉤 (Co/Ti/貴)', price: '1,800 / 3,600 / 2,400' },
        { name: '両翼レストクラスプ (Co/Ti/貴)', price: '2,700 / 5,000 / 3,600' },
        { name: '双子鉤 (Co/Ti/貴)', price: '4,200 / 8,000 / 5,500' },
        { name: 'レフト・フック・スパー (Co/Ti/貴)', price: '1,500 / 3,000 / 2,000' },
        { name: 'メタルアップガイドプレーン (Co/Ti/貴)', price: '800 / 1,600 / 1,100' },
        { name: 'メタルティース (Co/Ti/貴)', price: '5,300 / 10,000 / 6,900' },
        { name: 'ロー着 (Co/Ti/貴)', price: '6,000 / ー / 8,500～' },
        { name: 'レーザー溶接 (Co/Ti/貴)', price: '7,000～ / ー / 7,000～' },
        { name: 'コンビネーション (Co/Ti/貴)', price: '2,700 / 5,000 / 3,600' },
        { name: 'RPI(Iバーシステム) (Co/Ti/貴)', price: '5,300 / 10,000 / 6,900' },
        { name: '鋳造バー (Co/Ti/貴)', price: '8,400 / 16,800 / 11,000' },
        { name: '自費：トレー / 咬合床', price: '各 2,500' },
      ]
    },
    {
      id: 'private-gishi-others',
      title: 'シリコン裏装・その他',
      color: 'orange',
      items: [
        { name: 'シリコン裏装：基本加工料', price: '20,000' },
        { name: 'シリコン裏装：完成料(歯数)', price: '1,200' },
        { name: 'シリコン裏装：リベース 1～8歯', price: '25,000' },
        { name: 'シリコン裏装：リベース 9～14歯', price: '30,000' },
        { name: 'スポーツマウスガード', price: '15,000～' },
        { name: '副模型', price: '2,000' },
      ]
    }
  ]
};
