
import { Artist } from '../data/knowledgeGraphSchema';

const BASE_URL = 'https://musicbrainz.org/ws/2';

export const searchArtist = async (artistName: string): Promise<Artist[]> => {
  try {
    const response = await fetch(`${BASE_URL}/artist/?query=artist:${artistName}&fmt=json`, {
      headers: {
        'User-Agent': 'KalaKrut/1.0.0 ( a@b.com )'
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching data from MusicBrainz: ${response.statusText}`);
    }
    const data = await response.json();
    return data.artists.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      bio: artist.disambiguation || ''
    }));
  } catch (error) {
    console.error('Error in searchArtist:', error);
    return [];
  }
};
