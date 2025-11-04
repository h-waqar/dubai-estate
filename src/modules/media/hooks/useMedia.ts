// src\modules\media\hooks\useMedia.ts
import { useMediaStore } from "../stores/store";
import { uploadMedia } from "../actions/uploadMedia";
import { listMedia } from "../actions/listMedia";
import { deleteMedia } from "../actions/deleteMedia";
import { Media } from "../types/media.types";

export const useMedia = () => {
  const {
    mediaList,
    loading,
    error,
    setMediaList,
    addMedia,
    removeMedia,
    setLoading,
    setError,
  } = useMediaStore();

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const media: Media[] = await listMedia();
      setMediaList(media);
    } catch (err: any) {
      setError(err.message || "Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async ({
    file,
    title,
    alt,
    type,
  }: {
    file: File;
    title?: string;
    alt?: string;
    type?: "IMAGE" | "VIDEO" | "DOCUMENT" | "OTHER";
  }) => {
    try {
      setLoading(true);
      const newMedia = await uploadMedia({ file, title, alt, type });
      addMedia(newMedia);
      return newMedia;
    } catch (err: any) {
      setError(err.message || "Upload failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteMedia(id);
      removeMedia(id);
    } catch (err: any) {
      setError(err.message || "Delete failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mediaList, loading, error, fetchMedia, handleUpload, handleDelete };
};
