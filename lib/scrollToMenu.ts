/**
 * Smooth-scroll the page to the home page's Menu section, accounting for the sticky nav.
 *
 * Used by:
 *   • OrderDropdown's trigger handler (Nav usage)
 *   • HeroOrderButton (Hero usage)
 *
 * Both callers need identical scroll behavior — extracted here so the navHeight constants
 * (96/128 mirroring Nav.tsx's h-24/h-32) can't drift between the two call sites.
 *
 * Wrapped in requestAnimationFrame so callers can fire it synchronously alongside a React
 * state update; the scroll then begins one frame later, after React has committed any
 * mount-time layout that could otherwise cancel the in-flight smooth animation.
 *
 * Reduced-motion users: window.scrollTo({behavior:"smooth"}) honors prefers-reduced-motion
 * automatically — modern browsers downgrade smooth → auto when the OS preference is set.
 */
export function scrollToMenuSection(): void {
  if (typeof window === "undefined") return; // server-render safety
  requestAnimationFrame(() => {
    const menuEl = document.getElementById("menu");
    if (!menuEl) return;
    // Mirror Nav.tsx: h-24 (96px) mobile, h-32 (128px) at md+.
    const navHeight = window.innerWidth >= 768 ? 128 : 96;
    const targetY =
      menuEl.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  });
}
