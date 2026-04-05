import { prisma } from './prisma';

/**
 * Write an audit log entry.
 * Fires-and-forgets — never throws, so it cannot break the calling request.
 */
export function writeAuditLog(
  entityType: string,
  entityId: string,
  action: string,
  changedBy: string,
  changeData?: Record<string, unknown>,
): void {
  prisma.auditLog
    .create({
      data: {
        entityType,
        entityId,
        action,
        changedBy,
        changeData: changeData ? (changeData as object) : undefined,
      },
    })
    .catch((err) => {
      // Never crash a request because of audit logging
      console.error('[AuditLog] Failed to write:', err);
    });
}
