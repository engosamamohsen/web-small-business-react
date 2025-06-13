import React from "react";
import { Dropdown } from "primereact/dropdown";
import Styles from "./style.module.css";
import { cn } from "@/utils/utils";

interface Item {
  name: string;
  value: number;
}

interface SelectInputProps {
  className?: string;
  placeholder?: string;
  options: Item[];
  name?: string;
  value: any;
  setValue: any;
  setError: any;
  disabled?: boolean;
  optionLabel?: string;
  loading?: boolean;
}
export default function SelectInput({
  className,
  placeholder,
  options,
  name,
  setValue,
  value,
  setError,
  loading = false,
  disabled = false,
  optionLabel = "name",
}: SelectInputProps) {
  return (
    <Dropdown
      name={name}
      loading={loading}
      value={value.value}
      onChange={(e: any) => {
        const targetValue = options.filter((op) => op.value == e.target.value);
        if (targetValue.length) {
          setError(name, { type: "required" });
        }
        setValue(name, { ...targetValue[0] });
      }}
      disabled={disabled}
      options={options}
      optionLabel={optionLabel}
      virtualScrollerOptions={{ itemSize: 38 }}
      placeholder={placeholder}
      className={cn(Styles.selectInput, className)}
      showClear
    />
  );
}
