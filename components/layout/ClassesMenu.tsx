"use client";

import {ChevronRight} from "lucide-react";
import Image from "next/image";
import {useRef, useState} from "react";

import type {Lesson} from "@/content/types";
import {lessonBookingHref} from "@/lib/booking";
import {cn} from "@/lib/utils";

export function ClassesMenu({
  lessons,
  intro,
  onNavigate,
}: {
  lessons: Lesson[];
  intro: string;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState(lessons[0]);
  const suppressNextFocusOpen = useRef(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);

  if (!activeLesson) return null;

  const openMenu = () => {
    setActiveLesson(lessons[0]);
    setOpen(true);
  };

  return (
    <li
      className="relative flex h-full items-center justify-center max-[860px]:block max-[860px]:h-auto"
      onMouseEnter={openMenu}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => {
        if (suppressNextFocusOpen.current) {
          suppressNextFocusOpen.current = false;
          return;
        }
        setOpen(true);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          suppressNextFocusOpen.current = true;
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <a
        ref={triggerRef}
        href="/classes"
        aria-expanded={open}
        aria-controls="classes-menu"
        className="inline-flex h-[38px] items-center rounded-[4px] px-[10px] hover:bg-[var(--hover-paper)] max-[860px]:h-auto max-[860px]:px-0 max-[860px]:leading-[1.8]"
        onClick={onNavigate}
      >
        Classes
      </a>

      <nav
        id="classes-menu"
        aria-label="Classes submenu"
        aria-hidden={!open}
        data-state={open ? "open" : "closed"}
        className={cn(
          "absolute left-1/2 top-full w-[698px] -translate-x-1/2 pt-[9px] max-[860px]:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          data-state={open ? "open" : "closed"}
          className="classes-menu-panel h-[488px] w-[698px] rounded-[4px] text-[var(--ink)] shadow-[var(--shadow-menu-section)]"
        >
          <div className="classes-menu-content grid h-full w-full grid-cols-[306.657px_333px] gap-[10px] rounded-[4px] bg-[var(--background)] p-6">
            <div className="flex h-[440px] min-w-0 flex-col">
              <div className="flex w-full flex-col gap-5">
                <p className="w-full font-mono text-[16px] font-normal leading-none tracking-[-0.21px] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                  What I teach
                </p>
                <p className="w-full font-mono text-[14px] font-normal leading-[1.4] tracking-[-0.21px] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                  {intro}
                </p>
              </div>

              <div className="mt-8 grid gap-[10px]">
                {lessons.map((lesson) => {
                  return (
                    <a
                      key={lesson.slug}
                      href={lessonBookingHref(lesson.title)}
                      className="group flex h-[50px] items-center gap-4 bg-[var(--hover-paper)] pl-[10px] pr-3 font-mono text-[16px] font-normal leading-none tracking-[-0.21px] transition-colors duration-[600ms] ease-[var(--alias-easeOut)] focus-visible:outline-2"
                      onMouseEnter={() => setActiveLesson(lesson)}
                      onFocus={() => setActiveLesson(lesson)}
                      onClick={onNavigate}
                    >
                      <span className="relative h-10 w-10 shrink-0">
                        <Image
                          src={lesson.image}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-contain"
                        />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                      <ChevronRight
                        aria-hidden="true"
                        className="h-[22px] w-[22px] -translate-x-1 opacity-0 transition-[opacity,transform] duration-[600ms] ease-[var(--alias-easeOut)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                        strokeWidth={1.5}
                      />
                    </a>
                  );
                })}
              </div>

              <a
                href="/classes"
                className="mt-auto w-fit font-mono text-[16px] font-normal leading-none tracking-[-0.21px] underline-offset-4 hover:underline focus-visible:outline-2"
                onClick={onNavigate}
              >
                All Classes
              </a>
            </div>

            <a
              href={lessonBookingHref(activeLesson.title)}
              aria-label={`Book ${activeLesson.title} lesson`}
              className="group flex h-[440px] min-w-0 flex-col items-center gap-6 bg-[var(--hover-paper)] px-4 pb-7 pt-4 focus-visible:outline-2"
              onClick={onNavigate}
            >
              <span className="relative block h-[260px] w-[260px] shrink-0">
                <Image
                  data-testid="classes-menu-preview-image"
                  src={activeLesson.image}
                  alt=""
                  fill
                  sizes="260px"
                  className="object-contain"
                />
              </span>
              <span className="flex min-w-0 w-full flex-col items-start gap-5">
                <span className="relative flex w-full items-center">
                  <span
                    data-testid="classes-menu-preview-title"
                    className="min-w-0 flex-1 pr-[30px] font-mono text-[16px] font-normal leading-none tracking-[-0.21px] underline-offset-4 transition-[text-decoration-color] duration-[600ms] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] group-hover:underline group-focus-visible:underline"
                  >
                    {activeLesson.title}
                  </span>
                  <ChevronRight
                    aria-hidden="true"
                    className="absolute right-0 top-1/2 h-[22px] w-[22px] -translate-x-1 -translate-y-1/2 opacity-0 transition-[opacity,transform] duration-[600ms] ease-[var(--alias-easeOut)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    strokeWidth={1.5}
                  />
                </span>
                <span className="min-w-full font-mono text-[14px] font-normal leading-[1.4] tracking-[-0.21px] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                  {activeLesson.description}
                </span>
              </span>
            </a>
          </div>
        </div>
      </nav>
    </li>
  );
}
