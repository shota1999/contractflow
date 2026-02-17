import * as repo from "./repo";

export async function listProjects(organizationId: string, clientId?: string) {
  return repo.listProjects(organizationId, clientId);
}
