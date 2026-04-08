import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Check } from 'lucide-react';

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MIN_DATE = new Date('2021-07-04');
const MAX_DATE = new Date();

const NetflixCalendar = ({ onSelect, selectedDate }) => {
  const [viewDate, setViewDate] = useState(selectedDate || new Date());
  const [viewMode, setViewMode] = useState('days'); // 'days' | 'months' | 'years'
  const [isOpen, setIsOpen] = useState(false);
  const [pulseDate, setPulseDate] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset view to days when closing
        setTimeout(() => setViewMode('days'), 300);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const isSunday = (date) => date.getDay() === 0;
  const isDateInRange = (date) => {
    const d = new Date(date).setHours(0,0,0,0);
    const min = new Date(MIN_DATE).setHours(0,0,0,0);
    const max = new Date(MAX_DATE).setHours(0,0,0,0);
    return d >= min && d <= max;
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    if (viewMode === 'days') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    } else if (viewMode === 'years') {
      setViewDate(new Date(viewDate.getFullYear() - 12, 0, 1));
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (viewMode === 'days') {
      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    } else if (viewMode === 'years') {
      setViewDate(new Date(viewDate.getFullYear() + 12, 0, 1));
    }
  };

  const onDateClick = (date) => {
    setPulseDate(date.toISOString());
    onSelect(date);
    setTimeout(() => {
        setPulseDate(null);
        setIsOpen(false);
    }, 400);
  };

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    const weekDays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const enabled = isSunday(date) && isDateInRange(date);
      const isSelected = selectedDate && 
        selectedDate.getDate() === d && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year;
      const isPulsing = pulseDate === date.toISOString();

      days.push(
        <button
          key={d}
          disabled={!enabled}
          onClick={() => onDateClick(date)}
          className={`h-9 w-9 rounded-xl text-[10px] font-black transition-all duration-300 relative group flex items-center justify-center ${
            isSelected 
              ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] z-10' 
              : enabled 
                ? 'bg-white/5 text-white/80 hover:bg-emerald-500/20 hover:text-emerald-400 hover:scale-110 active:scale-95' 
                : 'text-white/5 cursor-not-allowed opacity-30 shadow-none'
          } ${isPulsing ? 'scale-[1.3] shadow-[0_0_30px_rgba(16,185,129,0.6)]' : ''}`}
        >
          {d}
          {enabled && !isSelected && (
             <div className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/50 transition-colors" />
          )}
        </button>
      );
    }

    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map(wd => (
            <div key={wd} className={`text-[7px] font-black uppercase tracking-widest h-6 flex items-center justify-center ${wd === 'SU' ? 'text-emerald-500' : 'text-white/10'}`}>
              {wd}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const renderMonths = () => {
    return (
      <div className="grid grid-cols-3 gap-2 animate-in fade-in zoom-in-95 duration-500">
        {MONTHS.map((m, i) => {
          const date = new Date(viewDate.getFullYear(), i, 1);
          const isCurrent = viewDate.getMonth() === i;
          const hasData = date.getFullYear() > 2021 || (date.getFullYear() === 2021 && i >= 6);
          const isFuture = date > MAX_DATE;

          return (
            <button
              key={m}
              disabled={!hasData || isFuture}
              onClick={() => {
                setViewDate(new Date(viewDate.getFullYear(), i, 1));
                setViewMode('days');
              }}
              className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                isCurrent 
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : (!hasData || isFuture)
                    ? 'text-white/5 cursor-not-allowed border border-transparent'
                    : 'bg-white/[0.03] text-white/40 border border-white/5 hover:bg-emerald-500/10 hover:text-white hover:border-emerald-500/20'
              }`}
            >
              {m.substring(0, 3)}
            </button>
          );
        })}
      </div>
    );
  };

  const renderYears = () => {
    const years = [];
    for (let y = 2021; y <= MAX_DATE.getFullYear(); y++) {
      years.push(
        <button
          key={y}
          onClick={() => {
            setViewDate(new Date(y, viewDate.getMonth(), 1));
            setViewMode('months');
          }}
          className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
            viewDate.getFullYear() === y 
              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
              : 'bg-white/[0.03] text-white/40 border border-white/5 hover:bg-emerald-500/10 hover:text-white hover:border-emerald-500/20'
          }`}
        >
          {y}
        </button>
      );
    }
    return <div className="grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-500">{years}</div>;
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger: Re-designed as a sleek pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-500 group relative overflow-hidden h-[46px] ${
          isOpen 
          ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.4)] scale-105' 
          : 'bg-white/5 border-white/10 hover:border-emerald-500/30'
        }`}
      >
        <CalendarIcon size={14} className={`transition-transform duration-500 ${isOpen ? 'text-black scale-110' : 'text-emerald-500 group-hover:scale-110'}`} />
        <div className="flex items-center gap-2">
           <span className={`text-[10px] font-black uppercase tracking-widest ${isOpen ? 'text-black' : 'text-white/80'}`}>
             {selectedDate 
               ? `${MONTHS[selectedDate.getMonth()].substring(0, 3)} ${selectedDate.getFullYear().toString().substring(2)}` 
               : 'PICK Sunday'}
           </span>
        </div>
      </button>

      {/* Menu Overhaul: Opacity/Scale Transitions for smooth exit */}
      <div className={`absolute top-full left-0 mt-4 w-72 bg-[#050505]/95 border border-white/10 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-[2000] backdrop-blur-3xl p-6 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top-left ${
        isOpen 
        ? 'opacity-100 scale-100 translate-y-0 visible shadow-emerald-500/5' 
        : 'opacity-0 scale-90 -translate-y-8 invisible pointer-events-none'
      }`}>
          
          {/* Header Architecture */}
          <div className="flex items-center justify-between mb-8 group/header">
            <button 
              onClick={() => viewMode === 'days' ? setViewMode('months') : setViewMode('years')}
              className="px-5 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/20 text-[11px] font-black uppercase tracking-[0.2em] text-white/90 transition-all italic flex items-center gap-3 group"
            >
              {viewMode === 'days' 
                ? `${MONTHS[viewDate.getMonth()].substring(0, 3)} ${viewDate.getFullYear().toString().substring(2)}` 
                : viewMode === 'months' ? viewDate.getFullYear() : 'SELECT YEAR'}
              <ChevronDown size={14} className="text-emerald-500 opacity-40 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-500" />
            </button>
            <div className="flex gap-2">
               <button onClick={handlePrev} className="p-2 hover:bg-white/10 rounded-xl text-white/20 hover:text-emerald-500 transition-all active:scale-90"><ChevronLeft size={16} /></button>
               <button onClick={handleNext} className="p-2 hover:bg-white/10 rounded-xl text-white/20 hover:text-emerald-500 transition-all active:scale-90"><ChevronRight size={16} /></button>
            </div>
          </div>

          {/* Dynamic Surface */}
          <div className="min-h-[220px] px-1">
            {viewMode === 'days' && renderDays()}
            {viewMode === 'months' && renderMonths()}
            {viewMode === 'years' && renderYears()}
          </div>

          {/* Intelligence Footer */}
          <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] italic">Historical Mode</span>
             </div>
             <button 
               onClick={() => {
                  setViewDate(new Date());
                  setViewMode('days');
               }}
               className="px-3 py-1 rounded-lg bg-emerald-500/5 hover:bg-emerald-500/10 text-[8px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20 transition-all active:scale-95"
             >
                Reset Feed
             </button>
          </div>

          {/* Inner Glow Decorative */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.03] blur-[40px] rounded-full pointer-events-none animate-pulse" />
        </div>
    </div>
  );
};

// Internal icon for trigger toggle
const ChevronDown = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m6 9 6 6 6-6"/>
    </svg>
);

export default NetflixCalendar;
