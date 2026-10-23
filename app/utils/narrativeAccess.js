/** Réponses attendues lorsque l’atelier narration (personnages / scènes) refuse l’accès. */
export function isNarrativeAccessDenied(error) {
  const code = error?.statusCode ?? error?.status
  return code === 401 || code === 403 || code === 404
}
