import { CheckCircleIcon } from "lucide-react";

export const FormSuccess = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-400/15 text-sm gap-x-2 text-emerald-500 p-3 flex items-center rounded-md">
      <CheckCircleIcon className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
