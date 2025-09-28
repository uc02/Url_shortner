import { NextRequest, NextResponse } from "next/server";
import dbconnect from "../../lib/dbconnect";
import Url from "../../models/UrlSchema";



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  try {
    await dbconnect();

    const { shortId } = await params;

    if (!shortId || typeof shortId !== "string") {
      return NextResponse.json(
        { message: "Invalid short Url ID" },
        { status: 400 }
      );
    }

    const urlExist = await Url.findOne({ UniqueCode: shortId });

    if(!urlExist){
      return NextResponse.json(
        { message: 'No such shortUrl exist'},
        { status: 501}
      )
    }
    // console.log(urlExist)
    return NextResponse.redirect(new URL(urlExist.originalUrl))

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
