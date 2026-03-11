import type { InstagramAnalysisResult } from "../src/types/instagram.types"

const createUser = (username: string, daysAgo: number) => ({
  username,
  href: `https://instagram.com/${username}`,
  timestamp: Date.now() - daysAgo * 86400000,
});

export const mockAnalysis: InstagramAnalysisResult = {
  mutual: [
    createUser("alex.dev", 2),
    createUser("sara.codes", 5),
    createUser("frontend.luca", 7),
    createUser("designbyanna", 8),
    createUser("dev.matteo", 10),
    createUser("reactwizard", 12),
    createUser("typescript.daily", 14),
    createUser("csscraft", 18),
    createUser("pixel.alessia", 22),
    createUser("giulia.ui", 25),
    createUser("davide.dev", 28),
    createUser("coder.mike", 32),
    createUser("node.master", 35),
    createUser("vueexplorer", 40),
    createUser("dev.alberto", 42),
    createUser("coding.sofia", 45),
    createUser("frontendwizard", 47),
    createUser("uxandcoffee", 50),
    createUser("tech.monica", 55),
    createUser("devjournal", 60),
  ],

  followersOnly: [
    createUser("ui.inspiration", 3),
    createUser("dailyfrontend", 7),
    createUser("pixelhunter", 12),
    createUser("design.today", 18),
    createUser("devlife", 21),
    createUser("javascriptzone", 26),
    createUser("codingplanet", 30),
    createUser("cssdaily", 33),
    createUser("devcommunity", 36),
    createUser("frontendnews", 40),
  ],

  unfollowers: [
    createUser("travel.alex", 4),
    createUser("foodie.sara", 9),
    createUser("photo.julia", 15),
    createUser("fitness.mike", 22),
    createUser("nature.world", 30),
    createUser("dailyquotes", 33),
    createUser("crypto.news", 37),
    createUser("startup.life", 41),
  ],

  recentUnfollowers: [
    createUser("oldfriend01", 1),
    createUser("oldfriend02", 2),
    createUser("oldfriend03", 3),
    createUser("oldfriend04", 5),
  ],

  blocked: [
    createUser("spam_account_01", 100),
    createUser("fake_profile_22", 120),
  ],
};