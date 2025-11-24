export enum AspectRatio {
  Square = "1:1",
  Landscape = "16:9",
  Portrait = "9:16",
  StandardLandscape = "4:3",
  StandardPortrait = "3:4"
}

export enum ArtStyle {
  None = "No Style",
  Photorealistic = "Photorealistic",
  Anime = "Anime",
  Cinematic = "Cinematic",
  Surreal = "Surreal",
  Watercolor = "Watercolor",
  Moebius = "Moebius",
  HyperRealistic = "Hyper-realistic",
  Cyberpunk = "Cyberpunk",
  OilPainting = "Oil Painting",
  Sketch = "Pencil Sketch",
  PixelArt = "Pixel Art"
}

export interface GenerationResult {
  imageUrl: string | null;
  promptUsed: string;
}

export interface GenerationError {
  message: string;
}