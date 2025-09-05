import { useCallback, useState } from 'react';

interface UsePercentInputOptions {
    allowDecimals?: boolean;
    maxValue?: number;
    minValue?: number;
}

export function usePercentInput(initialValue: number = 0, options: UsePercentInputOptions = {}) {
    const { allowDecimals = false, maxValue = 100, minValue = 0 } = options;

    const [display, setDisplay] = useState(formatPercent(initialValue));
    const [raw, setRaw] = useState(initialValue);

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;

            if (inputValue === '' || inputValue === '%') {
                setRaw(0);
                setDisplay('');
                return;
            }

            const cleanValue = inputValue.replace('%', '');

            let numericValue: number;

            if (allowDecimals) {
                const numericString = cleanValue.replace(/[^\d.]/g, '');
                const parts = numericString.split('.');
                const formattedString = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericString;

                numericValue = parseFloat(formattedString) || 0;
            } else {
                const numericString = cleanValue.replace(/\D/g, '');
                numericValue = parseInt(numericString, 10) || 0;
            }

            numericValue = Math.max(minValue, Math.min(numericValue, maxValue));

            setRaw(numericValue);
            setDisplay(formatPercent(numericValue));
        },
        [allowDecimals, maxValue, minValue],
    );

    const handleBlur = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_e: React.FocusEvent<HTMLInputElement>) => {
            if (display === '') {
                setRaw(0);
                setDisplay(formatPercent(0));
            }
        },
        [display],
    );

    const setValue = useCallback(
        (value: number) => {
            const constrainedValue = Math.max(minValue, Math.min(value, maxValue));
            setRaw(constrainedValue);
            setDisplay(formatPercent(constrainedValue));
        },
        [maxValue, minValue],
    );

    const reset = useCallback(() => {
        setRaw(initialValue);
        setDisplay(formatPercent(initialValue));
    }, [initialValue]);

    return {
        display,
        raw,
        onChange: handleChange,
        onBlur: handleBlur,
        setValue,
        reset,
        isValid: raw >= minValue && raw <= maxValue,
        isEmpty: display === '',
    };
}

function formatPercent(value: number | string): string {
    if (value === '' || value === null || value === undefined) {
        return '';
    }

    const numValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numValue)) {
        return '';
    }

    return `${numValue % 1 === 0 ? numValue : numValue.toFixed(2)}%`;
}
