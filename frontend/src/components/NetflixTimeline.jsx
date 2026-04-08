import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const NetflixTimeline = ({ onSelect, selectedDate }) => {
  const scrollRef = useRef(null);
  const [dates, setDates] = useState([]);
  
  const MIN_DATE = new Date('2021-07-04');

  useEffect(() => {
    const generated = [];
    const today = new Date();
    const day = today.getDay();
    
    // Precisely find the most recent Sunday
    const latestSunday = new Date(today);
    latestSunday.setDate(today.getDate() - day);
    latestSunday.setHours(0, 0, 0, 0);
    
    // Generate only Sundays in 7-day decrements
    for (let i = 0; i < 52 * 4; i++) {
       const d = new Date(latestSunday);
       d.setDate(latestSunday.getDate() - (i * 7));
       if (d < MIN_DATE) break;
       generated.push(d);
    }
    const finalDates = generated.reverse();
    setDates(finalDates);

    // Default set to latest if nothing is selected
    if (!selectedDate && finalDates.length > 0) {
       onSelect(finalDates[finalDates.length - 1]);
    }
  }, []);

  useEffect(() => {
    // Scroll to the selected date (which defaults to latest) on mount
    if (scrollRef.current && selectedDate && dates.length > 0) {
      setTimeout(() => scrollToDate(selectedDate), 100);
    }
  }, [dates, selectedDate]);

  const formatDate = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()} '${String(date.getFullYear()).slice(-2)}`;
  };

  const scrollToDate = (date) => {
    const index = dates.findIndex(d => d.toDateString() === date.toDateString());
    if (index !== -1 && scrollRef.current) {
        const el = scrollRef.current.children[index];
        el.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 500;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="relative max-w-full">
         
         {/* Continuous Baseline */}
         <div className="absolute top-[6px] md:top-[8px] left-0 right-0 h-[2px] bg-white/[0.05]" />
         
         {/* Navigation Arrows (Minimalist) */}
         <button onClick={() => scroll('left')} className="absolute left-[-6px] md:left-[-20px] top-[8px] md:top-[14px] z-20 text-white/10 hover:text-white transition-all"><ChevronLeft size={14} /></button>
         <button onClick={() => scroll('right')} className="absolute right-[-6px] md:right-[-20px] top-[8px] md:top-[14px] z-20 text-white/10 hover:text-white transition-all"><ChevronRight size={14} /></button>

         {/* Scrubber Container */}
         <div 
           ref={scrollRef}
           className="flex items-start gap-10 md:gap-20 overflow-x-auto no-scrollbar scroll-smooth px-[34%] md:px-[45%] select-none scroll-snap-x mandatory py-2 md:py-4"
         >
            {dates.map((date, i) => {
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
              
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => onSelect(date)}
                  className={`flex-shrink-0 flex flex-col items-center gap-3 md:gap-6 transition-all duration-300 scroll-snap-align-center relative group ${
                    isSelected ? 'opacity-100 scale-110' : 'opacity-30 hover:opacity-60'
                  }`}
                >
                  {/* Timeline Dot (Matches Request: "points") */}
                  <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-500 z-10 border-2 ${
                    isSelected 
                    ? 'bg-emerald-500 border-white shadow-[0_0_20px_rgba(16,185,129,0.8)] scale-125' 
                    : 'bg-black border-white/20 group-hover:border-white/40'
                  }`} />
                  
                  {/* Label */}
                  <div className="flex flex-col items-center">
                    <span className={`text-[10px] md:text-[13px] font-black uppercase tracking-[0.16em] md:tracking-widest transition-all duration-500 whitespace-nowrap ${
                       isSelected ? 'text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'text-white/80 group-hover:text-white'
                    }`}>
                      {formatDate(date)}
                    </span>
                    {isSelected && <div className="mt-2 md:mt-3 w-4 md:w-6 h-[2px] bg-emerald-500 rounded-full animate-pulse" />}
                  </div>
                </button>
              );
            })}
         </div>

         {/* Gradient Edges */}
         <div className="absolute left-0 top-0 bottom-0 w-10 md:w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
         <div className="absolute right-0 top-0 bottom-0 w-10 md:w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
      </div>
    </div>
  );
};

export default NetflixTimeline;
