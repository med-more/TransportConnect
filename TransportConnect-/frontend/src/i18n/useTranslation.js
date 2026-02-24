import { useLocale } from "../contexts/LocaleContext"
import { t as tRaw } from "./translations"

/**
 * Returns translation function and current language.
 * Use: const { t, language } = useTranslation(); t('nav.dashboard')
 */
export function useTranslation() {
  const { language } = useLocale()
  const t = (key) => tRaw(language, key)
  return { t, language }
}
