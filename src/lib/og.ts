import { siteConfig } from '@/constant/config';

type OpenGraphType = {
  siteName: string;
  description: string;
  templateTitle?: string;
  logo?: string;
};
export function openGraph({
  siteName,
  templateTitle,
  description,
  logo = siteConfig.url + '/images/logo.jpg',
}: OpenGraphType): string {
  const ogLogo = encodeURIComponent(logo);
  const ogSiteName = encodeURIComponent(siteName.trim());
  const ogTemplateTitle = templateTitle
    ? encodeURIComponent(templateTitle.trim())
    : undefined;
  const ogDesc = encodeURIComponent(description.trim());

  return (
    siteConfig.url +
    `/api/general?siteName=${ogSiteName}&description=${ogDesc}&logo=${ogLogo}${
      ogTemplateTitle ? `&templateTitle=${ogTemplateTitle}` : ''
    }`
  );
}
