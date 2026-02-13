import { prisma } from "@/lib/prisma";
import { EditorialStatus, ModerationStatus, SystemStatus } from "@prisma/client";

export class GovernanceService {
  /**
   * Returns the exact Prisma where clause for public-facing pages.
   */
  static getPublicFilter() {
    return {
      editorialStatus: EditorialStatus.SUBMITTED,
      moderationStatus: ModerationStatus.APPROVED,
      systemStatus: SystemStatus.ACTIVE,
    };
  }

  /**
   * Helper for UI/Frontend to check visibility without querying.
   */
  static isVisible(entity: {
    editorialStatus: EditorialStatus;
    moderationStatus: ModerationStatus;
    systemStatus: SystemStatus;
  }) {
    return (
      entity.editorialStatus === EditorialStatus.SUBMITTED &&
      entity.moderationStatus === ModerationStatus.APPROVED &&
      entity.systemStatus === SystemStatus.ACTIVE
    );
  }

  /**
   * Submit a property for review
   */
  static async submitPropertyForReview(id: number, tx: any = prisma) {
    return await tx.property.update({
      where: { id },
      data: {
        editorialStatus: EditorialStatus.SUBMITTED,
        moderationStatus: ModerationStatus.PENDING_REVIEW,
        status: "PENDING_REVIEW" as any,
      },
    });
  }

  /**
   * Approve a property
   */
  static async approveProperty(id: number, adminId: number, tx: any = prisma) {
    return await tx.property.update({
      where: { id },
      data: {
        moderationStatus: ModerationStatus.APPROVED,
        approvedById: adminId,
        publishedAt: new Date(),
        published: true, // Sync deprecated field
        status: "APPROVED" as any, // Sync deprecated field
      },
    });
  }

  /**
   * Reject a property
   */
  static async rejectProperty(id: number, adminId: number, reason?: string, tx: any = prisma) {
    return await tx.property.update({
      where: { id },
      data: {
        moderationStatus: ModerationStatus.REJECTED,
        approvedById: adminId,
        declinedReason: reason,
        published: false,
        status: "DECLINED" as any,
      },
    });
  }

  /**
   * Submit a project for review
   */
  static async submitProjectForReview(id: number, tx: any = prisma) {
    return await tx.project.update({
      where: { id },
      data: {
        editorialStatus: EditorialStatus.SUBMITTED,
        moderationStatus: ModerationStatus.PENDING_REVIEW,
        status: "PENDING_REVIEW" as any,
      },
    });
  }

  /**
   * Approve a project
   */
  static async approveProject(id: number, adminId: number, tx: any = prisma) {
    return await tx.project.update({
      where: { id },
      data: {
        moderationStatus: ModerationStatus.APPROVED,
        approvedById: adminId,
        publishedAt: new Date(),
        published: true,
        status: "APPROVED" as any,
      },
    });
  }

  /**
   * Reject a project
   */
  static async rejectProject(id: number, adminId: number, tx: any = prisma) {
    return await tx.project.update({
      where: { id },
      data: {
        moderationStatus: ModerationStatus.REJECTED,
        approvedById: adminId,
        published: false,
        status: "DECLINED" as any,
      },
    });
  }

  /**
   * Archive a property (Editorial action)
   */
  static async archiveProperty(id: number, tx: any = prisma) {
    return await tx.property.update({
      where: { id },
      data: {
        editorialStatus: EditorialStatus.ARCHIVED,
        published: false,
        status: "ARCHIVED" as any,
      },
    });
  }

  /**
   * Archive a project (Editorial action)
   */
  static async archiveProject(id: number, tx: any = prisma) {
    return await tx.project.update({
      where: { id },
      data: {
        editorialStatus: EditorialStatus.ARCHIVED,
        published: false,
        status: "ARCHIVED" as any,
      },
    });
  }
}

