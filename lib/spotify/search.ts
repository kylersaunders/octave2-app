import 'server-only';

export const searchTrackByName = async ({ trackName, accessToken }: { trackName: string; accessToken: string }) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=track%3D${trackName}&type=track`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    if (!response.ok) {
      throw new Error('search_tracks_failed');
    }
    const data = await response.json();
    return data.tracks.items;
  } catch (e) {
    console.error('error', e);
    return [];
  }
};

export const searchTrackByArtist = async ({ artistName, accessToken }: { artistName: string; accessToken: string }) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=artist%3D${artistName}&type=track`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    if (!response.ok) {
      throw new Error('search_tracks_failed');
    }
    const data = await response.json();
    return data.tracks.items;
  } catch (e) {
    console.error('error', e);
    return [];
  }
};

export const searchTrackByAlbum = async ({ albumName, accessToken }: { albumName: string; accessToken: string }) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/search?q=album%3D${albumName}&type=track`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    if (!response.ok) {
      throw new Error('search_tracks_failed');
    }
    const data = await response.json();
    return data.tracks.items;
  } catch (e) {
    console.error('error', e);
    return [];
  }
};
