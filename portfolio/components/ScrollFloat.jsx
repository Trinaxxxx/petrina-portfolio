'use client';

import { createElement, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  scrollContainerRef = null,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  /* When true, the characters float in once on mount instead of being tied to
     scroll position — used for above-the-fold headlines that must land fully
     formed and be reduced-motion safe. */
  playOnLoad = false,
  delay = 0,
  as = 'h2'
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split('').map((char, index) => (
      <span className="char" key={index}>
        {char === ' ' ? ' ' : char}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const charElements = el.querySelectorAll('.char');

    // Reduced motion: show the headline instantly, no float.
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(charElements, { opacity: 1, yPercent: 0, scaleY: 1, scaleX: 1 });
      return;
    }

    const fromVars = {
      willChange: 'opacity, transform',
      opacity: 0,
      yPercent: 120,
      scaleY: 2.3,
      scaleX: 0.7,
      transformOrigin: '50% 0%'
    };
    const toVars = {
      duration: animationDuration,
      ease,
      opacity: 1,
      yPercent: 0,
      scaleY: 1,
      scaleX: 1,
      stagger
    };

    if (playOnLoad) {
      const tween = gsap.fromTo(charElements, fromVars, { ...toVars, delay });
      return () => {
        tween.kill();
      };
    }

    const scroller =
      scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;
    const tween = gsap.fromTo(charElements, fromVars, {
      ...toVars,
      scrollTrigger: {
        trigger: el,
        scroller,
        start: scrollStart,
        end: scrollEnd,
        scrub: true
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger, playOnLoad, delay]);

  return createElement(
    as,
    { ref: containerRef, className: `scroll-float ${containerClassName}` },
    <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
  );
};

export default ScrollFloat;
