import type { LucideProps } from "lucide-react";
import type {
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";

export type FilterType =
  | "select"
  | "multi-select-button"
  | "multi-select"
  | "boolean"
  | "search"
  | "color";

export type FilterOptionValue = string | number;

export interface BaseFilter<Type extends FilterType, Value> {
  type: Type;
  key: string;
  label: string | null;
  value: Value | null;
}

export interface MultiSelectButtonFilter<
  Value extends FilterOptionValue = FilterOptionValue,
> extends BaseFilter<"multi-select-button", Array<Value>> {
  options: Array<{
    icon?: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    label: ReactNode;
    value: Value;
  }>;
}

export interface SelectFilter<
  Value extends FilterOptionValue = FilterOptionValue,
> extends BaseFilter<"select", Value> {
  options: Array<{
    label: string;
    value: Value;
  }>;
  placeholder?: string;
}

export interface MultiSelectFilter<
  Value extends FilterOptionValue = FilterOptionValue,
> extends BaseFilter<"multi-select", Array<Value>> {
  options: Array<{
    label: string;
    value: Value;
  }>;
  placeholder?: string;
}

export interface BooleanFilter extends BaseFilter<"boolean", boolean> {
  defaultValue?: boolean;
}

export interface ColorFilter extends BaseFilter<"color", Array<string>> {
  options: Array<{
    label: string;
    value: string;
    swatch?: string | null;
  }>;
  placeholder?: string;
}

export interface SearchFilter extends BaseFilter<"search", string> {
  key: "search";
  placeholder?: string;
}

export interface SortFilter<
  Value extends FilterOptionValue = FilterOptionValue,
> extends SelectFilter<Value> {
  key: "sort";
}

export type Filter =
  | SelectFilter
  | MultiSelectFilter
  | BooleanFilter
  | MultiSelectButtonFilter
  | ColorFilter;

export type FilterValue = Filter["value"] | SearchFilter["value"];
