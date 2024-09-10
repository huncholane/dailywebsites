import { ApnsClient } from "apns2";

console.log(process.env.APNS_HOST);
const apns2 = new ApnsClient({
  host: process.env.APNS_HOST, // api.push.apple.com or api.sandbox.push.apple.com
  team: process.env.APNS_TEAM_ID as string,
  keyId: process.env.APNS_KEY_ID as string,
  signingKey: process.env.APNS_SIGNING_KEY as string,
  defaultTopic: process.env.APNS_DEFAULT_TOPIC,
  requestTimeout: 0, // optional, Default: 0 (without timeout)
  keepAlive: true, // optional, Default: 5000
});

export default apns2;
