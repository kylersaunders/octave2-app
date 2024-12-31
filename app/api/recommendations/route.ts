import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import * as changeCase from 'change-case';
import { getCachedToken } from '@/lib/spotify/getCachedToken';

export async function GET(request: NextRequest, response: Response) {
  const { userId } = auth();
  if (userId === undefined || userId === null) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { accessToken } = await getCachedToken({ userId });
  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  const recommendationsBody = new URLSearchParams();
  for (const [key, value] of request.nextUrl.searchParams.entries()) {
    recommendationsBody.append(changeCase.snakeCase(key), value);
  }

  console.log('***', recommendationsBody.toString());

  try {
    const response = await fetch('https://api.spotify.com/v1/recommendations?' + recommendationsBody.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return new Response('recommendations_failed', { status: 500 });
    }

    const res = await response.json();

    if (!res.tracks.length) console.log('res', res);

    return new Response(JSON.stringify(res.tracks), { status: 200 });
  } catch (e) {
    console.error('error', e);
    return new Response('Error fetching recommendations', { status: 500 });
  }
}
