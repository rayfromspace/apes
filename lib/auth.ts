import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function getSession() {
  const token = cookies().get("auth")?.value
  const userEmail = cookies().get("userEmail")?.value
  
  if (!token || !userEmail) return null
  
  return {
    token,
    email: userEmail
  }
}

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get("auth")?.value
  const userEmail = request.cookies.get("userEmail")?.value
  
  if (!token || !userEmail) {
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("auth")
    response.cookies.delete("userEmail")
    return response
  }

  return {
    token,
    email: userEmail
  }
}