"use client";

import {ChevronRight} from "lucide-react";
import Image from "next/image";
import {useRef, useState} from "react";

import type {Lesson} from "@/content/types";
import {cn} from "@/lib/utils";

const menuLessonSlugs = [
  "flute",
  "recorder",
  "piccolo",
  "music-theory",
  "ear-training",
];

export function ClassesMenu({
  label,
  lessons,
  onNavigate,
}: {
  label: string;
  lessons: Lesson[];
  onNavigate: () => void;
}) {
  const menuLessons = menuLessonSlugs
    .map((slug) => lessons.find((lesson) => lesson.slug === slug))
    .filter((lesson): lesson is Lesson => lesson != null);
  const [activeSlug, setActiveSlug] = useState(menuLessons[0]?.slug ?? "");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const activeLesson =
    menuLessons.find((lesson) => lesson.slug === activeSlug) ?? menuLessons[0];

  function openOnDesktop() {
    if (window.matchMedia("(min-width: 861px)").matches) {
      setOpen(true);
    }
  }

  function handleBlur(event: React.FocusEvent<HTMLLIElement>) {
    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLLIElement>) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  if (!activeLesson) {
    return null;
  }

  const activeHref = lessonHref(activeLesson);

  return (
    <li
      ref={rootRef}
      className="relative flex items-center justify-start py-[calc(14*var(--unit-fx))] max-[860px]:block max-[860px]:py-0"
      onMouseEnter={openOnDesktop}
      onMouseLeave={() => setOpen(false)}
      onFocus={openOnDesktop}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <a
        ref={triggerRef}
        href="/classes"
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(
          "block rounded-[calc(4*var(--unit-fx))] px-[calc(14*var(--unit-fx))] py-[calc(6*var(--unit-fx))] leading-[1.8] hover:bg-[var(--hover-paper)] max-[860px]:px-0 max-[860px]:py-0 max-[860px]:text-[16px]",
          open && "bg-[var(--hover-paper)]",
        )}
        onClick={onNavigate}
      >
        {label}
      </a>

      <div
        data-testid="classes-menu"
        role="group"
        aria-label="Classes menu"
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "absolute left-1/2 top-[calc(100%+12px)] z-50 flex min-h-[488px] w-[697.657px] -translate-x-1/2 items-start gap-[10px] rounded-[4px] bg-[var(--background)] p-[24px] text-[var(--ink)] shadow-[0_3px_50px_rgba(0,0,0,0.12)] transition-[opacity,transform,visibility] duration-200 ease-[var(--alias-easeOutCubic)] before:absolute before:-top-[12px] before:left-0 before:h-[12px] before:w-full before:content-[''] motion-reduce:transition-none max-[860px]:hidden",
          open
            ? "visible pointer-events-auto translate-y-0 opacity-100 [transition-delay:0ms]"
            : "invisible pointer-events-none translate-y-2 opacity-0 [transition-delay:0ms,0ms,200ms]",
        )}
      >
        <div className="flex w-[306.657px] shrink-0 flex-col gap-[32px]">
          <div className="font-ui flex flex-col gap-[16px] tracking-[-0.21px]">
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] text-[15px] leading-none">
              What I teach
            </p>
            <p className="[text-box-edge:cap_alphabetic] [text-box-trim:trim-both] whitespace-nowrap text-[12px] leading-[1.6]">
              Discover and choose what you want to learn
            </p>
          </div>

          <div className="flex flex-col gap-[10px]">
            {menuLessons.map((lesson) => (
              <a
                key={lesson.slug}
                href={lessonHref(lesson)}
                className="group/menu-item flex h-[50px] items-center gap-[8px] rounded-[2px] bg-[var(--hover-paper)] py-[5px] pl-[10px] pr-[12px] outline-none focus-visible:ring-1 focus-visible:ring-[var(--ink)]"
                onMouseEnter={() => setActiveSlug(lesson.slug)}
                onFocus={() => setActiveSlug(lesson.slug)}
                onClick={onNavigate}
              >
                <span className="relative h-[40px] w-[40px] shrink-0">
                  <Image
                    src={lesson.image}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </span>
                <span className="font-ui min-w-0 flex-1 [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] text-[15px] leading-none tracking-[-0.21px]">
                  {lesson.title}
                </span>
                <ChevronRight
                  aria-hidden="true"
                  strokeWidth={1.25}
                  className="h-[22px] w-[22px] shrink-0 opacity-0 transition-opacity duration-150 group-hover/menu-item:opacity-100 group-focus-visible/menu-item:opacity-100 motion-reduce:transition-none"
                />
              </a>
            ))}
          </div>

          <a
            href="/classes"
            className="font-ui w-fit [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] text-[15px] leading-none tracking-[-0.21px] underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
            onClick={onNavigate}
          >
            All classes
          </a>
        </div>

        <a
          data-testid="classes-menu-preview"
          href={activeHref}
          className="group/menu-preview flex min-h-[440px] w-[333px] shrink-0 flex-col items-center gap-[24px] bg-[var(--hover-paper)] px-[16px] pb-[28px] pt-[16px] outline-none focus-visible:ring-1 focus-visible:ring-[var(--ink)]"
          onClick={onNavigate}
        >
          <span className="relative block h-[260px] w-[260px] shrink-0">
            <Image
              src={activeLesson.image}
              alt=""
              fill
              sizes="260px"
              className="object-contain"
            />
          </span>
          <span className="flex w-full flex-col gap-[16px]">
            <span className="flex items-center gap-[16px]">
              <span className="font-ui min-w-0 flex-1 [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] text-[15px] leading-none tracking-[-0.21px] underline-offset-4 group-hover/menu-preview:underline group-focus-visible/menu-preview:underline">
                {activeLesson.title}
              </span>
              <ChevronRight
                aria-hidden="true"
                strokeWidth={1.25}
                className="h-[22px] w-[22px] shrink-0 opacity-0 transition-opacity duration-150 group-hover/menu-preview:opacity-100 group-focus-visible/menu-preview:opacity-100 motion-reduce:transition-none"
              />
            </span>
            <span className="font-ui [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] text-[12px] leading-[1.6] tracking-[-0.21px]">
              {activeLesson.description}
            </span>
          </span>
        </a>
      </div>
    </li>
  );
}

function lessonHref(lesson: Lesson) {
  return `/about?subject=${encodeURIComponent(lesson.title)}#contact`;
}
