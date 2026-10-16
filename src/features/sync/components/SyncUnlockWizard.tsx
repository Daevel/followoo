import { zodResolver } from "@hookform/resolvers/zod";
import { type FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import {
  type SyncActivationPassphraseValues,
  syncActivationPassphraseSchema,
} from "@/features/sync/schemas/syncActivation.schema";
import { useSyncKey } from "@/providers/SyncKeyProvider";

type UnlockStep = "passphrase" | "recovery" | "new-passphrase";

type SyncUnlockWizardProps = {
  onClose: () => void;
};

export function SyncUnlockWizard({ onClose }: SyncUnlockWizardProps) {
  const { unlockWithPassphrase, unlockWithRecoveryCode, setNewPassphrase } =
    useSyncKey();

  const [step, setStep] = useState<UnlockStep>("passphrase");
  const [passphraseInput, setPassphraseInput] = useState("");
  const [recoveryInput, setRecoveryInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // A wrong passphrase/recovery code is expected UI validation, not an
  // AppError - see SyncKeyProvider.unlockWithPassphrase/unlockWithRecoveryCode.
  const [validationError, setValidationError] = useState<string | null>(null);

  const newPassphraseForm = useForm<SyncActivationPassphraseValues>({
    resolver: zodResolver(syncActivationPassphraseSchema),
    mode: "onChange",
    defaultValues: { passphrase: "", confirmPassphrase: "" },
  });

  function handleClose() {
    if (isSubmitting) return;
    onClose();
  }

  async function handleSubmitPassphrase(event: FormEvent) {
    event.preventDefault();
    if (!passphraseInput) return;

    setIsSubmitting(true);
    setValidationError(null);
    const unlocked = await unlockWithPassphrase(passphraseInput);
    setIsSubmitting(false);

    if (unlocked) {
      onClose();
      return;
    }

    setValidationError(
      "That passphrase doesn't match. Try again, or use your recovery code."
    );
  }

  async function handleSubmitRecovery(event: FormEvent) {
    event.preventDefault();
    if (!recoveryInput) return;

    setIsSubmitting(true);
    setValidationError(null);
    const unlocked = await unlockWithRecoveryCode(recoveryInput);
    setIsSubmitting(false);

    if (unlocked) {
      setStep("new-passphrase");
      return;
    }

    setValidationError("That recovery code doesn't match.");
  }

  const onSubmitNewPassphrase = newPassphraseForm.handleSubmit(
    async (values) => {
      setIsSubmitting(true);
      // Network/server failures here surface as an AppError + toast from
      // inside setNewPassphrase itself (SYNC_PASSPHRASE_ROTATION_FAILED) -
      // nothing extra to do here on failure, just let them retry.
      const rotated = await setNewPassphrase(values.passphrase);
      setIsSubmitting(false);

      if (rotated) {
        onClose();
      }
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="border-line-strong bg-surface-1 shadow-elev-2 relative w-full max-w-lg rounded-card border p-6">
        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          aria-label="Close"
          className="text-fg-muted hover:text-fg focus-visible:shadow-ring rounded-control absolute top-4 right-4 outline-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="close" color="current" width={20} height={20} />
        </button>

        {step === "passphrase" && (
          <form
            onSubmit={handleSubmitPassphrase}
            className="flex flex-col gap-4"
          >
            <h2 className="text-fg text-xl font-semibold">
              Unlock encrypted history
            </h2>
            <p className="text-fg-muted text-sm leading-6">
              Enter your passphrase to unlock your encrypted history for this
              session.
            </p>

            <Field
              label="Passphrase"
              htmlFor="sync-unlock-passphrase"
              error={validationError ?? undefined}
            >
              <Input
                id="sync-unlock-passphrase"
                type="password"
                autoComplete="current-password"
                hasError={!!validationError}
                value={passphraseInput}
                onChange={(event) => setPassphraseInput(event.target.value)}
              />
            </Field>

            <div className="flex items-center justify-between gap-3">
              <Button
                type="submit"
                disabled={!passphraseInput}
                loading={isSubmitting}
              >
                Unlock
              </Button>
              <button
                type="button"
                onClick={() => {
                  setValidationError(null);
                  setStep("recovery");
                }}
                className="text-fg-muted hover:text-fg text-[13px] font-medium underline-offset-2 hover:underline"
              >
                I lost my passphrase
              </button>
            </div>
          </form>
        )}

        {step === "recovery" && (
          <form onSubmit={handleSubmitRecovery} className="flex flex-col gap-4">
            <h2 className="text-fg text-xl font-semibold">
              Unlock with your recovery code
            </h2>
            <p className="text-fg-muted text-sm leading-6">
              Enter the recovery code you saved when you activated encrypted
              history.
            </p>

            <Field
              label="Recovery code"
              htmlFor="sync-unlock-recovery"
              error={validationError ?? undefined}
            >
              <Input
                id="sync-unlock-recovery"
                autoComplete="off"
                hasError={!!validationError}
                value={recoveryInput}
                onChange={(event) => setRecoveryInput(event.target.value)}
              />
            </Field>

            <div className="flex items-center justify-between gap-3">
              <Button
                type="submit"
                disabled={!recoveryInput}
                loading={isSubmitting}
              >
                Unlock
              </Button>
              <button
                type="button"
                onClick={() => {
                  setValidationError(null);
                  setStep("passphrase");
                }}
                className="text-fg-muted hover:text-fg text-[13px] font-medium underline-offset-2 hover:underline"
              >
                Back to passphrase
              </button>
            </div>
          </form>
        )}

        {step === "new-passphrase" && (
          <form
            onSubmit={onSubmitNewPassphrase}
            className="flex flex-col gap-4"
          >
            <h2 className="text-fg text-xl font-semibold">
              Set a new passphrase
            </h2>

            <Callout title="You're unlocked" variant="info">
              Your encrypted history is unlocked for this session. You can
              optionally set a new passphrase now so you don't need your
              recovery code next time.
            </Callout>

            <Field
              label="New passphrase"
              htmlFor="sync-new-passphrase"
              error={newPassphraseForm.formState.errors.passphrase?.message}
            >
              <Input
                id="sync-new-passphrase"
                type="password"
                autoComplete="new-password"
                hasError={!!newPassphraseForm.formState.errors.passphrase}
                {...newPassphraseForm.register("passphrase")}
              />
            </Field>

            <Field
              label="Confirm new passphrase"
              htmlFor="sync-confirm-new-passphrase"
              error={
                newPassphraseForm.formState.errors.confirmPassphrase?.message
              }
            >
              <Input
                id="sync-confirm-new-passphrase"
                type="password"
                autoComplete="new-password"
                hasError={
                  !!newPassphraseForm.formState.errors.confirmPassphrase
                }
                {...newPassphraseForm.register("confirmPassphrase")}
              />
            </Field>

            <div className="flex items-center justify-between gap-3">
              <Button
                type="submit"
                disabled={!newPassphraseForm.formState.isValid}
                loading={isSubmitting}
              >
                Set new passphrase
              </Button>
              <button
                type="button"
                onClick={onClose}
                className="text-fg-muted hover:text-fg text-[13px] font-medium underline-offset-2 hover:underline"
              >
                Skip for now
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
