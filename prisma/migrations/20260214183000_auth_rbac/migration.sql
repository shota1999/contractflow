-- Add password hash to users
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;

-- Rebuild MembershipRole enum to match RBAC requirements
ALTER TYPE "MembershipRole" RENAME TO "MembershipRole_old";

CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

ALTER TABLE "Membership"
  ALTER COLUMN "role" TYPE "MembershipRole"
  USING (
    CASE "role"::text
      WHEN 'OWNER' THEN 'OWNER'
      WHEN 'ADMIN' THEN 'ADMIN'
      WHEN 'MEMBER' THEN 'MEMBER'
      WHEN 'VIEWER' THEN 'VIEWER'
      ELSE 'MEMBER'
    END
  )::"MembershipRole";

DROP TYPE "MembershipRole_old";
