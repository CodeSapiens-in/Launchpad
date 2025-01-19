import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )


  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Get user's current stage
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("stage")
      .eq("user_id", user.id)
      .single();

    const stage = profile?.stage ?? -2; // Default to skill selection if no stage

    // Handle stage-based routing
    if (request.nextUrl.pathname === "/") {
      if (stage === -2) {
        return NextResponse.redirect(new URL("/welcome", request.url));
      }
      else if (stage === -1) {
        return NextResponse.redirect(new URL("/evaluation", request.url));
      } else {
        return NextResponse.redirect(new URL("/learn", request.url));
      }
    }
  } else if (request.nextUrl.pathname !== "/" && 
             request.nextUrl.pathname !== "/sign-in" && 
             !request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}
