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
        className="classes-menu-panel absolute left-1/2 top-[calc(100%+9px)] grid h-[488px] w-[698px] -translate-x-1/2 grid-cols-[306px_333px] gap-[11px] rounded-[5px] bg-[var(--background)] p-6 text-[var(--ink)] shadow-[0_3px_50px_rgba(0,0,0,0.12)] before:absolute before:-top-[9px] before:left-0 before:h-[9px] before:w-full before:content-[''] max-[860px]:hidden"
      >
        <div className="flex h-[440px] min-w-0 flex-col">
          <div>
            <p className="mai-ui">Classes</p>
            <p className="mai-caption mt-2 max-w-[280px] text-[var(--muted)]">
              {intro}
            </p>
          </div>

          <div className="mt-5 grid gap-[10px]">
            {lessons.map((lesson) => {
              const active = lesson.slug === activeLesson.slug;

              return (
                <a
                  key={lesson.slug}
                  href={lessonBookingHref(lesson.title)}
                  className={cn(
                    "group flex h-[50px] items-center gap-3 rounded-[3px] bg-[var(--paper)] px-3 transition-colors duration-[600ms] ease-[var(--alias-easeOut)] focus-visible:outline-2",
                    active && "bg-[var(--hover-paper)]",
                  )}
                  onMouseEnter={() => setActiveLesson(lesson)}
                  onFocus={() => setActiveLesson(lesson)}
                  onClick={onNavigate}
                >
                  <span className="relative h-8 w-8 shrink-0">
                    <Image
                      src={lesson.image}
                      alt=""
                      fill
                      sizes="32px"
                      className="object-contain"
                    />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                  <ChevronRight
                    aria-hidden="true"
                    className="h-4 w-4 -translate-x-1 opacity-0 transition-[opacity,transform] duration-[600ms] ease-[var(--alias-easeOut)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    strokeWidth={1.5}
                  />
                </a>
              );
            })}
          </div>

          <a
            href="/classes"
            className="mai-ui mt-auto w-fit underline-offset-4 hover:underline focus-visible:outline-2"
            onClick={onNavigate}
          >
            All Classes
          </a>
        </div>

        <a
          href={lessonBookingHref(activeLesson.title)}
          aria-label={`Book ${activeLesson.title} lesson`}
          className="group flex h-[440px] min-w-0 flex-col rounded-[3px] bg-[var(--paper)] p-4 focus-visible:outline-2"
          onClick={onNavigate}
        >
          <span className="relative block h-[230px] w-full">
            <Image
              data-testid="classes-menu-preview-image"
              src={activeLesson.image}
              alt=""
              fill
              sizes="301px"
              className="object-contain"
            />
          </span>
          <span className="mt-auto flex items-center gap-3">
            <span
              data-testid="classes-menu-preview-title"
              className="mai-h7 min-w-0 flex-1 underline-offset-4 transition-[text-decoration-color] duration-[600ms] group-hover:underline group-focus-visible:underline"
            >
              {activeLesson.title}
            </span>
            <ChevronRight
              aria-hidden="true"
              className="h-5 w-5 -translate-x-1 opacity-0 transition-[opacity,transform] duration-[600ms] ease-[var(--alias-easeOut)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
              strokeWidth={1.5}
            />
          </span>
          <span className="mai-caption mt-4 line-clamp-4 text-[var(--muted)]">
            {activeLesson.description}
          </span>
        </a>
      </nav>
    </li>
  );
}
