import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Checkbox } from "@/components/ui/Checkbox";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { generateRecoveryCode } from "@/features/sync/crypto";
import { useSyncActivation } from "@/features/sync/hooks/useSyncActivation";
import {
  type SyncActivationPassphraseValues,
  syncActivationPassphraseSchema,
} from "@/features/sync/schemas/syncActivation.schema";
import { useSyncKey } from "@/providers/SyncKeyProvider";

type WizardStep = "intro" | "passphrase" | "recovery-code" | "confirm";

type SyncActivationWizardProps = {
  onClose: () => void;
};

export function SyncActivationWizard({ onClose }: SyncActivationWizardProps) {
  const [step, setStep] = useState<WizardStep>("intro");
  const [passphrase, setPassphrase] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [hasSavedRecoveryCode, setHasSavedRecoveryCode] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { status, activate } = useSyncActivation();
  const { setUnlockedAfterActivation } = useSyncKey();

  const passphraseForm = useForm<SyncActivationPassphraseValues>({
    resolver: zodResolver(syncActivationPassphraseSchema),
    mode: "onChange",
    defaultValues: { passphrase: "", confirmPassphrase: "" },
  });

  const isBusy = status === "activating";

  function handleClose() {
    if (isBusy) return;
    onClose();
  }

  const onSubmitPassphrase = passphraseForm.handleSubmit((values) => {
    setPassphrase(values.passphrase);
    setRecoveryCode(generateRecoveryCode());
    setHasSavedRecoveryCode(false);
    setHasCopied(false);
    setStep("recovery-code");
  });

  async function handleCopyRecoveryCode() {
    try {
      await navigator.clipboard.writeText(recoveryCode);
      setHasCopied(true);
    } catch {
      // Clipboard access can be denied/unavailable - the code stays
      // visible on screen either way, so this is a soft failure.
    }
  }

  function handleDownloadRecoveryCode() {
    const blob = new Blob(
      [
        `Followoo encrypted history recovery code\n\n${recoveryCode}\n\nKeep this somewhere safe. If you lose both your passphrase and this code, your encrypted history cannot be recovered.\n`,
      ],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "followoo-recovery-code.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleActivate() {
    const generatedMasterKey = await activate(passphrase, recoveryCode);

    if (generatedMasterKey) {
      // The master key was just generated client-side for this exact
      // session - no reason to make the user re-enter the passphrase
      // they just chose to "unlock" what they just activated.
      setUnlockedAfterActivation(generatedMasterKey);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="border-line-strong bg-surface-1 shadow-elev-2 relative w-full max-w-lg rounded-card border p-6">
        <button
          type="button"
          onClick={handleClose}
          disabled={isBusy}
          aria-label="Close"
          className="text-fg-muted hover:text-fg focus-visible:shadow-ring rounded-control outline-none absolute top-4 right-4 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="close" color="current" width={20} height={20} />
        </button>

        {step === "intro" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-fg text-xl font-semibold">
              Activate encrypted history
            </h2>
            <p className="text-fg-muted text-sm leading-6">
              Encrypted history lets you keep past analyses and compare them
              over time. It is always free. Your history is encrypted in your
              browser before it ever reaches our servers - Followoo cannot read
              it.
            </p>
            <div>
              <Button onClick={() => setStep("passphrase")}>Continue</Button>
            </div>
          </div>
        )}

        {step === "passphrase" && (
          <form onSubmit={onSubmitPassphrase} className="flex flex-col gap-4">
            <h2 className="text-fg text-xl font-semibold">
              Choose a passphrase
            </h2>
            <p className="text-fg-muted text-sm leading-6">
              This passphrase is separate from your account password - it is the
              only way (besides your recovery code) to unlock your encrypted
              history.
            </p>

            <Field
              label="Passphrase"
              htmlFor="sync-passphrase"
              error={passphraseForm.formState.errors.passphrase?.message}
            >
              <Input
                id="sync-passphrase"
                type="password"
                autoComplete="new-password"
                hasError={!!passphraseForm.formState.errors.passphrase}
                {...passphraseForm.register("passphrase")}
              />
            </Field>

            <Field
              label="Confirm passphrase"
              htmlFor="sync-confirm-passphrase"
              error={passphraseForm.formState.errors.confirmPassphrase?.message}
            >
              <Input
                id="sync-confirm-passphrase"
                type="password"
                autoComplete="new-password"
                hasError={!!passphraseForm.formState.errors.confirmPassphrase}
                {...passphraseForm.register("confirmPassphrase")}
              />
            </Field>

            <div>
              <Button
                type="submit"
                disabled={!passphraseForm.formState.isValid}
              >
                Continue
              </Button>
            </div>
          </form>
        )}

        {step === "recovery-code" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-fg text-xl font-semibold">
              Save your recovery code
            </h2>

            <Callout title="This is shown only once" variant="warning">
              If you lose both your passphrase and this recovery code, your
              encrypted history cannot be recovered - there is no "reset
              password" option. Copy or download it now.
            </Callout>

            <p
              className="border-line-strong text-fg rounded-control border bg-surface-2 px-4 py-3 text-center font-mono text-lg tracking-wide"
              data-testid="recovery-code"
            >
              {recoveryCode}
            </p>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleCopyRecoveryCode}>
                {hasCopied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="secondary"
                icon="download"
                onClick={handleDownloadRecoveryCode}
              >
                Download
              </Button>
            </div>

            <Checkbox
              checked={hasSavedRecoveryCode}
              onChange={(e) => setHasSavedRecoveryCode(e.target.checked)}
              label="I have saved my recovery code"
            />

            <div>
              <Button
                disabled={!hasSavedRecoveryCode}
                onClick={() => setStep("confirm")}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && status !== "success" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-fg text-xl font-semibold">
              Activate encrypted history
            </h2>
            <p className="text-fg-muted text-sm leading-6">
              Your encrypted history will be activated using the passphrase and
              recovery code from the previous steps. Make sure you have saved
              your recovery code before continuing.
            </p>

            {status === "error" && (
              <Callout title="Activation failed" variant="danger">
                We couldn't activate encrypted history right now. Please try
                again.
              </Callout>
            )}

            <div>
              <Button onClick={handleActivate} loading={isBusy}>
                {isBusy ? "Activating..." : "Activate"}
              </Button>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-fg text-xl font-semibold">
              Encrypted history is active
            </h2>
            <p className="text-fg-muted text-sm leading-6">
              Your encrypted history has been activated. Keep your passphrase
              and recovery code somewhere safe.
            </p>
            <div>
              <Button onClick={onClose}>Done</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
