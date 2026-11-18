import { expect, it } from "vitest";
import { encodeSelectOptionValue } from "../src/filter-controls/filter-control-helpers/encode-select-option-value";
import { decodeSelectOptionValue } from "../src/filter-controls/filter-control-helpers/decode-select-option-value";
it("keeps numeric, string and empty option values distinct through controls", () => {
  const options: Array<{ value: string | number }> = [
    { value: 1 },
    { value: "1" },
    { value: "" },
  ];
  expect(decodeSelectOptionValue(options, encodeSelectOptionValue("1"))).toBe(
    "1",
  );
  expect(decodeSelectOptionValue(options, encodeSelectOptionValue(1))).toBe(1);
  expect(encodeSelectOptionValue("")).not.toBe("");
  expect(decodeSelectOptionValue(options, encodeSelectOptionValue(""))).toBe(
    "",
  );
  expect(decodeSelectOptionValue(options, "unknown")).toBeNull();
});
