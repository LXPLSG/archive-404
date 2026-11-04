# Frost dial texture

## Charcoal reference landscape · landscape-10

charcoal-landscape.png was created with the built-in image-generation tool, using the approved mockup as a visual reference. Prompt: "Standalone portrait background for the right coffee card: smooth neutral charcoal, silky atmospheric mist, fine natural antique-gold mineral seam from upper centre toward upper-right, softly gold-edged mountain ridge rising toward the right, quiet lower area; no typography, UI, border or shadow." It is a reference-guided recreation rather than a pixel extraction. The app applies a 7% white overlay to provide the requested lighter tone. This replaces the procedural charcoal grain and vector mountain layers on that card.

`frost-dial.png` is an original background generated with the built-in image-generation tool. Visual direction references Grand Seiko's Snowflake dial, whose wind-sculpted snow and silver finish are described at https://www.grand-seiko.com/uk-en/collections/sbgx355g . It contains no watch branding or photographed watch elements.

## Generation prompt

Use case: stylized-concept. Asset type: seamless web app background material texture. Create an original fine silver-white frost dial texture inspired by the subtle wind-sculpted snow relief of Grand Seiko Snowflake watch dials. Square, flat overhead macro material scan filling the entire frame, softly irregular delicate vertical icy feather ridges and crystalline micrograin, shallow embossed grooves, cool pale ice-blue silver-white palette, soft diffuse grazing light, low contrast but visible fine relief, refined luxury finish. Uniform illumination throughout, seamless repeating edges, no focal point, no watch, no hands, no indices, no circular outline, no branding, no letters, no watermark, no glitter, no heavy scratches. This is a restrained background beneath a readable navy coffee menu, not a photograph of a watch.

The app repeats the Snowflake texture at 850 CSS pixels beneath a pale overlay on the document root. Transparent body coverage, dynamic viewport height and safe-area spacing keep the webpage background continuous. Safari controls its own native toolbar appearance.

Card surfaces use original procedural SVG material overlays: paper-texture.svg provides fine fibres and a subtle irregular wash; charcoal-texture.svg provides a softer cloudy grain. The underlying ivory and charcoal colours remain unchanged. Text and controls sit above non-interactive overlays. All texture assets are pre-cached for offline use.
