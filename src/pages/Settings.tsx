import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { user, isLoading } = useAuth();

  console.log(user);

  if (isLoading) return <div className="m-16">Loading...</div>;
  if (!user) return <div className="m-10">로그인되지 않았습니다.</div>;

  return (
    <div className="p-6 w-full mx-auto text-center mt-24">
      <h1 className="text-xl font-bold mb-4">내 정보</h1>
      <div className="mb-2">
        <span className="font-medium">이메일:</span> {user.email}
      </div>
      <div className="mb-2">
        <span className="font-medium">이름:</span> {user.name}
      </div>
    </div>
  );
};

export default Settings;
