import React from 'react';
import { User, Briefcase } from 'lucide-react';

const PersonCard = ({ item }) => {
  const isCompany = item.titleType === 'company';
  const badgeLabel = isCompany ? 'COMPANY' : 'PERSON';
  const BadgeIcon = isCompany ? Briefcase : User;
  const badgeColor = isCompany ? 'text-violet-400' : 'text-emerald-400';
  const glowColor = isCompany ? 'hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] hover:border-violet-500/30' : 'hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] hover:border-emerald-500/30';

  return (
    <div className={`relative aspect-[2/3] group rounded-xl sm:rounded-3xl overflow-hidden cursor-pointer border border-white/5 transition-all duration-500 hover:scale-[1.02] ${glowColor}`}>
      
      {/* Background */}
      {isCompany ? (
        // Company: dark background with logo centered
        <div className="w-full h-full bg-gradient-to-br from-[#0e0e12] to-[#1a1a26] flex items-center justify-center p-8">
          {item.poster ? (
            <img
              decoding="async"
              src={item.poster}
              alt={item.title}
              className="w-full max-h-40 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Briefcase size={48} className="text-white/10" />
              <span className="text-white/20 text-xs font-black tracking-widest uppercase">No Logo</span>
            </div>
          )}
        </div>
      ) : (
        // Person: photo background
        item.poster ? (
          <img
            decoding="async"
            src={item.poster}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-black/40 flex flex-col items-center justify-center border border-white/5">
            <User size={32} className="text-white/10 mb-4" />
            <span className="text-white/20 text-xs font-black tracking-widest uppercase">No Image</span>
          </div>
        )
      )}

      {/* Gradient Overlay — lighter for companies */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isCompany ? 'bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-70' : 'bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-90'}`} />

      {/* Hover glow tint */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[1px] ${isCompany ? 'bg-violet-500/5' : 'bg-emerald-500/10'}`} />

      {/* Top Left Badge */}
      <div className="absolute top-4 left-4 z-[5]">
        <span className={`px-3 py-1.5 bg-black/80 sm:bg-black/60 sm:backdrop-blur-xl border border-white/10 rounded-xl text-[8px] font-black tracking-widest shadow-lg uppercase flex items-center gap-2 ${badgeColor}`}>
          <BadgeIcon size={10} /> {badgeLabel}
        </span>
      </div>

      {/* Bottom Content */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-6 z-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <div className="space-y-2">
          <h3 className="text-[11px] font-semibold sm:font-black sm:text-xl text-white sm:uppercase tracking-tight sm:tracking-wider leading-snug drop-shadow-2xl line-clamp-2 opacity-90">
            {item.title}
          </h3>
          <div className="h-0 group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
            <p className={`text-[10px] font-bold uppercase tracking-widest leading-relaxed ${badgeColor} opacity-70`}>
              {item.description || (isCompany ? 'Production Company' : 'Hollywood Personality')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
