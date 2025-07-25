// utils/profileUtils.ts
export const getRoleColor = (role: string): string => {
  switch (role) {
    case "super_admin":
      return "bg-purple-500";
    case "admin":
      return "bg-blue-500";
    case "moderator":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-green-500";
    case "inactive":
      return "bg-yellow-500";
    case "suspended":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

export const getDaysSince = (dateString: string): number => {
  return Math.floor(
    (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)
  );
};
