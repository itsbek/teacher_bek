# Vendored libraries (motion prototypes only)

| Library | Version | Files | Licence |
|---|---|---|---|
| GSAP | 3.15.0 | `gsap-3.15.0/gsap.min.js`, `ScrollTrigger.min.js`, `SplitText.min.js`, `DrawSVGPlugin.min.js`, `Flip.min.js` | GSAP standard "no charge" licence (https://gsap.com/standard-license). Free, including commercial use, but it is NOT MIT: you may not use it to build a competing visual animation tool. Copied unmodified from `npm pack gsap@3.15.0` (`package/dist/`). |
| Lenis | 1.3.27 | `lenis-1.3.27/lenis.min.js`, `lenis.css`, `LICENSE` | MIT (see `lenis-1.3.27/LICENSE`). Copied unmodified from `npm pack lenis@1.3.27` (`package/dist/`). |

Loaded only on demand by `tier.js` (full/touch tier for GSAP, full tier for Lenis). Lite tier and reduced motion never request them.
