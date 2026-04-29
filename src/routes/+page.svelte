<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div class="p-10 text-white bg-gray-900 min-h-screen">
	<h1 class="text-4xl font-bold mb-4">Accueil MyNextWatch 🎬</h1>
	
	<div class="bg-green-900/30 border border-green-500 p-6 rounded-lg mb-8">
		<p class="text-xl text-green-400 mb-2">
			✅ C'est une excellente nouvelle ! Ça veut dire que ça marche !
		</p>
		<p class="text-gray-300">
			Si tu vois cette page d'accueil au lieu du formulaire, c'est parce que <strong>tu es déjà connecté</strong> avec succès en arrière-plan ! 
			Notre système de sécurité (le <em>Route Guard</em> qu'on a codé à l'étape 1) détecte ta session et t'interdit de retourner sur <code>/auth</code> (puisque tu es déjà connecté, ça n'a pas de sens de se reconnecter).
		</p>
	</div>
	<form action="?/logout" method="POST" use:enhance class="mt-8">
		<button type="submit" class="bg-red-600 hover:bg-red-700 font-bold text-white px-6 py-3 rounded-xl transition-colors">
			Se déconnecter (pour revoir la page /auth)
		</button>
	</form>
</div>
