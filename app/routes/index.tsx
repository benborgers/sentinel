import { MetaFunction, HeadersFunction, LoaderFunction, redirect } from "remix";
import { useLoaderData, json } from "remix";
import prisma from "~/lib/prisma.server";
import { Prisma } from "@prisma/client";

export const meta: MetaFunction = () => ({
  title: "Sentinel",
});

export const headers: HeadersFunction = () => ({
  "WWW-Authenticate": "Basic",
});

type Error = {
  id: string;
  appName: string;
  message: string;
  stack: string;
  metadata?: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
};

type LoaderData = {
  authorized: boolean;
  errors: Array<Error>;
};

export const loader: LoaderFunction = async ({ request }) => {
  if (!isAuthorized(request)) {
    return json({ authorized: false }, { status: 401 });
  }

  const params = new URLSearchParams(new URL(request.url).search);
  const page = parseInt(params.get("page") || "0");

  if (page < 0) return redirect("/");

  const PER_PAGE = 25;

  const errors = await prisma.error.findMany({
    orderBy: { createdAt: "desc" },
    take: PER_PAGE,
    skip: page * PER_PAGE,
  });

  return json<LoaderData>({ authorized: true, errors });
};

export default function Index() {
  const data: LoaderData = useLoaderData();

  if (!data.authorized) {
    return <p>Unauthorized</p>;
  }

  return (
    <div className="max-w-screen-sm mx-auto">
      <div className="space-y-4 sm:space-y-6">
        {data.errors.map((error) => (
          <div
            key={error.id}
            className="bg-white shadow border border-gray-200 p-4 rounded-xl"
          >
            <div className="flex gap-x-3 items-start">
              <p className="mt-0.5 text-red-600 bg-red-100 px-2 py-0.5 rounded-lg max-w-max font-medium text-sm">
                {error.appName}
              </p>
              <p className="text-xl font-bold text-gray-900">{error.message}</p>
            </div>

            <pre className="overflow-scroll mt-4 bg-gray-900 text-white text-sm rounded-lg p-3">
              {" "}
              {error.stack}{" "}
            </pre>

            {Object.keys(error.metadata || {}).length > 0 && (
              <div className="mt-4 flex flex-wrap">
                {Object.keys(error.metadata as Prisma.JsonObject).map((key) => (
                  <div
                    key={key}
                    className="flex items-center border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="py-0.5 px-2 bg-gray-200 h-full flex items-center">
                      <p className="text-gray-600 text-sm font-medium">{key}</p>
                    </div>
                    <p className="py-0.5 px-2 font-mono text-gray-800">
                      {(error.metadata as Prisma.JsonObject)?.[key]?.toString()}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-2 border-t border-gray-200">
              <p className="text-gray-400">
                {new Date(error.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const isAuthorized = (request: Request): boolean => {
  const header = request.headers.get("Authorization");

  if (!header) return false;

  const base64 = header.replace("Basic ", "");
  const [username, password] = Buffer.from(base64, "base64")
    .toString()
    .split(":");

  return username === process.env.USERNAME && password === process.env.PASSWORD;
};
