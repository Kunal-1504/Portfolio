# Personalized portfolio avatar

Created with the built-in image generation tool on 2 October 2026.

Asset: `public/avatar-kunal.png`. The previous `public/avatar.png` is preserved.
The shared Avatar component uses this asset on the homepage and in chat.
The output was visually inspected for likeness, the original waving pose, and a transparent background.

## Initial prompt

Use case: identity-preserve / style-transfer.
Asset type: transparent personalized 3D avatar for Kunal's portfolio website.
Input image 1 (public/avatar.png) is the edit target and the EXACT pose, composition, clothing, illustration style reference. Input image 2 (the user-provided portrait photo) is the identity reference.
Replace the identity of the existing avatar with a recognizable stylized likeness of the person in image 2. Match his warm brown skin, upward swept short black hair with trimmed sides, eyebrows, face shape, nose and friendly smile. No glasses, no beard: follow the identity photo rather than the old avatar's facial accessories. Use a friendly polished 3D animated character style like image 1, adult proportions stylized consistently.
Keep the pose from image 1 exactly: waist/chest-up front-facing portrait, slightly tilted head, arm on the right side of the image raised with an open palm waving, all five fingers clearly visible. Keep the existing charcoal crew-neck T-shirt, camera angle, hand position, body placement, generous head silhouette, and framing. Do not use the photo's blazer or straight-arm pose.
Transparent background with clean alpha edges, no backdrop or ground shadow, no props, no text, no watermark. Square image. Entire hair, waving hand, and shoulders fit within canvas with small clear padding. One avatar only.

## Final proportion-correction prompt

Use case: identity-preserve, precise proportion correction.
Edit target image 1: the generated transparent 3D waving avatar at public/avatar-kunal.png. Image 2: the user's identity photo.
The user says the head is too big and body too small. Correct the anatomy to natural balanced adult head-to-body proportions, substantially reducing the head's scale relative to the torso. Make the head including hair about 35% smaller than it is in image 1 relative to the shoulders and torso, with a natural neck transition and shoulders roughly 2.5 to 3 head widths across. Show more of the chest and torso down to the waist; do not merely shrink the entire avatar or add blank space. Avoid bobblehead, chibi or oversized infant-like eyes/head proportions. Keep a tasteful soft 3D illustration style with adult anatomy.
Preserve this person's recognizable face, skin tone, short upward-swept black hair and friendly smile, no glasses or beard. Keep the charcoal crew-neck shirt and SAME waving pose: facing camera, slight head tilt, arm on viewer's right raised with open palm, five anatomically correct fingers. The hand should be naturally proportioned to the now smaller head, not oversized.
Square canvas, clean genuinely transparent alpha background. Entire hair and waving hand within frame with small padding. No text, accessories, props, or background.
