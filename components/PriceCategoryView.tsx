
import React from 'react';
import { PriceCategory } from '../types';

interface Props {
  category: PriceCategory;
}

const PriceCategoryView: React.FC<Props> = ({ category }) => {
  const colorMap = {
    blue: 'bg-blue-800',
    orange: 'bg-orange-600',
    green: 'bg-emerald-700',
  };

  const borderMap = {
    blue: 'border-blue-800',
    orange: 'border-orange-600',
    green: 'border-emerald-700',
  };

  const bg = colorMap[category.color] || 'bg-gray-800';
  const border = borderMap[category.color] || 'border-gray-800';

  return (
    <div className="mb-4">
      <div className={`${bg} text-white px-3 py-1 text-sm font-bold flex justify-between items-center`}>
        <span>{category.title}</span>
      </div>
      <div className={`border-l border-r border-b ${border}`}>
        {category.items.map((item, idx) => (
          <div 
            key={idx} 
            className={`flex justify-between px-2 py-1 text-[11px] leading-tight ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <span className="flex-1">{item.name}</span>
            <span className="w-24 text-right font-medium">¥{item.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceCategoryView;
