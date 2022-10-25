var URL = null;
if (window.location.host  == "localhost:8100") {
  // URL = "https://activeminds-server.test";
  // URL = "https://relish-wellbeing-backend.test";
  URL = "https://staging-wellbeing-2.relish-life.com";
} else {
  // URL = "https://wellbeing.relish-life.com";
  URL = "https://staging-wellbeing-2.relish-life.com";
  // URL = "https://relish-wellbeing-backend.sharedwithexpose.com"
}
export const SERVER_URL = URL;
