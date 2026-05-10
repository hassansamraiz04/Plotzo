export const getUserRole = (user) => {
  return String(user?.role ?? user?.userRole ?? user?.user_type ?? "")
    .trim()
    .toUpperCase();
};

export const isSeller = (user) => getUserRole(user) === "SELLER";

export const getUserId = (user) => {
  return user?.id ?? user?._id ?? user?.userId ?? null;
};
