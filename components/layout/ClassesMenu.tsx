"use client";

import {ChevronDown, ChevronRight} from "lucide-react";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";

import type {Lesson} from "@/content/types";
import {lessonBookingHref} from "@/lib/booking";
import {cn} from "@/lib/utils";

export function ClassesMenu({
  lessons,
  intro,
  mobileMenuVisible,
  onNavigate,
}: {
  lessons: Lesson[];
  intro: string;
  mobileMenuVisible?: boolean;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [activeLesson, setActiveLesson] = useState(lessons[0]);
  const suppressNextFocusOpen = useRef(false);
  const desktopTriggerRef = useRef<HTMLAnchorElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const previousMobileMenuVisible = useRef(mobileMenuVisible);

  useEffect(() => {
    if (previousMobileMenuVisible.current && !mobileMenuVisible) {
      setOpen(false);
    }

    previousMobileMenuVisible.current = mobileMenuVisible;
  }, [mobileMenuVisible]);

  if (!activeLesson) return null;

  const openMenu = () => {
    setActiveLesson(lessons[0]);
    setOpen(true);
  };

  const focusResponsiveTrigger = () => {
    const isMobile = window.matchMedia("(max-width: 860px)").matches;
    const trigger = isMobile
      ? mobileTriggerRef.current
      : desktopTriggerRef.current;
    trigger?.focus();
  };

  return (
    <li
      className="relative flex h-full items-center justify-center max-[860px]:block max-[860px]:h-auto"
      onMouseEnter={() => {
        if (window.matchMedia("(min-width: 861px)").matches) {
          openMenu();
        }
      }}
      onMouseLeave={() => {
        if (window.matchMedia("(min-width: 861px)").matches) {
          setOpen(false);
        }
      }}
      onFocus={() => {
        if (!window.matchMedia("(min-width: 861px)").matches) {
          return;
        }

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
          focusResponsiveTrigger();
        }
      }}
    >
      <div className="classes-menu-trigger-row">
        <a
          ref={desktopTriggerRef}
          href="/classes"
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls="classes-menu-desktop"
          className="classes-menu-link classes-menu-link-desktop"
          onClick={onNavigate}
        >
          Classes
        </a>
        <a
          href="/classes"
          className="classes-menu-link classes-menu-link-mobile"
          onClick={onNavigate}
        >
          Classes
        </a>
        <button
          ref={mobileTriggerRef}
          type="button"
          aria-label="Classes menu"
          aria-expanded={open}
          aria-controls="classes-menu-mobile"
          className="classes-menu-disclosure classes-menu-disclosure-mobile"
          onClick={() => setOpen((current) => !current)}
        >
          <ChevronDown aria-hidden="true" strokeWidth={1.5} />
        </button>
      </div>

      <nav
        id="classes-menu-desktop"
        aria-label="Desktop Classes submenu"
        aria-hidden={!open}
        data-state={open ? "open" : "closed"}
        className={cn(
          "classes-menu-shell absolute left-1/2 top-full w-[698px] -translate-x-1/2 pt-[var(--space-8)] max-[860px]:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          data-state={open ? "open" : "closed"}
          className="classes-menu-panel h-[488px] w-[698px] rounded-[4px] text-[var(--ink)]"
        >
          <div className="classes-menu-content grid h-full w-full grid-cols-[306.657px_333px] gap-[var(--space-10)] rounded-[4px] bg-[var(--background)] p-[var(--space-24)]">
            <div className="flex h-[440px] min-w-0 flex-col">
              <div className="flex w-full flex-col gap-[var(--space-20)]">
                <p className="mai-metanav-title w-full [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                  What I teach
                </p>
                <p className="mai-metanav-description w-full [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                  {intro}
                </p>
              </div>

              <div className="mt-[var(--space-32)] grid gap-[var(--space-10)]">
                {lessons.map((lesson) => {
                  return (
                    <a
                      key={lesson.slug}
                      href={lessonBookingHref(lesson.title)}
                      className="mai-metanav-title group flex h-[50px] items-center gap-[var(--space-16)] bg-[var(--hover-paper)] pl-[var(--space-10)] pr-[var(--space-12)] transition-colors duration-[600ms] ease-[var(--alias-easeOut)] focus-visible:outline-2"
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
                className="mai-metanav-title mt-auto w-fit underline-offset-4 hover:underline focus-visible:outline-2"
                onClick={onNavigate}
              >
                All Classes
              </a>
            </div>

            <a
              href={lessonBookingHref(activeLesson.title)}
              aria-label={`Book ${activeLesson.title} lesson`}
              className="group flex h-[440px] min-w-0 flex-col items-center gap-[var(--space-24)] bg-[var(--hover-paper)] px-[var(--space-16)] pb-[var(--space-30)] pt-[var(--space-16)] focus-visible:outline-2"
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
              <span className="flex min-w-0 w-full flex-col items-start gap-[var(--space-20)]">
                <span className="relative flex w-full items-center">
                  <span
                    data-testid="classes-menu-preview-title"
                    className="mai-metanav-title min-w-0 flex-1 pr-[var(--space-30)] underline-offset-4 transition-[text-decoration-color] duration-[600ms] [text-box-edge:cap_alphabetic] [text-box-trim:trim-both] group-hover:underline group-focus-visible:underline"
                  >
                    {activeLesson.title}
                  </span>
                  <ChevronRight
                    aria-hidden="true"
                    className="absolute right-0 top-1/2 h-[22px] w-[22px] -translate-x-1 -translate-y-1/2 opacity-0 transition-[opacity,transform] duration-[600ms] ease-[var(--alias-easeOut)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                    strokeWidth={1.5}
                  />
                </span>
                <span className="mai-metanav-description min-w-full [text-box-edge:cap_alphabetic] [text-box-trim:trim-both]">
                  {activeLesson.description}
                </span>
              </span>
            </a>
          </div>
        </div>
      </nav>

      <nav
        id="classes-menu-mobile"
        aria-label="Mobile Classes submenu"
        aria-hidden={!open}
        data-state={open ? "open" : "closed"}
        className="classes-menu-mobile-panel"
      >
        <div className="classes-menu-mobile-content">
          <div className="classes-menu-mobile-items">
            {lessons.map((lesson) => (
              <a
                key={lesson.slug}
                href={lessonBookingHref(lesson.title)}
                className="classes-menu-mobile-link"
                tabIndex={open ? 0 : -1}
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
                <span>{lesson.title}</span>
              </a>
            ))}
          </div>
          <a
            href="/classes"
            className="classes-menu-mobile-all"
            tabIndex={open ? 0 : -1}
            onClick={onNavigate}
          >
            <span>All Classes</span>
          </a>
        </div>
      </nav>
    </li>
  );
}
