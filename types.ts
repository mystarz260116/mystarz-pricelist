
export interface PriceItem {
  name: string;
  price: string;
  note?: string;
  subItems?: { name: string; price: string; price2?: string }[];
}

export interface PriceCategory {
  id: string;
  title: string;
  items: PriceItem[];
  color: 'blue' | 'orange' | 'green';
}

export interface ClinicInfo {
  name: string;
  representative: string;
  publishDate: string;
  expiryDate: string;
}

export interface PriceListData {
  clinic: ClinicInfo;
  categories: PriceCategory[];
}
