import { Label } from "@/components/ui/label";
import { UseFormRegisterReturn } from "react-hook-form";

interface CoverImageInputProps {
  register: (name: string) => UseFormRegisterReturn;
  error?: { message?: string };
}

export function CoverImageInput({ register, error }: CoverImageInputProps) {
  return (
    <div>
      <Label className="block text-sm font-medium mb-2">Cover Image URL</Label>
      <input
        {...register("coverImage")}
        type="url"
        placeholder="https://example.com/cover.jpg"
        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
      />
      {error?.message && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );
}
