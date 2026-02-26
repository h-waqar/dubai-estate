"use server";

import { prisma } from "@/lib/prisma";
import { TransactionType, TransactionStatus } from "@prisma/client";
import { serializeDecimals } from "@/lib/serializeDecimal";

export interface LedgerFilterInput {
  userId?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export async function getGlobalLedger(filters: LedgerFilterInput = {}) {
  const { userId, type, status, startDate, endDate, page = 1, limit = 50 } = filters;

  const where: any = {};

  if (userId) {
    where.userId = userId;
  }

  if (type) {
    where.type = type;
  }

  if (status) {
    where.status = status;
  }

  if (startDate || endDate) {
    where.occurredAt = {};
    if (startDate) where.occurredAt.gte = new Date(startDate);
    if (endDate) where.occurredAt.lte = new Date(endDate);
  }

  try {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.ledgerTransaction.findMany({
        where,
        orderBy: { occurredAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.ledgerTransaction.count({ where }),
    ]);

    return {
      success: true,
      data: serializeDecimals(transactions),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    console.error("Failed to fetch global ledger:", error);
    return { success: false, error: "Failed to fetch ledger data" };
  }
}

export async function getLedgerStats() {
    try {
        const stats = await prisma.ledgerTransaction.aggregate({
            _sum: {
                amount: true
            },
            where: {
                status: TransactionStatus.COMPLETED,
                type: TransactionType.PAYMENT
            }
        });

        const totalRevenue = stats._sum.amount || 0;

        return {
            success: true,
            totalRevenue: Number(totalRevenue)
        };
    } catch (error) {
        return { success: false, error: "Failed to fetch ledger stats" };
    }
}
