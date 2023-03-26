import type { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '~/server/api/root';
import { prisma } from '~/server/db';
import superjson from 'superjson';

interface IPageProps {
  username: string;
}

type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const ProfilePage: NextPage<PageProps> = ({ username }) => {
  console.log('Inside of the component before query', username);
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  console.log('Inside of the component after query', data?.name);

  if (!data) return <div>404. Not found</div>;

  return (
    <>
      <Head>
        <title>{data.name}</title>
      </Head>
      <main className="flex justify-center h-full">
        <div>{data.name}</div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<IPageProps> = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, session: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  console.log('Inside of SSG helper', slug);

  if (typeof slug !== 'string') {
    throw new Error('No slug');
  }

  await ssg.profile.getUserByUsername.prefetch({ username: slug });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username: slug,
    }
  }
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export default ProfilePage;
