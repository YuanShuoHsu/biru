import { useLocale, useTranslations } from "next-intl";
import * as z from "zod";

import { useServingTemperatureLabel } from "@/hooks/useServingTemperatureLabel";

import { servingTemperatureLevelValues } from "@/types/api";
import type {
  OrderMenuItem,
  OrderMenuModifierGroup,
  ServingTemperature,
  ServingTemperatureLevel,
} from "@/types/menus";

import { ADD_ON_OPTION_ID, getAddOnItems } from "@/utils/menus";

export const useAddToCartFormSchema = (menuItem: OrderMenuItem) => {
  const locale = useLocale();
  const tOrder = useTranslations("order");
  const tValidation = useTranslations("validation");

  const getServingTemperatureLabel = useServingTemperatureLabel();

  const getGroupMessage = (
    { minSelectionCount, maxSelectionCount }: OrderMenuModifierGroup,
    selected: string[],
  ) =>
    selected.length < minSelectionCount
      ? tOrder("menuItem.selectAtLeast", { count: minSelectionCount })
      : maxSelectionCount != null && selected.length > maxSelectionCount
        ? tOrder("menuItem.selectUpTo", { count: maxSelectionCount })
        : null;

  const servingTemperatureLevelSchema = z
    .enum(servingTemperatureLevelValues)
    .nullable();

  return z
    .object({
      quantity: z.number(),
      servingTemperatureLevel: servingTemperatureLevelSchema,
      choices: z.record(z.string(), z.array(z.string())),
      addOnServingTemperatureLevels: z.record(
        z.string(),
        servingTemperatureLevelSchema,
      ),
      addOnChoices: z.record(
        z.string(),
        z.record(z.string(), z.array(z.string())),
      ),
    })
    .superRefine(
      (
        {
          servingTemperatureLevel,
          choices,
          addOnServingTemperatureLevels,
          addOnChoices,
        },
        ctx,
      ) => {
        const validateServingTemperatureLevel = (
          servingTemperatures: ServingTemperature[],
          value: ServingTemperatureLevel | null,
          path: (string | number)[],
        ) => {
          if (servingTemperatures.length > 0 && !value)
            ctx.addIssue({
              code: "custom",
              message: tValidation("servingTemperatureLevel.notSelected", {
                label:
                  getServingTemperatureLabel(
                    servingTemperatures,
                  ).toLocaleLowerCase(locale),
              }),
              path,
            });
        };

        validateServingTemperatureLevel(
          menuItem.servingTemperatures,
          servingTemperatureLevel,
          ["servingTemperatureLevel"],
        );

        menuItem.modifierGroups.forEach((group) => {
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
            validateServingTemperatureLevel(
              servingTemperatures,
              addOnServingTemperatureLevels[addOnId] || null,
              ["addOnServingTemperatureLevels", addOnId],
            );

            modifierGroups.forEach((group) => {
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
