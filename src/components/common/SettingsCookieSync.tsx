"use client";
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { SettingsData } from '@/hooks/fetchSettings';

export default function SettingsCookieSync({ settings }: { settings: SettingsData | null }) {
    useEffect(() => {
        if (settings) {
            // Save to cookies
            if (settings.vat) Cookies.set('vat', settings.vat);
            if (settings.tax) Cookies.set('tax', settings.tax.toString());
            if (settings.service) Cookies.set('service', settings.service.toString());
            Cookies.set('app_settings', JSON.stringify(settings), { expires: 7 });
        }
    }, [settings]);

    return null;
}