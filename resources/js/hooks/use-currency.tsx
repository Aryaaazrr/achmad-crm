import { useState } from 'react';

export function useCurrencyInput(initialValue: number = 0) {
    const [display, setDisplay] = useState(formatRupiah(initialValue));
    const [raw, setRaw] = useState(initialValue);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        setRaw(Number(rawValue));
        setDisplay(formatRupiah(rawValue));
    };

    const reset = () => {
        setDisplay(formatRupiah(initialValue));
        setRaw(initialValue);
    };

    return {
        display,
        reset,
        raw,
        onChange: handleChange,
    };
}

function formatRupiah(value: string | number) {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Number(value));
}
