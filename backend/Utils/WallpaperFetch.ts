import { env } from "../env";
import exportedFetch from "./FixedNodeFetch";

export type Wallpaper = {
  imageUrl: string;
  thumbnail: string;
  original: string;
};
export const searchForWallpaper = async (
  query: string,
  page: number | number[]
): Promise<Wallpaper[]> => {
  let resultingData = await exportedFetch(
    `https://wall.alphacoders.com/api2.0/get.php?auth=${
      env.alphaCoders
    }&method=search&term=${encodeURIComponent(
      query
    )}&width=1920&height=1080&operator=min`
  ).then((res) => res.json());
  if ((resultingData as any).success) {
    // console.log(resultingData);
    if (Number((resultingData as any).total_match) > 30) {
      let secondPage = await exportedFetch(
        `https://wall.alphacoders.com/api2.0/get.php?auth=${
          env.alphaCoders
        }&method=search&term=${encodeURIComponent(
          query
        )}&width=1920&height=1080&operator=min&page=${1}`
      ).then((res) => res.json());
      if ((secondPage as any).success) {
        (resultingData as any).wallpapers = (
          (resultingData as any).wallpapers as any[]
        )?.concat((secondPage as any).wallpapers);
      }
      console.log({ secondPage });
      console.log({ thing: { resultingData } });
    }

    return (
      (resultingData as any)?.wallpapers?.map(
        (wallpaper: {
          id: string;
          width: string;
          height: string;
          file_type: string;
          file_size: string;
          url_image: string;
          url_thumb: string;
          url_page: string;
        }) =>
          ({
            imageUrl: wallpaper.url_image,
            thumbnail: wallpaper.url_thumb,
            original: wallpaper.url_page,
            provider: "Alphac",
          } as Wallpaper)
      ) ||
      console.log("nullo") ||
      []
    );
  }
  return [];
};
