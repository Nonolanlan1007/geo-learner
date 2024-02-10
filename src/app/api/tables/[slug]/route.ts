import csv2json from "@/utils/csv2json";
import {promises as fs} from "fs";
import {redirect} from "next/navigation";
import {NextRequest} from "next/server";
import iconv from "iconv-lite"

export async function GET(request: NextRequest, context: { params: { slug: string } }) {
  const { slug } = context.params

  const csv = await fs.readFile(process.cwd() + `/public/tables/${slug}.csv`).catch(() => null)

  if (!csv) return new Response(null, { status: 404, statusText: "File not found" })

  const utf8Data = iconv.decode(csv, 'ISO-8859-1');

  console.log(utf8Data)

  const json = csv2json(utf8Data, ["city", "lat", "lng"], ",")

  return Response.json(json, { status: 200, statusText: "OK" })
}