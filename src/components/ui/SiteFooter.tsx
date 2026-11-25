import { Container } from "./Container";
import { FooterSignature } from "./FooterSignature";

/**
 * The footer every page ends with: links (Support included), the "not
 * affiliated" note and socials, aligned to the same container as the page
 * content. The homepage wraps the same FooterSignature with its big
 * wordmark instead.
 */
export function SiteFooter() {
  return (
    <div className="border-line-subtle bg-surface-0 border-t">
      <Container size="app" className="py-10 sm:py-4">
        <FooterSignature />
      </Container>
    </div>
  );
}
