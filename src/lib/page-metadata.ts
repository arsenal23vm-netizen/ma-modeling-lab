import type { Metadata } from "next";

const deploymentBase = "https://arsenal23vm-netizen.github.io/financial-modeling-lab";

export function createPageMetadata(route: `/${string}`, metadata: Metadata): Metadata {
  if (typeof metadata.title !== "string" || typeof metadata.description !== "string") {
    throw new TypeError(`Page metadata for ${route} requires explicit title and description strings`);
  }

  const canonical = `${deploymentBase}${route}`;

  return {
    ...metadata,
    alternates: { ...metadata.alternates, canonical },
    openGraph: {
      ...metadata.openGraph,
      title: metadata.title,
      description: metadata.description,
      url: canonical,
      type: "website",
    },
  };
}
