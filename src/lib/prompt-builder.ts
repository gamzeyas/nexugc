// The prompts that turn the create form into the video workflow's inputs are kept private.
// These stubs keep the same shape so the interface builds.

export const ENERGY_DIRECTIONS: Record<string, string> = {
  excited: "",
  calm: "",
  confident: "",
  friendly: "",
  serious: "",
};

export function buildSceneType(interactionChip: string | null) {
  return interactionChip ?? "";
}

export function buildProductDetails(opts: { enhancedProduct?: string; customProduct?: string }) {
  return opts.enhancedProduct?.trim() || opts.customProduct?.trim() || "";
}

export function buildCameraDirection(opts: {
  locationChip: string | null;
  lightingChip: string | null;
  enhancedLocation?: string;
  customLocation?: string;
  enhancedAvatar?: string;
  customAvatar?: string;
  enhancedVideo?: string;
  customVideo?: string;
}) {
  return [opts.locationChip, opts.lightingChip].filter(Boolean).join(", ");
}
