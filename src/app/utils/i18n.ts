import storage from '../utils/storage'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import sprintf from 'i18next-sprintf-postprocessor'
import resources from '../lng'
import language from './language'

let lng = language.split('-').join('_')

if (!resources[lng]) {
    lng = 'zh_CN'
    storage.set('language', 'zh_CN')
}

i18n.use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .use(sprintf)
    .init({
        fallbackLng: 'zh_CN',
        resources,
        lng,
        keySeparator: false, // we do not use keys in form messages.welcome
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    })

export default i18n
