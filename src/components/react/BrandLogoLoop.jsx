import LogoLoop from './LogoLoop.jsx';

const brandIcon = (file, title) => ({
  src: `/ai-brand-logo/${file}`,
  alt: title,
  title,
});

const zhLogos = [
  brandIcon('deepseek-color.svg', 'DeepSeek'),
  brandIcon('kimi-color.svg', 'Kimi · Moonshot'),
  brandIcon('minimax-color.svg', 'MiniMax'),
  brandIcon('zhipu-color.svg', '智谱 GLM'),
];

const enLogos = zhLogos.map((logo) => ({
  ...logo,
  alt: logo.alt.replace('智谱 GLM', 'Zhipu GLM'),
  title: logo.title.replace('智谱 GLM', 'Zhipu GLM'),
}));

export default function BrandLogoLoop({
  ariaLabel = '平台已接入的 AI 厂商与模型',
  locale = 'zh',
}) {
  const logos = locale === 'en' ? enLogos : zhLogos;
  return (
    <LogoLoop
      logos={logos}
      speed={60}
      direction="left"
      logoHeight={64}
      gap={64}
      hoverSpeed={0}
      scaleOnHover
      fadeOut
      fadeOutColor="#ffffff"
      ariaLabel={ariaLabel}
      className="logoloop"
    />
  );
}
