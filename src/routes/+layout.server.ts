import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession } }) => {
	// On récupère la session validée côté serveur au chargement de l'application
	const { session, user } = await safeGetSession();

	return {
		session,
		user
	};
};
