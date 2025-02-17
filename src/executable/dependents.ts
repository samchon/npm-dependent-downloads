#!/usr/bin/env node
import { getDependents, getDownload } from "../index";

interface IDependent {
  name: string;
  downloads: number;
}

const main = async (): Promise<void> => {
  const name: string | undefined = process.argv[2];
  const period: "day" | "week" | "month" | "year" = (process.argv[3] ??
    "month") as "month";
  if (!name?.length)
    throw new Error("Usage: npx @samchon/dependents <package>");

  const names: string[] = await getDependents(process.argv[2]);
  const dependents: IDependent[] = [];
  for (const n of names) {
    const value: number = await getDownload(n, period);
    dependents.push({
      name: n,
      downloads: value,
    });
  }
  dependents.sort((a, b) => b.downloads - a.downloads);
  for (const d of dependents) {
    console.log(`${d.name}: ${d.downloads.toLocaleString()}`);
  }
};
main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
