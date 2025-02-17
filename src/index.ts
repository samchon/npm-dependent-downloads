export const getDependents = async (name: string): Promise<string[]> => {
  interface ISuccess {
    packages: IPackage[];
  }
  interface IPackage {
    name: string;
  }
  const get = async (offset: number): Promise<string[]> => {
    const url: string = `https://www.npmjs.com/browse/depended/${name}${offset !== 0 ? `?offset=${offset}` : ""}`;
    const success: ISuccess = await fetch(url, {
      headers: {
        "x-spiferack": "1",
      },
    }).then((r) => r.json());
    return success.packages.map((p) => p.name);
  };

  const libraries: string[] = [];
  while (true) {
    const newbie: string[] = await get(libraries.length);
    libraries.push(...newbie);
    if (newbie.length === 0) break;
  }
  return libraries;
};

export const getDownload = async (
  name: string,
  period: "day" | "week" | "month" | "year",
): Promise<number> => {
  interface ISuccess {
    downloads: number;
  }
  const url: string = `https://api.npmjs.org/downloads/point/last-${period}/${name}`;
  const success: ISuccess = await fetch(url).then((r) => r.json());
  return success.downloads;
};
