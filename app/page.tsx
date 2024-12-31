import 'server-only';

import { checkConnectedWithSpotify } from '@/actions/spotify/checkAuthorization';
import Home from './components/Home';
import { authorizeSpotify } from '@/actions/spotify/authorizeSpotify';
import Authorize from './components/authorize/AuthorizeSpotify';

export default async function HomeServer() {
  try {
    const connected = await checkConnectedWithSpotify();
    if (!connected) {
      return <Authorize authorize={authorizeSpotify} />;
    }
  } catch (e) {
    return <>There was an error checking your connection with Spotify</>;
  }

  return <Home />;
}
