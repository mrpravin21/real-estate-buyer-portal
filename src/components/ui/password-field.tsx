"use client";

import { useId, useState } from "react";
import { Input, Label } from "@/components/ui/input";

export function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  required,
  minLength,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  hint?: string;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          minLength={minLength}
          className="pr-[5.75rem]"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-burgundy-700/85 transition hover:bg-cream-200/80 hover:text-burgundy-900"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {hint ? (
        <p className="mt-1.5 text-xs text-burgundy-800/50">{hint}</p>
      ) : null}
    </div>
  );
}
