import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}

const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-text-secondary">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-brand-primary' : 'bg-bg-tertiary'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-text-primary w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-full' : ''}`}></div>
      </div>
    </label>
  );
};

export default Switch;