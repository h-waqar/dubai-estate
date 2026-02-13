import { Prisma, TransactionType, TransactionStatus } from "@prisma/client";

interface RecordTransactionParams {
  userId: number;
  type: TransactionType;
  status: TransactionStatus;
  amount: Prisma.Decimal;
  currency: string;
  provider: string;
  providerTxId: string;
  occurredAt: Date;
  metadata?: Prisma.InputJsonValue;
}

export const ledgerService = {
  /**
   * Records a financial transaction in the ledger.
   * This function is idempotent based on providerTxId.
   * It is WRITE-ONLY and must be used within a transaction if part of a larger operation.
   *
   * @param tx The Prisma transaction client (mandatory)
   * @param params Transaction details
   */
  async recordTransaction(
    tx: Prisma.TransactionClient,
    params: RecordTransactionParams
  ) {
    const {
      userId,
      type,
      status,
      amount,
      currency,
      provider,
      providerTxId,
      occurredAt,
      metadata,
    } = params;

    // Idempotency check using upsert (or findUnique then create to avoid race conditions strictly handled by unique constraint)
    // Upsert is safer for simple idempotency where we want to ensure it exists.
    // Instruction says: "Use upsert OR explicit findUnique -> create. Return existing record if already present. Throw on failure"

    try {
        // We use upsert to handle potential race conditions and ensure idempotency.
        // If it exists, we return it (effectively a no-op for the 'update' part usually,
        // but here we might want to ensure fields match? The requirement says "Return existing record if already present").
        // We will just update 'updatedAt' effectively or nothing to satisfy the update clause.
        // Actually, strictly speaking, if it exists, we shouldn't change historical data.
        // So we can use findUnique first? But upsert is atomic-ish.
        // Let's use upsert with empty update (or just updateUpdatedAt if we had it) to return the record.
        // Wait, LedgerTransaction doesn't have updatedAt based on schema I added.
        // So update will be empty.

      const record = await tx.ledgerTransaction.upsert({
        where: { providerTxId },
        update: {}, // No-op if exists, essentially returning the existing record
        create: {
          userId,
          type,
          status,
          amount,
          currency,
          provider,
          providerTxId,
          occurredAt,
          metadata,
        },
      });

      return record;
    } catch (error) {
      // Ensure we don't swallow errors.
      console.error("Ledger Write Failed:", error);
      throw error;
    }
  },
};
