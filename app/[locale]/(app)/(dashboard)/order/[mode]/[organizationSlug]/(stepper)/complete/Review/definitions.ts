import { useTranslations } from "next-intl";
import * as z from "zod";

export const REVIEW_COMMENT_MAX_LENGTH = 1000;

export const useReviewFormSchema = () => {
  const tOrder = useTranslations("order");

  return z.object({
    comment: z
      .string()
      .trim()
      .max(REVIEW_COMMENT_MAX_LENGTH, {
        error: tOrder("complete.review.comment.maxLength", {
          max: REVIEW_COMMENT_MAX_LENGTH,
        }),
      }),
    likes: z.record(z.string(), z.boolean()),
    rating: z
      .number()
      .int()
      .min(1, { error: tOrder("complete.review.rating.required") })
      .max(5),
  });
};

export type ReviewFormValues = z.infer<ReturnType<typeof useReviewFormSchema>>;
