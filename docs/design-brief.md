# Unified ecosystem prototype

## Sitemap

Single-page prototype: Home → Divisions → Technology story → Energy solutions → Dryer selector → Food products → Why dehydration → Projects → About → Contact.

## Visual direction

“Thermal precision meets living ingredients.” The industrial side uses graphite, steel, grids, instrumentation, and airflow. The food side uses turmeric orange, botanical green, tactile photography, and rounded organic geometry. The transition between them is the controlled dehydration story.

## Type and color

- Display: Space Grotesk, bold and engineered.
- Editorial accent: Newsreader, warm and organic.
- Graphite `#10120f`, warm paper `#f2efe6`, thermal orange `#ff6534`, leaf `#b7d548`, steel `#a9b0a6`.

## Interaction concept

- Hero: real-time Three.js chamber, produce, airflow, and dried fragments. Drag to orbit; pointer position changes the camera and flow.
- Story: scroll progress drives six verified process stages without pretending to model engineering performance.
- Dryer selector: local configuration maps a stated daily batch to the smallest listed CES capacity at or above it. Results are explicitly preliminary.
- Food catalog: client-side filters; actions link to the existing Ennyescee store rather than simulating checkout.

## Technical architecture

- Vite + vanilla JavaScript + Three.js.
- Semantic HTML, CSS custom properties, IntersectionObserver, pointer events, and native form controls.
- Relative build paths for GitHub project Pages.
- WebGL fallback graphic, reduced-motion mode, lazy images, bounded device pixel ratio.

## Verified content and exclusions

- CES capacities and displayed specifications come from the current heat-pump dryer page: 100, 300, 500, and 1200 kg.
- Food product names/images link to current Ennyescee product pages.
- CES email, primary website phone pair, and Irumpanam address are repeated in the current CES header/footer and are used.
- A different CES phone pair appears in a homepage callout; it is not used pending confirmation.
- Ennyescee’s header contains apparent template contact data (a template Gmail and a New Mexico address); it is excluded. The Kochi factory address shown in the site footer is used. Food enquiries link to the existing contact page because no consistent public phone/email was verified.
- No installation counts, client counts, certifications, health outcomes, or sustainability statistics are asserted.

## Source sites

- https://cochinenergysystem.com/
- https://cochinenergysystem.com/ces-heatpump-dehydration-dryers/
- https://ennyesceefoodfactory.com/
- https://royk26.github.io/kinetic-01/?v=readable2
