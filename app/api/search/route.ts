import { getCachedToken, getHostUrl } from '@/lib/spotify/getCachedToken';
import { searchTrackByAlbum, searchTrackByArtist, searchTrackByName } from '@/lib/spotify/search';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getFeatures } from '@/lib/spotify/common';
import { EnhancedTrack } from '@/types/tracks';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    if (userId === undefined || userId === null) {
      return new NextResponse('User unauthorized', { status: 401 });
    }

    const { accessToken } = await getCachedToken({ userId });
    if (!accessToken) {
      return NextResponse.redirect(`${getHostUrl()}/api/spotify/login`);
    }
    const query = request.nextUrl.searchParams.get('q');
    const results: EnhancedTrack[] = [];
    if (query) {
      const trackResults = await searchTrackByName({ trackName: query, accessToken });
      const artistResults = await searchTrackByArtist({ artistName: query, accessToken });
      const albumResults = await searchTrackByAlbum({ albumName: query, accessToken });

      // dedupe results
      const seen: Set<string> = new Set();
      for (const track of [...trackResults, ...artistResults, ...albumResults]) {
        if (!seen.has(track.id)) {
          results.push(track);
          seen.add(track.id);
        }
      }

      // get features
      const features = await getFeatures({ trackIds: Array.from(seen), accessToken });

      // add features to each track
      for (const track of results) {
        const feature = features.find((f) => f?.id === track?.id);
        if (feature) {
          track.features = feature;
        }
      }

      return NextResponse.json(results);
    }

    return NextResponse.json('No query provided', { status: 400 });
  } catch (error) {
    console.error('Error in GET /api/route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
