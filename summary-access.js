(function () {
  "use strict";

  function getRouteKey() {
    const match = document.documentElement.innerHTML.match(/const route='([^']+)'/);
    return match ? match[1] : null;
  }

  function getLanguage() {
    return (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
  }

  function readAccess(route) {
    try {
      return JSON.parse(localStorage.getItem("access_" + route) || "null");
    } catch (e) {
      return null;
    }
  }

  function hasCredentials(access) {
    return !!(
      access &&
      /^[a-f0-9]{32}$/i.test(String(access.accessToken || "")) &&
      /^[A-Za-z0-9_-]{16,128}$/.test(String(access.deviceToken || ""))
    );
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderUnlocked(stops) {
    const container = document.querySelector(".route-summary-stops");
    const startSection = document.querySelector(".route-summary-start");

    if (!container || !Array.isArray(stops) || !stops.length) return;

    container.innerHTML = stops.map((stop, index) => {
      const name = escapeHtml(stop.name || stop.title || ("Stop " + (index + 1)));
      const summary = escapeHtml(stop.summary || "");
      const duration = escapeHtml(stop.duration || "");

      return `
        <article class="route-summary-stop route-summary-stop-unlocked">
          <span>${index + 1}</span>
          <div>
            <h3>${name}</h3>
            <p>${summary}${duration ? " · " + duration : ""}</p>
          </div>
        </article>
      `;
    }).join("");

    const unlocked = document.createElement("div");
    unlocked.className = "route-summary-unlocked";
    unlocked.innerHTML = "<strong>Route unlocked</strong><p>Your complete route is ready on this device.</p>";

    container.parentNode.insertBefore(unlocked, container);

    if (startSection) {
      startSection.classList.add("route-summary-start-unlocked");
    }
  }

  async function validateAccess() {
    const route = getRouteKey();
    if (!route) return false;

    const access = readAccess(route);
    if (!hasCredentials(access)) return false;

    try {
      const response = await fetch("/route-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          route,
          language: getLanguage(),
          accessToken: access.accessToken,
          deviceToken: access.deviceToken
        })
      });

      if (!response.ok) return false;

      const data = await response.json();

      if (
        !data ||
        data.ok !== true ||
        data.route !== route ||
        !Array.isArray(data.stops) ||
        !data.stops.length
      ) {
        return false;
      }

      const expiry = Number(data.accessExpiresAt || access.expiry);

      if (!expiry || Date.now() >= expiry) {
        localStorage.removeItem("access_" + route);
        return false;
      }

      localStorage.setItem(
        "access_" + route,
        JSON.stringify({
          expiry,
          accessToken: access.accessToken,
          deviceToken: access.deviceToken
        })
      );

      return true;
    } catch (e) {
      return false;
    }
  }

  window.CruiseStopSummaryAccess = {
    validate: validateAccess
  };

  async function init() {
    const route = getRouteKey();
    if (!route) return;

    const access = readAccess(route);
    if (!hasCredentials(access)) return;

    try {
      const response = await fetch("/route-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          route,
          language: getLanguage(),
          accessToken: access.accessToken,
          deviceToken: access.deviceToken
        })
      });

      if (!response.ok) return;

      const data = await response.json();

      if (
        !data ||
        data.ok !== true ||
        data.route !== route ||
        !Array.isArray(data.stops) ||
        !data.stops.length
      ) {
        return;
      }

      if (data.accessExpiresAt) {
        localStorage.setItem(
          "access_" + route,
          JSON.stringify({
            expiry: Number(data.accessExpiresAt),
            accessToken: access.accessToken,
            deviceToken: access.deviceToken
          })
        );
      }

      renderUnlocked(data.stops);
    } catch (e) {
      // Keep the public preview unchanged if validation cannot be completed.
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
