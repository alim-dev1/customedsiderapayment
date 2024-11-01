import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();
  const verify = request.cookies.get("loggedin");
  const role = request.cookies.get("role");
  const token = request.cookies.get("token");

  // Define protected routes
  const protectedRoutes = ["/home", "/confirmationpage"];

  if (!verify) {
    if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (role.value === "role" && token) {
    if (url.pathname.startsWith("/home")) {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
