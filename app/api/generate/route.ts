import dbconnect from "@/lib/dbconnect";
import { generateUniqueShortCode } from "@/lib/generateCode";
import Validation from "@/lib/urlValidation";
import Url, { IUrl } from "@/models/UrlSchema";
import { NextRequest, NextResponse } from "next/server";

interface UrlRequestBody {
  originalUrl: string;
}


export async function POST(req: NextRequest) {
  try {
    await dbconnect();

    const body: UrlRequestBody = await req.json();

    const isValid = Validation(body.originalUrl);

    if (!isValid) {
      // console.log("url invalid");
      return NextResponse.json(
        { message: "invalid url", success: false },
        { status: 400 }
      );
    }
    
    const OriginalUrl_Exist = await Url.findOne({
      originalUrl: body.originalUrl
    })

    if(OriginalUrl_Exist){
      return NextResponse.json({
        shortUrl: OriginalUrl_Exist.shortUrl,
        status: 200
      })
    }

    const shortCode = generateUniqueShortCode();

    const shortUrl  = `https://url-shortner-five-rho.vercel.app/${shortCode}`;

    const newUrl : IUrl  = await Url.create({
      originalUrl: body.originalUrl,
      UniqueCode: shortCode,
      shortUrl: shortUrl,
    });

    return NextResponse.json({
      shortUrl: shortUrl,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
