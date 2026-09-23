import { useTranslations } from "next-intl";
import * as z from "zod";

import { servingTemperatureValues } from "@/types/api";
import type {
  OrderMenuItem,
  OrderMenuModifierGroup,
  ServingTemperature,
} from "@/types/menus";

import {
  ADD_ON_OPTION_ID,
  getAddOnItems,
  getApplicableModifierGroups,
  getDefaultServingTemperature,
} from "@/utils/menus";

export const useAddToCartFormSchema = (menuItem: OrderMenuItem) => {
  const tOrder = useTranslations("order");
  const tValidation = useTranslations("validation");

  const getGroupMessage = (
    { minSelectionCount, maxSelectionCount }: OrderMenuModifierGroup,
    selected: string[],
  ) =>
    selected.length < minSelectionCount
      ? tOrder("menuItem.selectAtLeast", { count: minSelectionCount })
      : maxSelectionCount != null && selected.length > maxSelectionCount
        ? tOrder("menuItem.selectUpTo", { count: maxSelectionCount })
        : null;

  const servingTemperatureSchema = z.enum(servingTemperatureValues).nullable();

  return z
    .object({
      quantity: z.number(),
      servingTemperature: servingTemperatureSchema,
      choices: z.record(z.string(), z.array(z.string())),
      addOnServingTemperatures: z.record(z.string(), servingTemperatureSchema),
      addOnChoices: z.record(
        z.string(),
        z.record(z.string(), z.array(z.string())),
      ),
    })
    .superRefine(
      (
        { servingTemperature, choices, addOnServingTemperatures, addOnChoices },
        ctx,
      ) => {
        const validateServingTemperature = (
          servingTemperatures: ServingTemperature[],
          value: ServingTemperature | null,
          path: (string | number)[],
        ) => {
          if (servingTemperatures.length > 0 && !value)
            ctx.addIssue({
              code: "custom",
              message: tValidation("servingTemperature.notSelected"),
              path,
            });
        };

        validateServingTemperature(
          menuItem.servingTemperatures,
          servingTemperature,
          ["servingTemperature"],
        );

        getApplicableModifierGroups(
          menuItem.modifierGroups,
          servingTemperature,
        ).forEach((group) => {
          const message = getGroupMessage(group, choices[group.id] ?? []);

          if (message)
            ctx.addIssue({
              code: "custom",
              message,
              path: ["choices", group.id],
            });
        });

        const selectedAddOnIds = choices[ADD_ON_OPTION_ID] ?? [];

        getAddOnItems(menuItem)
          .filter(({ id }) => selectedAddOnIds.includes(id))
          .forEach(({ id: addOnId, modifierGroups, servingTemperatures }) => {
            const addOnServingTemperature =
              addOnServingTemperatures[addOnId] ||
              getDefaultServingTemperature(servingTemperatures);

            validateServingTemperature(
              servingTemperatures,
              addOnServingTemperature,
              ["addOnServingTemperatures", addOnId],
            );

            getApplicableModifierGroups(
              modifierGroups,
              addOnServingTemperature,
            ).forEach((group) => {
              const message = getGroupMessage(
                group,
                addOnChoices[addOnId]?.[group.id] ?? [],
              );

              if (message)
                ctx.addIssue({
                  code: "custom",
                  message,
                  path: ["addOnChoices", addOnId, group.id],
                });
            });
          });
      },
    );
};

export type AddToCartFormInput = z.input<
  ReturnType<typeof useAddToCartFormSchema>
>;

export type AddToCartFormOutput = z.output<
  ReturnType<typeof useAddToCartFormSchema>
>;
