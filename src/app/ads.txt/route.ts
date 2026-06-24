import { getAdsTxtPublisherId } from "@/lib/adConfig";

export async function GET() {
  const publisherId = getAdsTxtPublisherId();

  if (!publisherId) {
    return new Response(
      "# Google AdSense publisher ID is not configured yet.\n",
      {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }

  return new Response(
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    },
  );
}
