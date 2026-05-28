import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import type { Profile } from '$lib/types/profile';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(303, '/auth');

	const { data } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', locals.user.id)
		.single();

	return { profile: (data ?? null) as Profile | null };
};

export const actions: Actions = {
	updateProfile: async ({ locals, request }) => {
		if (!locals.user) redirect(303, '/auth');
		const userId = locals.user.id;
		const formData = await request.formData();
		const username = ((formData.get('username') as string | null) ?? '').trim();
		const bio = ((formData.get('bio') as string | null) ?? '').trim() || null;
		const birth_date = ((formData.get('birth_date') as string | null) ?? '').trim() || null;

		if (username.length < 3) {
			return fail(400, {
				updateError: "Le nom d'utilisateur doit contenir au moins 3 caractères."
			});
		}

		const { error: dbError } = await locals.supabase
			.from('profiles')
			.upsert(
				{
					id: userId,
					username,
					bio,
					birth_date: birth_date || null,
					updated_at: new Date().toISOString()
				},
				{ onConflict: 'id' }
			);

		if (dbError) {
			if (dbError.code === '23505') {
				return fail(400, { updateError: "Ce nom d'utilisateur est déjà pris." });
			}
			return fail(500, { updateError: dbError.message });
		}

		await locals.supabase.auth.updateUser({
			data: { username, birth_date: birth_date ?? null }
		});

		return { updateSuccess: 'Profil mis à jour avec succès.' };
	},

	uploadAvatar: async ({ locals, request }) => {
		if (!locals.user) redirect(303, '/auth');
		const userId = locals.user.id;
		const formData = await request.formData();
		const file = formData.get('avatar') as File | null;

		if (!file || file.size === 0) {
			return fail(400, { avatarError: 'Aucun fichier sélectionné.' });
		}

		if (!file.type.startsWith('image/')) {
			return fail(400, { avatarError: 'Le fichier doit être une image.' });
		}

		if (file.size > 2 * 1024 * 1024) {
			return fail(400, { avatarError: "L'image ne doit pas dépasser 2 Mo." });
		}

		const arrayBuffer = await file.arrayBuffer();
		const fileBuffer = new Uint8Array(arrayBuffer);

		const { error: uploadError } = await locals.supabase.storage
			.from('avatars')
			.upload(`${userId}/avatar`, fileBuffer, { contentType: file.type, upsert: true });

		if (uploadError) {
			return fail(500, { avatarError: uploadError.message });
		}

		const {
			data: { publicUrl }
		} = locals.supabase.storage.from('avatars').getPublicUrl(`${userId}/avatar`);

		const updated_at = new Date().toISOString();

		const { error: dbError } = await locals.supabase
			.from('profiles')
			.update({ avatar_url: publicUrl, updated_at })
			.eq('id', userId);

		if (dbError) {
			return fail(500, { avatarError: dbError.message });
		}

		await locals.supabase.auth.updateUser({ data: { avatar_url: publicUrl } });

		return { avatarSuccess: 'Avatar mis à jour avec succès.' };
	}
};
