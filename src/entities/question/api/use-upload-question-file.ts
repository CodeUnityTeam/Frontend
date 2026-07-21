import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { uploadQuestionFile } from "./upload-question-file";

export function useUploadQuestionFile() {
  return useMutation({
    mutationFn: uploadQuestionFile,

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}