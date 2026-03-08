import { Container } from "../ui/Container";
import { FooterSignature } from "../ui/FooterSignature";
import { NavBar } from "../ui/NavBar";

export function TermsAndConditions() {
  return (
    <section className="min-h-svh flex flex-col">
      <Container  className="min-h-svh flex flex-col">
        <NavBar showHelp={false} />
        <div className="flex flex-col items-start pt-16 pb-6">
          <h2 className="text-4xl font-semibold leading-headers text-base md:text-5xl">
            Terms and conditions
          </h2>
          <div className="flex flex-col items-center text-start">
            <div className="w-auto pt-10 flex flex-col items-start gap-10">
              <div className="mt-auto text-base">
                <label className="l1-b">1. Introduction</label>
                <p className="p1-r">
                  This platform allows users to view and analyze data related to
                  their Instagram account using files exported directly through
                  the official tools provided by Meta. By accessing or using
                  this service, the user agrees to comply with and be bound by
                  these Terms and Conditions. The service operates exclusively
                  on files voluntarily provided by the user and does not require
                  direct access to the user's Instagram account.
                </p>
              </div>

              <div className="mt-auto text-base">
                <label className="l1-b">2. Source of Data</label>
                <p className="p1-r">
                  To use the platform's features, users must obtain their
                  Instagram data through the official export tools provided by
                  Meta, such as the Meta Accounts Center. The platform does not
                  provide or facilitate unauthorized access to third-party data.
                  All files used within the service must originate from
                  legitimate and official data export procedures.
                </p>
              </div>

              <div className="mt-auto text-base">
                <label className="l1-b">3. Service Functionality</label>
                <p className="p1-r">
                  The platform allows users to: - View certain metrics related
                  to their Instagram account - Analyze the data exported by the
                  user - Compare multiple exported datasets in order to identify
                  changes, such as accounts that have recently unfollowed the
                  user. The “unfollow detection” functionality is based solely
                  on a comparison between files manually uploaded by the user.
                </p>
              </div>

              <div className="mt-auto text-base">
                <label className="l1-b">4. File and Data Handling</label>
                <p className="p1-r">
                  The platform does not store, save, or archive any files or
                  personal information uploaded by the user. All analysis and
                  comparison operations are performed temporarily for the sole
                  purpose of generating the requested results. Once the
                  operation is completed, the data is not retained or stored by
                  the system. Therefore: each new analysis requires the user to
                  upload the files again each comparison is treated as an
                  independent operation the platform does not maintain any
                  history of previous analyses
                </p>
              </div>

              <div className="mt-auto text-base">
                <label className="l1-b">5. Data Updates</label>
                <p className="p1-r">
                  The platform does not automatically update user data. If the
                  user wishes to obtain updated results, they must download a
                  new dataset using the official Meta data export process and
                  upload it again to the platform. Maintaining updated datasets
                  is entirely the responsibility of the user.
                </p>
              </div>

              <div className="mt-auto text-base">
                <label className="l1-b">6. Limitation of Liability</label>
                <p className="p1-r">
                  The service is provided as a support tool for analyzing data
                  exported by the user. The results generated depend entirely on
                  the files uploaded and on their accuracy or completeness. The
                  platform does not guarantee absolute accuracy of the results
                  produced through file comparisons and shall not be held
                  responsible for any incorrect interpretation or use of the
                  generated data.
                </p>
              </div>

              <div className="mt-auto text-base">
                <label className="l1-b">
                  7. Independence from Instagram and Meta
                </label>
                <p className="p1-r">
                  This service is an independent tool and is not affiliated
                  with, endorsed by, or associated with Instagram or Meta
                  Platforms, Inc. All trademarks and brand names mentioned
                  belong to their respective owners.
                </p>
              </div>

              <div className="mt-auto text-base">
                <label className="l1-b">8. Changes to the Terms</label>
                <p className="p1-r">
                  The platform owner reserves the right to modify these Terms
                  and Conditions at any time. Any changes will become effective
                  upon publication on the platform.
                </p>
              </div>

              <div className="mt-auto text-base">
                <label className="l1-b">9. Acceptance of Terms</label>
                <p className="p1-r">
                  By using this platform, the user confirms that they have read,
                  understood, and agreed to these Terms and Conditions.
                </p>
              </div>
            </div>

            
          </div>
        </div>
        <FooterSignature />
      </Container>
    </section>
  );
}
