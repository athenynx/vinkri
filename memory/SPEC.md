# VINKRI Virtual Studio

## What it does
VINKRI is a local, immersive virtual design studio for browsing a supplied 16-object gallery. The experience starts with a cinematic entry sequence, then opens an interactive architectural facade with four rooms: Object Library, Sacred Room, Memory Archive, and Light Lab.

## Data model
- Product: id, name, category, floor, description, INR price, source SVG image, lumen baseline, colour temperature, and visual accent.
- Cart line: product id and quantity, held in client state for this demo.
- Order: generated client-side on demo checkout; no payment provider or persistence is connected.

## Key flows
1. Entry overlay materializes the VINKRI wordmark and building, then Enter Studio transitions into the facade.
2. Floor buttons open a room with atmosphere-specific motion, a conveyor strip, and product cards.
3. Product cards open a detail panel with fully static supplied product imagery.
4. Light Lab alone exposes a dedicated room simulator where visitors select one of its four ZIP products and adjust room darkness, product intensity, and colour temperature while reading live lux output.
5. Add to trolley, quantity controls, coupon `VINKRI10`, checkout, and order confirmation work entirely in the browser.
6. Search, wishlist, dark/light theme, mobile menu, reduced-motion CSS, and mobile touch fallbacks are included.

## Auth / roles
No authentication or gated roles. This is a public demo studio.

## Integrations
No external integrations. Product data and artwork come from the supplied ZIP. Payment and order persistence are MOCKED as a local demo by design.

## Visual constraints
- The cinematic entry displays only the animated building, VINKRI wordmark, and ENTER STUDIO control.
- Product artwork is always rendered from the supplied ZIP and never animated, tilted, zoomed, swept, or transitioned.