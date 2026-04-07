import React, { useEffect } from 'react';
import { useMovieStore } from '../store/useMovieStore';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import BentoSpotlight from '../components/BentoSpotlight';

const Home = () => {
  const { 
    homeTrending, 
    homeNetflix, 
    homePrime, 
    homeApple,
    homeZee5,
    homeSonyLiv,
    homeMxPlayer,
    homeCrunchyroll,
    homeHotstar, 
    isLoading, 
    fetchHomeData 
  } = useMovieStore();

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  return (
    <div className="flex flex-col min-h-screen">
      {}
      <div className="relative">
        <Hero />
      </div>

      <div className="relative z-10 bg-[#000000]">
        {}
        <BentoSpotlight 
          trending={homeTrending} 
          netflix={homeNetflix}
          prime={homePrime}
          isLoading={isLoading} 
        />

        {}
        <ContentRow 
          title="Global Hits" 
          subtitle="Trending Week (Movies & TV)" 
          items={homeTrending.slice(5, 25)} 
          isLoading={isLoading} 
        />

        {}
        <ContentRow 
          title="Weekly Charts" 
          subtitle="Netflix Global Top 10" 
          items={homeNetflix} 
          isLoading={isLoading} 
        />

        {}
        <ContentRow 
          title="Premium Discovery" 
          subtitle="Apple TV+ Originals" 
          items={homeApple} 
          isLoading={isLoading} 
        />

        {}
        <ContentRow 
          title="Hotstar Popular" 
          subtitle="Disney + Hotstar Special" 
          items={homeHotstar} 
          isLoading={isLoading} 
        />

        {}
        <ContentRow 
          title="Streaming Now" 
          subtitle="Prime Video Hits" 
          items={homePrime} 
          isLoading={isLoading} 
        />

        {}
        <ContentRow 
          title="Indian Originals" 
          subtitle="Sony LIV Featured" 
          items={homeSonyLiv} 
          isLoading={isLoading} 
        />

        {}
        <ContentRow 
          title="Beyond Boundaries" 
          subtitle="Zee5 Trending" 
          items={homeZee5} 
          isLoading={isLoading} 
        />

        {}
        <ContentRow 
          title="Anime & Beyond" 
          subtitle="Crunchyroll Top 10" 
          items={homeCrunchyroll} 
          isLoading={isLoading} 
        />

        {}
        <ContentRow 
          title="MX Originals" 
          subtitle="MX Player Popular" 
          items={homeMxPlayer} 
          isLoading={isLoading} 
        />

        <div className="pb-10"></div>
      </div>
    </div>
  );
};

export default Home;
