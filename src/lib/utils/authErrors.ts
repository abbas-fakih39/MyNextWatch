export function mapSupabaseAuthError(error: any): string {
	if (!error) return 'Une erreur inconnue est survenue.';
	
	const msg = error.message || '';

	if (msg.includes('Invalid login credentials')) {
		return 'Email ou mot de passe incorrect.';
	}
	if (msg.includes('already registered') || msg.includes('User already exists')) {
		return 'Cet email est déjà utilisé par un autre compte.';
	}
	if (msg.includes('Password should be at least')) {
		return 'Le mot de passe doit contenir au moins 6 caractères.';
	}
	if (msg.includes('invalid email format') || msg.includes('Unable to validate email address')) {
		return 'Le format de l\'adresse email est invalide.';
	}
	if (msg.includes('Email rate limit exceeded')) {
		return 'Trop de tentatives. Veuillez patienter un moment avant de réessayer.';
	}
	
	// Message par défaut si l'erreur n'est pas répertoriée
	return 'Une erreur est survenue lors de l\'authentification. Veuillez réessayer.';
}
