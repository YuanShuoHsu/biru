import Accounts from "./Accounts";
import Danger from "./Danger";
import LinkedAccounts from "./LinkedAccounts";
import Organizations from "./Organizations";
import Password from "./Password";
import Privacy from "./Privacy";
import Profile from "./Profile";
import Sessions from "./Sessions";

const Settings = () => (
  <>
    <Profile />
    <Accounts />
    <Organizations />
    <LinkedAccounts />
    <Password />
    <Sessions />
    <Privacy />
    <Danger />
  </>
);

export default Settings;
