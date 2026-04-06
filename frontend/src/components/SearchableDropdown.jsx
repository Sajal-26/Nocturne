import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search, X, Check, Globe } from 'lucide-react';

const SearchableDropdown = ({ 
  value = [], 
  options = [], 
  onChange, 
  placeholder = "Select...", 
  label = "",
  icon: Icon = Globe,
  isMulti = true,
  showFlags = false,
  dropUp = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    const lowerSearch = searchTerm.toLowerCase();
    return options.filter(opt => 
      opt.name.toLowerCase().includes(lowerSearch) || 
      opt.code.toLowerCase().includes(lowerSearch)
    );
  }, [options, searchTerm]);

  const handleSelect = (code) => {
    if (isMulti) {
      const newValue = value.includes(code)
        ? value.filter(v => v !== code)
        : [...value, code];
      onChange(newValue);
    } else {
      onChange(value === code ? null : code);
      setIsOpen(false);
    }
  };

  const selectedLabel = useMemo(() => {
    if (!isMulti) {
      const selected = options.find(opt => opt.code === value);
      if (!selected) return null;
      return (
        <div className="flex items-center gap-3">
          {showFlags && (
            <div className="w-6 h-4 overflow-hidden rounded-sm border border-white/10 shadow-sm shrink-0">
              <img 
                src={`https://flagcdn.com/w40/${selected.code.toLowerCase()}.png`} 
                alt={selected.name}
                className="w-full h-full object-cover"
                onError={(e) => e.target.style.display = 'none'}
              />
            </div>
          )}
          <span className="font-black truncate">{selected.name}</span>
        </div>
      );
    }
    return value.length > 0 ? `${value.length} Selected` : null;
  }, [value, options, isMulti, showFlags]);

  return (
    <div className="relative w-full mb-6" ref={dropdownRef}>
      {label && (
        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 block mb-3 flex items-center gap-2">
          <Icon size={12} className="text-emerald-500" /> {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center bg-black/40 backdrop-blur-3xl border rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.1em] transition-all outline-none shadow-lg ${
          isOpen ? 'border-emerald-500/50' : 'border-white/5 hover:border-white/10'
        }`}
      >
        <div className="flex items-center gap-3 truncate">
          {!selectedLabel && <Icon size={14} className="text-white/20 shrink-0" />}
          {selectedLabel ? (
            <div className="text-emerald-400 w-full">{selectedLabel}</div>
          ) : (
            <span className="text-white/40">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={14} className={`transition-transform duration-300 text-white/30 ${isOpen ? (dropUp ? 'rotate-0' : 'rotate-180') : (dropUp ? 'rotate-180' : 'rotate-0')}`} />
      </button>

      <div 
        className={`absolute z-[100] left-0 w-full bg-[#0a0a0c]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${dropUp ? "bottom-[calc(100%+8px)] origin-bottom" : "top-[calc(100%+8px)] origin-top"}
          ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none translate-y-[-10px]"}
        `}
      >
        <div className="p-3 border-b border-white/5 sticky top-0 bg-[#0a0a0c]/90 backdrop-blur-sm z-10">
          <div className="relative group">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-[10px] font-bold text-white focus:outline-none focus:border-emerald-500/30 focus:bg-white/10 transition-all"
            />
          </div>
        </div>

        <div className="max-h-[250px] overflow-y-auto scrollbar-hide py-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => {
              const isSelected = isMulti ? value.includes(opt.code) : value === opt.code;
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleSelect(opt.code)}
                  className={`group w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-[0.1em] transition-all hover:bg-white/5 ${
                    isSelected ? 'text-emerald-400 bg-emerald-500/5' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-4 truncate">
                    {showFlags && (
                      <div className="w-8 h-5 overflow-hidden rounded-sm border border-white/10 shadow-sm shrink-0 bg-white/5 transition-transform group-hover:scale-110">
                        <img 
                          src={`https://flagcdn.com/w40/${opt.code.toLowerCase()}.png`} 
                          alt={opt.name}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                    <span className="truncate">{opt.name}</span>
                  </div>
                  {isSelected && <Check size={12} className="text-emerald-400 shrink-0" />}
                </button>
              );
            })
          ) : (
            <div className="px-4 py-8 text-center text-[9px] font-black uppercase tracking-[0.2em] text-white/20">
              No results found
            </div>
          )}
        </div>

        {isMulti && value.length > 0 && (
          <div className="p-2 border-t border-white/5 bg-white/[0.02]">
            <button
              onClick={() => onChange([])}
              className="w-full py-2 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <X size={10} /> Clear Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchableDropdown;
