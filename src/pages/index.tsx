import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { useState } from 'react';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingSpinner } from '../components/Loading';
import { toast } from "react-hot-toast";
import Link from "next/link";

dayjs.extend(relativeTime);

const CreateEventForm: React.FC = () => {
  const { data: sessionData } = useSession();

  const [title, setTitle] = useState('');

  if (!sessionData?.user) return null;

  const ctx = api.useContext();

  const { mutate, isLoading: isCreatingEvent } = api.events.create.useMutation({
    onSuccess: () => {
      setTitle('');
      void ctx.events.getAll.invalidate();
    },
    onError: (error) => {
      const errorMessage = error.data?.zodError?.fieldErrors.title;

      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error('Failed to create event! Please try again later.');
      }
    }
  });

  return (
    <div className="flex gap-4 w-full">
      <Image
        className="w-24 h-24 rounded-full"
        src={sessionData.user.image || ''}
        alt="Profile image"
        width={56}
        height={56}
      />
      <input
        placeholder="Create an event..."
        className="bg-transparent outline-none grow"
        type="text"
        onChange={(event) => setTitle(event.currentTarget.value)}
        value={title}
        disabled={isCreatingEvent}
      />
      {title !== '' && !isCreatingEvent && (
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={() => { mutate({ title }); }}
          disabled={isCreatingEvent}
        >
          Create
        </button>
      )}
      {isCreatingEvent && (<LoadingSpinner size="small" />)}
    </div>
  );
}

type EventWithUser = RouterOutputs["events"]["getAll"][number];

const EventCard = (event: EventWithUser) => {
  return (
    <div
      className="p-8 border-b border-slate-400 flex gap-8 items-center"
    >
      <Image
        className="w-12 h-12 rounded-full"
        src={event.author.image || ''}
        alt="Profile image"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <Link href={`/${event.author.name}`}>
            <span>{event.author.name}</span>
          </Link>
          <Link href={`/event/${event.id}`}>
            <span className="font-thin">&nbsp;{`· ${dayjs(event.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <div className="text-xl">{event.title}</div>
      </div>
    </div>
  )
}

const Events: React.FC = () => {
  const { data, isLoading: areEventsLoading } = api.events.getAll.useQuery();

  if (areEventsLoading) return <LoadingSpinner className="h-full grow" />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((event) => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>
  )
}

const Home: NextPage = () => {
  const { status: sessionStatus } = useSession();

  api.events.getAll.useQuery();

  if (sessionStatus === 'loading') return <div />;

  return (
    <main className="flex justify-center h-full">
      <div className="flex flex-col w-full min-h-screen h-full md:max-w-2xl border-x border-slate-200">
        <div className="border-b border-slate-400 p-4">
          <AuthShowcase />
        </div>
        <div className="border-b border-slate-400 p-4">
          <CreateEventForm />
        </div>
        <Events />
      </div>
    </main>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="text-center text-2xl text-white">
        {sessionData && sessionData.user &&
          <div className="flex justify-between items-center gap-8">
            <span>Logged in as {sessionData.user.name}</span>
          </div>
          }
      </div>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
