import { Helmet } from "react-helmet-async";

type SeoProps = {
  title: string;
  description: string;
  canonical: string;
  image: string;
  noIndex?: boolean;
  schemaMarkup?: object;
};

export const Seo = ({
  title,
  description,
  canonical,
  image,
  noIndex = false,
  schemaMarkup,
}: SeoProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    {noIndex && <meta name="robots" content="noindex,nofollow" />}
    <link rel="canonical" href={canonical} />

    {/* Open Graph for Facebook, LinkedIn */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={image} />
    <meta property="og:site_name" content="Followoo" />

    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />

    {/* Structured Data (Schema Markup) */}
    {schemaMarkup && (
      <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
    )}
  </Helmet>
);

export default Seo;
