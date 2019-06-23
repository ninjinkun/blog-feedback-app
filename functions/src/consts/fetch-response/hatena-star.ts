export interface HatenaStarReponse {
  entries: Entry[];
}

interface Entry {
  uri: string;
  stars?: Star[];
  colored_stars?: ColorStar[];
}

interface ColorStar {
  color: string;
  stars: Star[];
}

interface Star {
  name: string;
  quote: string;
}
