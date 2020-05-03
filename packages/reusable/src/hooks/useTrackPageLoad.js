import { useEffect } from "react";
import { pageTrack } from "../utils/tracking";

// Track a page load in Adobe using the provided slug
export default function useTrackPageLoad(slug, vars) {
  useEffect(() => pageTrack(slug, vars), [slug, vars]);
}
