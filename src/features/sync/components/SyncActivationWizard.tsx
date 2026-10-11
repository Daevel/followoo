import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Checkbox } from "@/components/ui/Checkbox";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { generateRecoveryCode } from "@/features/sync/crypto";
import { useSyncActivation } from "@/features/sync/hooks/useSyncActivation";
import {
  type SyncActivationPassphraseValues,
  syncActivationPassphraseSchema,
} from "@/features/sync/schemas/syncActivation.schema";

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
    await activate(passphrase, recoveryCode);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-bg relative w-full max-w-lg rounded-[10px] border border-white/10 p-6">
        <button
          type="button"
          onClick={handleClose}
          disabled={isBusy}
          aria-label="Close"
          className="text-foreground/50 hover:text-foreground absolute top-4 right-4 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="close" color="foreground" width={20} height={20} />
        </button>

        {step === "intro" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-foreground text-xl font-semibold">
              Activate encrypted history
            </h2>
            <p className="text-foreground/80 text-sm leading-6">
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
            <h2 className="text-foreground text-xl font-semibold">
              Choose a passphrase
            </h2>
            <p className="text-foreground/80 text-sm leading-6">
              This passphrase is separate from your account password - it is the
              only way (besides your recovery code) to unlock your encrypted
              history.
            </p>

            <Input
              type="password"
              placeholder="Passphrase"
              autoComplete="new-password"
              hasError={!!passphraseForm.formState.errors.passphrase}
              {...passphraseForm.register("passphrase")}
            />
            {passphraseForm.formState.errors.passphrase && (
              <p className="text-accent text-xs">
                {passphraseForm.formState.errors.passphrase.message}
              </p>
            )}

            <Input
              type="password"
              placeholder="Confirm passphrase"
              autoComplete="new-password"
              hasError={!!passphraseForm.formState.errors.confirmPassphrase}
              {...passphraseForm.register("confirmPassphrase")}
            />
            {passphraseForm.formState.errors.confirmPassphrase && (
              <p className="text-accent text-xs">
                {passphraseForm.formState.errors.confirmPassphrase.message}
              </p>
            )}

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
            <h2 className="text-foreground text-xl font-semibold">
              Save your recovery code
            </h2>

            <Callout title="This is shown only once" variant="warning">
              If you lose both your passphrase and this recovery code, your
              encrypted history cannot be recovered - there is no "reset
              password" option. Copy or download it now.
            </Callout>

            <p
              className="border-foreground/20 text-foreground rounded-[10px] border bg-white/5 px-4 py-3 text-center font-mono text-lg tracking-wide"
              data-testid="recovery-code"
            >
              {recoveryCode}
            </p>

            <div className="flex gap-3">
              <Button
                background="bg"
                foreground="foreground"
                onClick={handleCopyRecoveryCode}
              >
                {hasCopied ? "Copied" : "Copy"}
              </Button>
              <Button
                background="bg"
                foreground="foreground"
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
            <h2 className="text-foreground text-xl font-semibold">
              Activate encrypted history
            </h2>
            <p className="text-foreground/80 text-sm leading-6">
              Your encrypted history will be activated using the passphrase and
              recovery code from the previous steps. Make sure you have saved
              your recovery code before continuing.
            </p>

            {status === "error" && (
              <Callout title="Activation failed" variant="warning">
                We couldn't activate encrypted history right now. Please try
                again.
              </Callout>
            )}

            <div>
              <Button onClick={handleActivate} disabled={isBusy}>
                {isBusy ? "Activating..." : "Activate"}
              </Button>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-foreground text-xl font-semibold">
              Encrypted history is active
            </h2>
            <p className="text-foreground/80 text-sm leading-6">
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
