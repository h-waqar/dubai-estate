"use client";
// src/modules/media/hooks/useMedia.ts
import { useCallback } from "react";
import { useMediaStore } from "../stores/store";
import { uploadMedia } from "../actions/uploadMedia";
import { listMedia } from "../actions/listMedia";
import { deleteMedia } from "../actions/deleteMedia";
import { Media } from "../types/media.types";
// import { handleActionError } from "@/lib/handleActionError";
// import { handleServerError } from "@/lib/handleServerError";
import { handleClientError } from "@/lib/handleClientError";

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

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      const media: Media[] = await listMedia();
      setMediaList(media);
    } catch (err: unknown) {
      console.error("Failed to fetch media");
      // const error = handleServerError(err);
      const error = handleClientError(err);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setMediaList, setError]);

  const handleUpload = useCallback(
    async ({
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
      } catch (err: unknown) {
        console.error("Upload failed");
        // const error = handleServerError(err);
        const error = handleClientError(err);
        setError(error.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, addMedia, setError]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        await deleteMedia(id);
        removeMedia(id);
      } catch (err: unknown) {
        console.error("Failed to fetch media");
        // const error = handleServerError(err);
        const error = handleClientError(err);
        // setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, removeMedia, setError]
  );

  return { mediaList, loading, error, fetchMedia, handleUpload, handleDelete };
};
