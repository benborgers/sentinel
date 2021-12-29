import { ActionFunction, HeadersFunction, json } from "remix";
import prisma from "~/lib/prisma.server";

export const headers: HeadersFunction = () => ({
  "Access-Control-Allow-Origin": "*",
});

type ErrorType = {
  appName: string;
  message: string;
  stack: string;
  metadata?: object;
};

export const action: ActionFunction = async ({ request }) => {
  const error: ErrorType = await request.json();

  await prisma.error.create({
    data: {
      appName: error.appName,
      message: error.message,
      stack: error.stack,
      metadata: error.metadata,
    },
  });

  return json({ success: true });
};
