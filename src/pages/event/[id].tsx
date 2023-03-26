import { type NextPage } from "next";
import Head from "next/head";
import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

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
          <span>{event.author.name}</span>
          <span className="font-thin">&nbsp;{`· ${dayjs(event.createdAt).fromNow()}`}</span>
        </div>
        <div className="text-xl">{event.title}</div>
      </div>
    </div>
  )
}

const EventPage: NextPage = () => {

  return (
    <>
      <Head>
        <title>Event</title>
      </Head>
      <main className="flex justify-center h-full">
        <div>Event view</div>
      </main>
    </>
  );
};

export default EventPage;
