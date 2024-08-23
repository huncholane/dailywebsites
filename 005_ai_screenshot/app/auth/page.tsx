import { updateUser } from "./actions";
import { getFullSessionUser } from "./session";

const SessionUserPage = async () => {
  const user = await getFullSessionUser();

  if (!user) {
    return <div>No user session found.</div>;
  }

  return (
    <form action={updateUser} className="flex flex-col gap-4 p-4">
      <div>
        <h1>User Session</h1>
        <h3>
          ID: <span className="font-normal text-base">{user.id}</span>
        </h3>
      </div>
      <div>
        <h3>Username:</h3>
        <input
          className="p-1"
          type="text"
          name="username"
          defaultValue={user.username}
        />
      </div>
      <div>
        <h3>Email:</h3>
        <input
          className="p-1"
          type="text"
          name="email"
          defaultValue={user.email}
        />
      </div>
      <div>
        <h3>First Name:</h3>
        <input
          className="p-1"
          type="text"
          name="firstName"
          defaultValue={user.firstName || ""}
        />
      </div>
      <div>
        <h3>Last Name:</h3>
        <input
          className="p-1"
          type="text"
          name="lastName"
          defaultValue={user.lastName || ""}
        />
      </div>
      <div>
        <h3>Open AI API Key:</h3>
        <input
          className="p-1"
          type="text"
          name="openAiKey"
          defaultValue={user.openAiKey || ""}
        />
      </div>
      <input
        type="submit"
        className="w-28 bg-primary text-accent cursor-pointer hover:bg-primary-dark"
      />
    </form>
  );
};

export default SessionUserPage;
