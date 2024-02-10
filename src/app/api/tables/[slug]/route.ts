import csv2json from "@/utils/csv2json";
import {NextRequest} from "next/server";

export async function GET(request: NextRequest, context: { params: { slug: string } }) {
  const { slug } = context.params

  const res = await fetch(`${process.env.APP_URL}/tables/${slug}.csv`).catch(null)

  if (!res || res.status !== 200) return new Response(null, { status: 404, statusText: "File not found" })

  const buffer = await res.arrayBuffer()
  const csv = new TextDecoder("ascii").decode(buffer)
  const json = csv2json(csv, ["city", "lat", "lng"], ",")

  return Response.json(json, { status: 200, statusText: "OK" })
}