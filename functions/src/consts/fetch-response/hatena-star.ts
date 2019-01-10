export type HatenaStarReponse = {
  entries: Entry[];
};

type Entry = {
  uri: string;
  stars?: Star[];
  colored_stars?: ColorStar[];
};

type ColorStar = {
  color: string;
  stars: Star[];
};

type Star = {
  name: string;
  quote: string;
};
