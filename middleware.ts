import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  console.log('Request Method:', req.method); // Log the request method
  console.log('Request URL:', req.url); // Log the requested URL

  if (req.body) {
    const body = await req.json();
    console.log('Request Body:', body); // Log the request body
  }

  const res = NextResponse.next(); // Continue processing the request

  // Optionally, you can log response details as well
  console.log('Response:', res.status);

  return res;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
