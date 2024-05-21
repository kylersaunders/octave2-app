// export const userService = {
//     // a service to get the user's id from a login token
//     getUserId: async (token: string) => {
//         const response = await fetch('https://api.spotify.com/v1/me', {
//             headers: {

import { generateRandomUserState } from '@/lib/utils';
import { kv } from '@vercel/kv';

// this service will allow you to create a user, generating an id for /create and storing it to KV
// it will allow you to create a token, verify a token, extract a user id from a token, and verify a user id
// the user id will not be the spotify id
// this app will roll it's own simple oauth to allow users to login and create playlists
// the user id will be a uuid
// the token will be a jwt
// the user id will be stored in KV
// the token will be stored in KV
// the token will have a short expiry
// the token will be signed with a secret
// the token will be verified with the secret
// the token will contain the user id
// the token will contain the expiry
// the token will contain the issued at
// the token will contain the audience
// the token will contain the issuer

export const userService = {
  // a service to get the user's id from a login token
  getUserId: async (token: string) => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    if (!response.ok) {
      throw new Error('user_id_failed');
    }
    const data = await response.json();
    return data.id;
  },
  // a service to create a user
  createUser: async () => {
    const userId = generateRandomUserState(16);
    await kv.set('userId', userId);
    return userId;
  },
  // a service to create a token
  createToken: async (userId: string) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
      audience: 'https://api.spotify.com/v1/me',
      issuer: 'https://api.spotify.com/v1/me',
    });
    await kv.set(userId, token);
    return token;
  },
  // a service to verify a token
  verifyToken: async (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (e) {
      throw new Error('token_verification_failed');
    }
  },
  // a service to extract a user id from a token
  extractUserId: async (token: string) => {
    const decoded = await userService.verifyToken(token);
    return decoded.userId;
  },
  // a service to verify a user id
  verifyUserId: async (userId: string) => {
    const token = await kv.get(userId);
    if (token === null) {
      throw new Error('user_id_not_found');
    }
    return userId;
  },
};
