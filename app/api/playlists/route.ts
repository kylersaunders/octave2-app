import { NextResponse } from 'next/server';
import { getUserPlaylists, deletePlaylist, getPlaylistTracks, createPlaylist, addTracksToPlaylist } from '@/lib/spotify/playlists';
import { getCachedToken } from '@/lib/auth/auth';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('User unauthorized', { status: 401 });
    }

    const { accessToken } = await getCachedToken({ userId });
    if (!accessToken) {
      return new NextResponse('Access token is missing or expired', { status: 401 });
    }

    const playlists = await getUserPlaylists({ accessToken });
    return NextResponse.json(playlists);
  } catch (error) {
    console.error('Error in GET /api/playlists:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get('playlistId');

  if (!playlistId) {
    return NextResponse.json({ error: 'Playlist ID is required' }, { status: 400 });
  }

  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('User unauthorized', { status: 401 });
    }

    const { accessToken } = await getCachedToken({ userId });
    if (!accessToken) {
      return new NextResponse('Access token is missing or expired', { status: 401 });
    }

    await deletePlaylist({ playlistId, accessToken });
    return NextResponse.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/playlists:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get('playlistId');

  if (!playlistId) {
    return NextResponse.json({ error: 'Playlist ID is required' }, { status: 400 });
  }

  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('User unauthorized', { status: 401 });
    }

    const { accessToken } = await getCachedToken({ userId });
    if (!accessToken) {
      return new NextResponse('Access token is missing or expired', { status: 401 });
    }

    const tracks = await getPlaylistTracks({ playlistId, accessToken });
    return NextResponse.json(tracks);
  } catch (error) {
    console.error('Error in POST /api/playlists:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
