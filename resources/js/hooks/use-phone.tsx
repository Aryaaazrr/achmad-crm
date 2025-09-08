import { useState } from "react";

export default function usePhoneInput(initialValue = "") {
    const [displayValue, setDisplayValue] = useState(formatPhone(initialValue));
    const [rawValue, setRawValue] = useState(initialValue);

    function formatPhone(value: string) {
        if (!value) return "";

        let digits = value.replace(/\D/g, "");

        if (digits.startsWith("0")) {
            digits = "62" + digits.slice(1);
        }

        let formatted = "+" + digits;
        if (digits.length > 2) {
            formatted = "+" + digits.slice(0, 2) + "-" + digits.slice(2, 5);
        }
        if (digits.length > 5) {
            formatted += "-" + digits.slice(5, 9);
        }
        if (digits.length > 9) {
            formatted += "-" + digits.slice(9, 13);
        }

        return formatted;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const digits = input.replace(/\D/g, "");

        setRawValue(digits.startsWith("62") ? "0" + digits.slice(2) : digits);
        setDisplayValue(formatPhone(digits));
    };

    return {
        displayValue,
        rawValue,
        handleChange,
    };
}
