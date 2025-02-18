#!/usr/bin/env node
import { getDependents, getDownload } from "../index";

interface IDependent {
  name: string;
  downloads: number;
}

const main = async (): Promise<void> => {
  const target: string | undefined = process.argv[2];
  const period: "day" | "week" | "month" | "year" = (process.argv[3] ??
    "month") as "month";
  if (!target?.length)
    throw new Error("Usage: npx @samchon/dependents <package>");

  const dependents: IDependent[] = [];
  for (const name of await getDependents(process.argv[2])) {
    const value: number = await getDownload(name, period);
    dependents.push({
      name,
      downloads: value,
    });
  }

  dependents.sort((a, b) => b.downloads - a.downloads);
  console.log(
    `${target}: ${(await getDownload(target, period)).toLocaleString()}`,
  );
  console.log("--------------------------------------------");
  for (const d of dependents)
    console.log(`${d.name}: ${d.downloads.toLocaleString()}`);
};
main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
