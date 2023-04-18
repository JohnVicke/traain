import { NextResponse, type NextRequest } from "next/server";
import { withClerkMiddleware } from "@clerk/nextjs/server";

export default withClerkMiddleware((_req: NextRequest) => NextResponse.next());
