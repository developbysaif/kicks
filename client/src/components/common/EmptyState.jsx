import React from 'react';
import { Link } from 'react-router-dom';
import { PackageX } from 'lucide-react';

const EmptyState = ({ title = 'No items found', description = 'Try adjusting your search or filter parameters.', actionText, actionLink }) => {
  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
        <PackageX className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">{description}</p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="mt-6 inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
