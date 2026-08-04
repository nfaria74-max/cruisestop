(function () {
  "use strict";

  let active = false;
  let startX = 0;
  let startY = 0;
  let lastY = 0;

  function pageY() {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function canScrollPage() {
    return document.documentElement.scrollHeight > window.innerHeight + 4;
  }

  function shouldUseManualTouchScroll() {
    return document.body && document.body.classList.contains("route-stop-page");
  }

  function shouldIgnore(target) {
    return Boolean(
      target &&
        target.closest &&
        target.closest("input, textarea, select, iframe, .leaflet-container, [data-no-touch-scroll]")
    );
  }

  document.addEventListener(
    "touchstart",
    function (event) {
      if (
        !shouldUseManualTouchScroll() ||
        !event.touches ||
        event.touches.length !== 1 ||
        !canScrollPage() ||
        shouldIgnore(event.target)
      ) {
        active = false;
        return;
      }

      const touch = event.touches[0];
      active = true;
      startX = touch.clientX;
      startY = touch.clientY;
      lastY = touch.clientY;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchmove",
    function (event) {
      if (!shouldUseManualTouchScroll() || !active || !event.touches || event.touches.length !== 1) return;

      const touch = event.touches[0];
      const totalX = touch.clientX - startX;
      const totalY = touch.clientY - startY;

      if (Math.abs(totalX) > Math.abs(totalY) * 1.2) {
        active = false;
        return;
      }

      const deltaY = lastY - touch.clientY;
      if (Math.abs(deltaY) < 1) return;

      const before = pageY();
      window.scrollBy(0, deltaY);
      const after = pageY();

      if (after !== before) {
        event.preventDefault();
      }

      lastY = touch.clientY;
    },
    { passive: false }
  );

  document.addEventListener(
    "touchend",
    function () {
      active = false;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchcancel",
    function () {
      active = false;
    },
    { passive: true }
  );

  function setRootSizeVar(name, value) {
    const normalized = value + "px";
    if (document.documentElement.style.getPropertyValue(name) !== normalized) {
      document.documentElement.style.setProperty(name, normalized);
    }
  }

  function dockElementHeight(selector, fallback, minimum) {
    const element = document.querySelector(selector);
    if (!element) return Math.max(minimum, fallback);

    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const height = style.display !== "none" && style.visibility !== "hidden" && rect.height > 0
      ? Math.ceil(rect.height)
      : fallback;
    return Math.max(minimum, height);
  }

  function updateRouteDockHeight() {
    if (!document.body.classList.contains("route-stop-page")) return;

    setRootSizeVar("--route-timer-height", dockElementHeight(".timer-widget", 104, 92));
    setRootSizeVar("--route-next-height", dockElementHeight(".btn-next", 48, 44));
    setRootSizeVar("--route-maps-height", dockElementHeight("#mapsBtn", 56, 48));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateRouteDockHeight);
  } else {
    updateRouteDockHeight();
  }

  window.addEventListener("load", updateRouteDockHeight, { passive: true });
  window.addEventListener("resize", updateRouteDockHeight, { passive: true });

  if ("MutationObserver" in window) {
    const observer = new MutationObserver(updateRouteDockHeight);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
  }
})();
