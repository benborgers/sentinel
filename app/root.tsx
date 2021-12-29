import type { LinksFunction } from "remix";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";

import TailwindUrl from "~/styles/tailwind-build.css";
export let links: LinksFunction = () => [
  { rel: "icon", href: "https://emojicdn.elk.sh/⚔️" },
  { rel: "stylesheet", href: TailwindUrl },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-100 px-4 pb-24 pt-4 sm:pt-8 text-gray-700">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
