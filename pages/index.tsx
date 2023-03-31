import type { GetServerSideProps } from 'next';

import { Title } from '@mantine/core';

/*** QUERY ***/
import { useQueries } from '@tanstack/react-query';

/*** COMPONENTS ***/
import Carousel from '@/components/product/product-carousel';

// Postgres views to query for
const views = ['get_specials', 'get_random_picks'];

import { prisma } from '../prisma/client';
import type { Prisma } from '@prisma/client';

export const getServerSideProps = async () => {
  const specials = await prisma.get_specials.findMany();
  const random_picks = await prisma.get_random_picks.findMany();

  return {
    props: {
      specials: JSON.parse(JSON.stringify(specials)),
      random_picks: JSON.parse(JSON.stringify(random_picks)),
    },
  };
};

export default function Home({
  specials,
  random_picks,
}: {
  // specials: Prisma.productsSelect;
  specials: any;
  random_picks: any;
}) {
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
      <div className="flex flex-col space-y-3">
        <Title order={2} weight={800} className="text-center">
          Weekly Specials
        </Title>

        <Carousel products={specials} />
      </div>
      <div className="flex flex-col space-y-3">
        <Title order={2} weight={800} className="text-center">
          Top Picks
        </Title>

        <Carousel products={random_picks} />
      </div>
    </div>
  );
}
