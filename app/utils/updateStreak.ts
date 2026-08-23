export function updateStreak() {
  const today = new Date().toDateString();

  const lastActiveDate = localStorage.getItem("lastActiveDate");

  let currentStreak = Number(
    localStorage.getItem("currentStreak") || "0"
  );

  // First activity ever
  if (!lastActiveDate) {
    currentStreak = 1;
  } else if (lastActiveDate === today) {
    // User is already active today
    // Do not increase streak
    return currentStreak;
  } else {
    const lastDate = new Date(lastActiveDate);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      lastDate.toDateString() ===
      yesterday.toDateString()
    ) {
      // User was active yesterday
      currentStreak += 1;
    } else {
      // User missed one or more days
      currentStreak = 1;
    }
  }

  localStorage.setItem(
    "currentStreak",
    String(currentStreak)
  );

  localStorage.setItem(
    "lastActiveDate",
    today
  );

  return currentStreak;
}