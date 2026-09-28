import "server-only";

export type GoogleBusinessReview = {
  id: string;
  customerName: string;
  message: string;
  reviewedAt: string;
  branchName: string;
  googleMapsUrl: string;
};

type GoogleReviewResponse = {
  reviews?: Array<{
    reviewId?: string;
    starRating?: string;
    comment?: string;
    createTime?: string;
    reviewer?: { displayName?: string };
  }>;
  nextPageToken?: string;
};

const branches = [
  {
    name: "สุพรรณบุรี",
    locationId: process.env.GOOGLE_BUSINESS_SUPHANBURI_LOCATION_ID,
    mapsUrl: "https://maps.app.goo.gl/tddg4Y9Gv5Dd25cX8?g_st=il",
  },
  {
    name: "กาญจนบุรี",
    locationId: process.env.GOOGLE_BUSINESS_KANCHANABURI_LOCATION_ID,
    mapsUrl: "https://maps.app.goo.gl/jTfe5Rd5fkLsmCnz8?g_st=il",
  },
];

const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID?.replace(/^accounts\//, "");
const isConfigured = Boolean(
  accountId &&
  process.env.GOOGLE_BUSINESS_CLIENT_ID &&
  process.env.GOOGLE_BUSINESS_CLIENT_SECRET &&
  process.env.GOOGLE_BUSINESS_REFRESH_TOKEN &&
  branches.some(branch => branch.locationId),
);

const tokenCache = globalThis as typeof globalThis & {
  googleBusinessAccessToken?: { value: string; expiresAt: number };
};

async function getAccessToken() {
  const cached = tokenCache.googleBusinessAccessToken;
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.value;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_BUSINESS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_BUSINESS_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_BUSINESS_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Google OAuth token request failed (${response.status})`);
  const data = await response.json() as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error("Google OAuth response did not include an access token");
  tokenCache.googleBusinessAccessToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return data.access_token;
}

async function fetchLocationReviews(locationId: string, branchName: string, mapsUrl: string, accessToken: string) {
  const location = `accounts/${accountId}/locations/${locationId.replace(/^locations\//, "")}`;
  const reviews: GoogleBusinessReview[] = [];
  let pageToken: string | undefined;

  // Ratings are requested in descending order, so stop after the first page
  // that no longer contains five-star reviews.
  for (let page = 0; page < 20; page += 1) {
    const url = new URL(`https://mybusiness.googleapis.com/v4/${location}/reviews`);
    url.searchParams.set("pageSize", "50");
    url.searchParams.set("orderBy", "rating desc");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 60 * 60 },
    });
    if (!response.ok) throw new Error(`Google reviews request failed (${response.status})`);
    const data = await response.json() as GoogleReviewResponse;
    const pageReviews = data.reviews ?? [];
    let hasOnlyFiveStarReviews = true;

    for (const review of pageReviews) {
      if (review.starRating !== "FIVE") {
        hasOnlyFiveStarReviews = false;
        break;
      }
      const message = review.comment?.trim();
      const reviewedAt = review.createTime?.slice(0, 10);
      if (!message || !reviewedAt || !review.reviewId) continue;
      reviews.push({
        id: `${locationId}-${review.reviewId}`,
        customerName: review.reviewer?.displayName?.trim() || "ผู้ใช้ Google",
        message,
        reviewedAt,
        branchName,
        googleMapsUrl: mapsUrl,
      });
    }

    if (!data.nextPageToken || !hasOnlyFiveStarReviews) break;
    pageToken = data.nextPageToken;
  }

  return reviews;
}

export async function getGoogleBusinessReviews(): Promise<{
  configured: boolean;
  items: GoogleBusinessReview[];
}> {
  if (!isConfigured) return { configured: false, items: [] };

  try {
    const accessToken = await getAccessToken();
    const results = await Promise.all(branches
      .filter((branch): branch is typeof branch & { locationId: string } => Boolean(branch.locationId))
      .map(branch => fetchLocationReviews(branch.locationId, branch.name, branch.mapsUrl, accessToken)));
    return {
      configured: true,
      items: results.flat().sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt)),
    };
  } catch (error) {
    console.error("Google Business Profile reviews could not be loaded", error);
    return { configured: true, items: [] };
  }
}
