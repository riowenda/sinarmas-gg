import React from 'react';
import { useTranslation } from 'react-i18next';

export function ChangeLanguage() {
    const {t, i18n} = useTranslation();
    function TranslateClick(lang) {
        console.log(lang);
        i18n.changeLanguage(lang);
    }
    return(
        <div>
            <div className="docs-demo-mode-toggle w-full">
                <button type="button" onClick={()=>TranslateClick('id')} className="is-button is-selected" title="Login dengan iSafe">Indonesia</button>
                <button type="button" onClick={()=>TranslateClick('en')} className="is-button"  title="Login tanpa iSafe">English</button>
            </div>
        </div>
    )
}