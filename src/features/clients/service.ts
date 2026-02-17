import * as repo from "./repo";

export async function listClients(organizationId: string) {
  return repo.listClients(organizationId);
}
