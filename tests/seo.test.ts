import type {Metadata} from "next";
import {describe, expect, it} from "vitest";

import {metadata as privacyMetadata} from "@/app/datenschutz/page";
import {metadata as impressumMetadata} from "@/app/impressum/page";
import {siteContent} from "@/content/site";
import type {AudienceLessonContent} from "@/content/types";
import * as seo from "@/lib/seo";

type SeoContract = typeof seo & {
  audienceLessonMetadata: (content: AudienceLessonContent) => Metadata;
  serializeJsonLd: (value: unknown) => string;
  serviceStructuredData: (content: AudienceLessonContent) => Record<string, unknown>;
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
    expect(contract.audienceLessonMetadata).toBeTypeOf("function");
    expect(
      contract.audienceLessonMetadata(siteContent.audienceLessons.adults).title,
    ).toBe("Online Flute Lessons for Adults");
  });

  it("provides canonical Open Graph and Twitter data for indexed pages", () => {
    expect(contract.audienceLessonMetadata).toBeTypeOf("function");
    const metadata = contract.audienceLessonMetadata(
      siteContent.audienceLessons.children,
    );

    expect(metadata.alternates).toEqual({
      canonical: seo.siteUrl("/online-flute-lessons-for-children"),
    });
    expect(metadata.openGraph).toEqual(
      expect.objectContaining({
        title: "Online Flute Lessons for Children",
        url: seo.siteUrl("/online-flute-lessons-for-children"),
        type: "website",
        images: [
          expect.objectContaining({
            url: seo.siteUrl("/images/media/open-lesson-preview.png"),
            width: 1672,
            height: 941,
          }),
        ],
      }),
    );
    expect(metadata.twitter).toEqual(
      expect.objectContaining({
        card: "summary_large_image",
        title: "Online Flute Lessons for Children",
      }),
    );
  });

  it("serializes JSON-LD without allowing a closing script tag", () => {
    expect(contract.serializeJsonLd).toBeTypeOf("function");
    expect(contract.serializeJsonLd({value: "</script>"})).toContain(
      "\\u003c/script>",
    );
  });

  it("uses one canonical Person for the WebSite and both Services", () => {
    expect(contract.siteStructuredData).toBeTypeOf("function");
    expect(contract.serviceStructuredData).toBeTypeOf("function");

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

    for (const content of Object.values(siteContent.audienceLessons)) {
      expect(contract.serviceStructuredData(content)).toEqual(
        expect.objectContaining({
          "@type": "Service",
          name: content.title,
          provider: {"@id": personId},
          url: seo.siteUrl(content.path),
        }),
      );
    }
  });

  it("keeps legal placeholders crawlable but out of search results", () => {
    expect(impressumMetadata.robots).toEqual({index: false, follow: true});
    expect(privacyMetadata.robots).toEqual({index: false, follow: true});
  });
});
