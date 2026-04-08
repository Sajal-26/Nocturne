import React, { useEffect } from 'react';
import { useMovieStore } from '../store/useMovieStore';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import BentoSpotlight from '../components/BentoSpotlight';

const Home = () => {
  const homeTrending = useMovieStore((state) => state.homeTrending);
  const homeNetflix = useMovieStore((state) => state.homeNetflix);
  const homePrime = useMovieStore((state) => state.homePrime);
  const homeApple = useMovieStore((state) => state.homeApple);
  const homeZee5 = useMovieStore((state) => state.homeZee5);
  const homeSonyLiv = useMovieStore((state) => state.homeSonyLiv);
  const homeMxPlayer = useMovieStore((state) => state.homeMxPlayer);
  const homeCrunchyroll = useMovieStore((state) => state.homeCrunchyroll);
  const homeHotstar = useMovieStore((state) => state.homeHotstar);
  const homeTrendingLoading = useMovieStore((state) => state.homeTrendingLoading);
  const homeNetflixLoading = useMovieStore((state) => state.homeNetflixLoading);
  const homePrimeLoading = useMovieStore((state) => state.homePrimeLoading);
  const homeAppleLoading = useMovieStore((state) => state.homeAppleLoading);
  const homeZee5Loading = useMovieStore((state) => state.homeZee5Loading);
  const homeSonyLivLoading = useMovieStore((state) => state.homeSonyLivLoading);
  const homeMxPlayerLoading = useMovieStore((state) => state.homeMxPlayerLoading);
  const homeCrunchyrollLoading = useMovieStore((state) => state.homeCrunchyrollLoading);
  const homeHotstarLoading = useMovieStore((state) => state.homeHotstarLoading);
  const fetchHomeData = useMovieStore((state) => state.fetchHomeData);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative">
        <Hero />
      </div>

      <div className="relative z-10 bg-[#000000]">
        <BentoSpotlight
          trending={homeTrending}
          netflix={homeNetflix}
          prime={homePrime}
          isLoading={homeTrendingLoading}
        />

        <ContentRow
          title="Global Hits"
          subtitle="Trending Week (Movies & TV)"
          items={homeTrending.slice(5, 25)}
          isLoading={homeTrendingLoading}
        />

        <ContentRow
          title="Weekly Charts"
          subtitle="Netflix Global Top 10"
          items={homeNetflix}
          isLoading={homeNetflixLoading}
        />

        <ContentRow
          title="Premium Discovery"
          subtitle="Apple TV+ Originals"
          items={homeApple}
          isLoading={homeAppleLoading}
        />

        <ContentRow
          title="Hotstar Popular"
          subtitle="Disney + Hotstar Special"
          items={homeHotstar}
          isLoading={homeHotstarLoading}
        />

        <ContentRow
          title="Streaming Now"
          subtitle="Prime Video Hits"
          items={homePrime}
          isLoading={homePrimeLoading}
        />

        <ContentRow
          title="Indian Originals"
          subtitle="Sony LIV Featured"
          items={homeSonyLiv}
          isLoading={homeSonyLivLoading}
        />

        <ContentRow
          title="Beyond Boundaries"
          subtitle="Zee5 Trending"
          items={homeZee5}
          isLoading={homeZee5Loading}
        />

        <ContentRow
          title="Anime & Beyond"
          subtitle="Crunchyroll Top 10"
          items={homeCrunchyroll}
          isLoading={homeCrunchyrollLoading}
        />

        <ContentRow
          title="MX Originals"
          subtitle="MX Player Popular"
          items={homeMxPlayer}
          isLoading={homeMxPlayerLoading}
        />

        <div className="pb-10" />
      </div>
    </div>
  );
};

export default Home;
