import redis from "../config/redis";
/**
 * Clears all cached student resource data.
 * This should be called *anytime* a faculty member
 * creates, updates, or deletes an announcement, material,
 * or question paper.
 */
export const clearAllStudentResourceCaches = async () => {
  try {
    // Find all keys that match our student resource pattern
    const keys = await redis.keys("resources:*");

    if (keys.length > 0) {
      // Delete all found keys
      await redis.del(keys);
      console.log(`Cache INVALIDATED. Cleared ${keys.length} keys.`);
    }
  } catch (error) {
    // Log the error but don't crash the request.
    // The user's action (e.g., posting) is more important
    // than the cache invalidation.
    console.error("Redis cache invalidation failed:", error);
  }
};

export const clearFacultyCache = async (
  facultyId: number,
  resourceType: "announcements" | "materials" | "questionPapers"
) => {
  const cacheKey = `faculty:${facultyId}:${resourceType}`;
  try {
    await redis.del(cacheKey);
    console.log(`Cache INVALIDATED (Faculty). Cleared key: ${cacheKey}`);
  } catch (error) {
    console.error(`Redis (Faculty) cache invalidation failed for key ${cacheKey}:`, error);
  }
};
