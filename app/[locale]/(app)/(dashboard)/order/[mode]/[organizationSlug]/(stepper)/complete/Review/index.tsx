"use client";

import { useFormatter, useTranslations } from "next-intl";
import { useSnackbar } from "notistack";
import { useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import useSWR from "swr";

import {
  REVIEW_COMMENT_MAX_LENGTH,
  type ReviewFormValues,
  useReviewFormSchema,
} from "./definitions";

import FormCard, { StyledCardContent } from "@/components/FormCard";

import { STORE_TIMEZONE } from "@/constants/timezone";

import { useOrderItemName } from "@/hooks/useOrderItemName";

import { zodResolver } from "@hookform/resolvers/zod";

import { ThumbDown, ThumbUp } from "@mui/icons-material";
import {
  Button,
  FormHelperText,
  Rating,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import type {
  OrderReceiptResponse,
  OrderReviewResponse,
  UpsertOrderReviewDto,
} from "@/types/orders";

import { getErrorMessage } from "@/utils/errors";
import { type FetchError, fetcher } from "@/utils/fetcher";

const BoldTypography = styled(Typography)({
  fontWeight: "bold",
});

const RatingStack = styled(Stack)({
  alignItems: "center",
});

const ItemRowStack = styled(Stack)(({ theme }) => ({
  alignItems: "center",
  gap: theme.spacing(1),
  justifyContent: "space-between",
}));

const ItemNameTypography = styled(Typography)({
  wordBreak: "break-word",
});

const PreWrapTypography = styled(Typography)({
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
});

const ReplyStack = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.vars.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  gap: theme.spacing(0.5),
  padding: theme.spacing(1.5),
}));

const toFormValues = (
  review: OrderReviewResponse | null | undefined,
): ReviewFormValues => ({
  comment: review?.comment || "",
  likes: Object.fromEntries(
    (review?.items || []).map(({ liked, orderItemId }) => [orderItemId, liked]),
  ),
  rating: review?.rating || 0,
});

interface ReviewProps {
  accessToken: string | null;
  initialReview: OrderReviewResponse | null | undefined;
  order: OrderReceiptResponse;
  organizationSlug: string;
}

const Review = ({
  accessToken,
  initialReview,
  order,
  organizationSlug,
}: ReviewProps) => {
  const [rejectedAsLocked, setRejectedAsLocked] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const format = useFormatter();

  const getOrderItemName = useOrderItemName();

  const tCommon = useTranslations("common");
  const tOrder = useTranslations("order");

  const reviewFormSchema = useReviewFormSchema();

  const reviewUrl = `/api/organizations/${organizationSlug}/orders/${order.id}/review${accessToken ? `?${new URLSearchParams({ accessToken })}` : ""}`;

  const titleId = useId();

  const {
    data: review,
    isLoading,
    mutate,
  } = useSWR<OrderReviewResponse | null>(reviewUrl, {
    fallbackData: initialReview,
    revalidateOnMount: initialReview === undefined,
  });

  const {
    control,
    formState: { errors, isSubmitted, isSubmitting },
    handleSubmit,
    register,
    setValue,
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    values: toFormValues(review),
  });

  const [likes, rating] = useWatch({ control, name: ["likes", "rating"] });

  const isLocked =
    rejectedAsLocked ||
    (!!review && new Date(review.editableUntil) <= new Date());

  const handleLikeChange = (orderItemId: string, liked: boolean | null) => {
    const rest = Object.fromEntries(
      Object.entries(likes).filter(([id]) => id !== orderItemId),
    );

    setValue(
      "likes",
      liked === null ? rest : { ...rest, [orderItemId]: liked },
    );
  };

  const handleFormSubmit = async ({
    comment,
    likes,
    rating,
  }: ReviewFormValues) => {
    try {
      const saved = await fetcher<OrderReviewResponse>(reviewUrl, {
        body: JSON.stringify({
          comment: comment || null,
          items: Object.entries(likes).map(([orderItemId, liked]) => ({
            liked,
            orderItemId,
          })),
          rating,
        } satisfies UpsertOrderReviewDto),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });

      await mutate(saved, { revalidate: false });

      enqueueSnackbar(
        tOrder(review ? "complete.review.updated" : "complete.review.sent"),
        { variant: "success" },
      );
    } catch (error) {
      if ((error as FetchError).info?.code === "orderReviewLocked") {
        setRejectedAsLocked(true);
        mutate();
      }

      enqueueSnackbar(getErrorMessage(error), { variant: "error" });
    }
  };

  const formatDate = (value: string) =>
    format.dateTime(new Date(value), "short", { timeZone: STORE_TIMEZONE });

  if (review === undefined && isLoading) return null;

  return (
    <FormCard onSubmit={handleSubmit(handleFormSubmit)} variant="outlined">
      <StyledCardContent>
        <Stack>
          <BoldTypography
            color="textSecondary"
            id={titleId}
            variant="subtitle2"
          >
            {tOrder("complete.review.title")}
          </BoldTypography>
          <Typography color="textSecondary" variant="caption">
            {isLocked
              ? tOrder("complete.review.locked")
              : review
                ? tOrder("complete.review.editableUntil", {
                    date: formatDate(review.editableUntil),
                  })
                : tOrder("complete.review.subtitle")}
          </Typography>
        </Stack>
        <RatingStack
          aria-labelledby={isLocked ? undefined : titleId}
          role={isLocked ? undefined : "radiogroup"}
        >
          <Rating
            name="rating"
            onChange={(_, value) =>
              setValue("rating", value ?? 0, { shouldValidate: isSubmitted })
            }
            readOnly={isLocked}
            size="large"
            value={rating || null}
          />
          {errors.rating && (
            <FormHelperText error>{errors.rating.message}</FormHelperText>
          )}
        </RatingStack>
        {order.items.map((item) => (
          <ItemRowStack direction="row" key={item.id}>
            <ItemNameTypography variant="body2">
              {getOrderItemName(item)}
            </ItemNameTypography>
            <ToggleButtonGroup
              aria-label={getOrderItemName(item)}
              disabled={isLocked}
              exclusive
              onChange={(_, value: boolean | null) =>
                handleLikeChange(item.id, value)
              }
              size="small"
              value={likes[item.id] ?? null}
            >
              <ToggleButton
                aria-label={tOrder("complete.review.like")}
                color="success"
                value={true}
              >
                <ThumbUp fontSize="small" />
              </ToggleButton>
              <ToggleButton
                aria-label={tOrder("complete.review.dislike")}
                color="error"
                value={false}
              >
                <ThumbDown fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </ItemRowStack>
        ))}
        {isLocked ? (
          review?.comment && (
            <PreWrapTypography variant="body2">
              {review.comment}
            </PreWrapTypography>
          )
        ) : (
          <TextField
            error={!!errors.comment}
            fullWidth
            helperText={errors.comment?.message}
            label={`${tOrder("complete.review.comment.label")} ${tCommon("optional")}`}
            maxRows={6}
            minRows={3}
            multiline
            placeholder={tOrder("complete.review.comment.placeholder")}
            slotProps={{
              htmlInput: { maxLength: REVIEW_COMMENT_MAX_LENGTH },
              inputLabel: { shrink: true },
            }}
            {...register("comment")}
          />
        )}
        {!isLocked && (
          <Button loading={isSubmitting} type="submit" variant="contained">
            {tOrder(
              review ? "complete.review.update" : "complete.review.submit",
            )}
          </Button>
        )}
        {review?.reply && (
          <ReplyStack>
            <BoldTypography variant="body2">
              {tOrder("complete.review.reply")}
            </BoldTypography>
            <PreWrapTypography variant="body2">
              {review.reply}
            </PreWrapTypography>
            {review.repliedAt && (
              <Typography color="textSecondary" variant="caption">
                {formatDate(review.repliedAt)}
              </Typography>
            )}
          </ReplyStack>
        )}
      </StyledCardContent>
    </FormCard>
  );
};

export default Review;
