import { Title } from '@mantine/core';

/*** QUERY ***/
import { useQueries } from '@tanstack/react-query';

/*** COMPONENTS ***/
import LoadingSpinner from '@/components/loading-spinner';
import Carousel from '@/components/product/product-carousel';

import { Skeleton } from '@mantine/core';

// Postgres views to query for
const views = ['get_specials', 'get_random_picks'];

export default function Home() {
  /*** QUERY ***/
  const [specialsData, picksData] = useQueries({
    queries: views.map((view) => {
      return {
        queryKey: ['view', view],
        queryFn: () =>
          fetch(`/api/view?view=${view}`).then((response) => response.json()),
      };
    }),
  });

  return (
    <div className="space-y-10">
      <div className="space-y-3 flex flex-col">
        <Title order={2} weight={800} className="text-center">
          Weekly Specials
        </Title>

        {!specialsData?.data?.data ? (
          <Carousel />
        ) : (
          <Carousel products={specialsData?.data?.data} />
        )}
      </div>
      <div className="space-y-3 flex flex-col">
        <Title order={2} weight={800} className="text-center">
          Top Picks
        </Title>

        {!picksData?.data?.data ? (
          <Carousel />
        ) : (
          <Carousel products={picksData?.data?.data} />
        )}
      </div>
    </div>
  );
}
