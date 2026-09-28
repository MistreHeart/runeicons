import { getEditorAssets } from "@/lib/editor/assets";

export const dynamic = "force-static";

// Served as a static file. The editor page requests it with a content hash in
// the query string, so browsers can cache it for a year (see next.config.ts).
export async function GET() {
  return Response.json(await getEditorAssets());
}
