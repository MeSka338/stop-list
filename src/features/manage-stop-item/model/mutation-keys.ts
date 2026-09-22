export const menuItemMutationKeys = {
  all: ["menu-items", "mutation"] as const,
  stop: () => [...menuItemMutationKeys.all, "stop"] as const,
  resume: () => [...menuItemMutationKeys.all, "resume"] as const,
};
