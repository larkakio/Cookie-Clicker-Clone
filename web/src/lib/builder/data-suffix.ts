import { Attribution } from "ox/erc8021";
import { concat, type Hex } from "viem";
import { getBuilderCode, getBuilderCodeSuffixHex } from "@/lib/env/public";

export function getCheckInCalldata(encodedFunctionData: Hex): Hex {
  const override = getBuilderCodeSuffixHex();
  if (override) return concat([encodedFunctionData, override]);
  const code = getBuilderCode();
  if (!code) return encodedFunctionData;
  const suffix = Attribution.toDataSuffix({ codes: [code] }) as Hex;
  return concat([encodedFunctionData, suffix]);
}
