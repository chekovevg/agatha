import {describe, expect, it} from "vitest";

import {metadata as privacyMetadata} from "@/app/datenschutz/page";
import {metadata as impressumMetadata} from "@/app/impressum/page";
import * as seo from "@/lib/seo";

type SeoContract = typeof seo & {
  serializeJsonLd: (value: unknown) => string;
  siteStructuredData: () => {
    "@context": string;
    "@graph": Record<string, unknown>[];
  };
};

const contract = seo as SeoContract;

describe("SEO metadata and structured data", () => {
  it("uses an absolute home title and unbranded child titles", () => {
    expect(seo.landingMetadata().title).toEqual({
      absolute: "Online Flute Lessons with Agatha Gurko | Agatha Music",
    });
    expect(seo.aboutMetadata().title).toBe("About Agatha Gurko");
  });

  it("serializes JSON-LD without allowing a closing script tag", () => {
    expect(contract.serializeJsonLd).toBeTypeOf("function");
    expect(contract.serializeJsonLd({value: "</script>"})).toContain(
      "\\u003c/script>",
    );
  });

  it("uses one canonical Person for the WebSite", () => {
    expect(contract.siteStructuredData).toBeTypeOf("function");

    const personId = `${seo.siteUrl("/")}#agatha-gurko`;
    const graph = contract.siteStructuredData()["@graph"];
    const person = graph.find((item) => item["@type"] === "Person");
    const website = graph.find((item) => item["@type"] === "WebSite");

    expect(person).toEqual(
      expect.objectContaining({
        "@id": personId,
        name: "Agatha Gurko",
        alternateName: "Agafiia Gurko",
        jobTitle: "Flutist and music teacher",
        sameAs: [
          "https://www.lessonface.com/instructor/agafiia-gurko",
        ],
      }),
    );
    expect(website).toEqual(
      expect.objectContaining({publisher: {"@id": personId}}),
    );
  });

  it("keeps legal placeholders crawlable but out of search results", () => {
    expect(impressumMetadata.robots).toEqual({index: false, follow: true});
    expect(privacyMetadata.robots).toEqual({index: false, follow: true});
  });
});
