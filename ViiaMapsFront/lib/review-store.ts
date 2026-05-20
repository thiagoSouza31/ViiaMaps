import { Review, AccessibilityFeatures } from "@/lib/types"

const STORAGE_KEY = "viia_reviews"

export interface StoredReview extends Review {
  placeName: string
  placeAddress: string
}

function parseStoredReview(review: any): StoredReview {
  return {
    ...review,
    createdAt: new Date(review.createdAt),
  }
}

export function getAllReviews(): StoredReview[] {
  if (typeof window === "undefined") return []

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) return []

  try {
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) return []
    return parsed.map(parseStoredReview)
  } catch {
    return []
  }
}

export function saveAllReviews(reviews: StoredReview[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      reviews.map((review) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
      }))
    )
  )
}

export function addReview(review: Omit<StoredReview, "id"> & { id?: string }) {
  const existing = getAllReviews()
  const newReview: StoredReview = {
    ...review,
    id: review.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: review.createdAt ? new Date(review.createdAt) : new Date(),
  }
  const updated = [...existing, newReview]
  saveAllReviews(updated)
  return newReview
}

export function deleteReview(reviewId: string) {
  const reviews = getAllReviews()
  const filtered = reviews.filter((review) => review.id !== reviewId)
  saveAllReviews(filtered)
  return filtered
}

export function getReviewsByUser(userId: string) {
  return getAllReviews().filter((review) => review.userId === userId)
}

export function getReviewsByPlace(placeId: string) {
  return getAllReviews().filter((review) => review.placeId === placeId)
}

export function getReviewStatsForPlace(placeId: string) {
  const reviews = getReviewsByPlace(placeId)
  const total = reviews.length
  const average = total === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / total
  return { total, average }
}

export function mergeAccessibility(
  current: AccessibilityFeatures,
  reviewAccessibility: Partial<AccessibilityFeatures>
): AccessibilityFeatures {
  return {
    wheelchairRamp: current.wheelchairRamp || !!reviewAccessibility.wheelchairRamp,
    adaptedBathroom: current.adaptedBathroom || !!reviewAccessibility.adaptedBathroom,
    elevator: current.elevator || !!reviewAccessibility.elevator,
    tactilePaving: current.tactilePaving || !!reviewAccessibility.tactilePaving,
    preferentialParking: current.preferentialParking || !!reviewAccessibility.preferentialParking,
    signLanguage: current.signLanguage || !!reviewAccessibility.signLanguage,
    brailleSignage: current.brailleSignage || !!reviewAccessibility.brailleSignage,
  }
}
