import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)
const [, , ...args] = process.argv

if (args.length === 0) {
	console.error('Erreur : Veuillez fournir un message de commit.')
	process.exit(1)
}

const commitMessage = args.join(' ')

const runCommand = async (command, successMessage, errorMessage) => {
	try {
		await execPromise(command)
		console.log(successMessage)
	} catch (error) {
		console.error(`${errorMessage}\n${error.stderr}`)
		process.exit(1)
	}
}

const run = async () => {
	try {
		await runCommand('npm update', 'Mise à jour des dépendances réussite', 'Erreur de mise à jour des dépendances')
		await runCommand(
			'prettier --write --trailing-comma none --arrow-parens avoid --bracket-spacing --end-of-line crlf --single-quote --print-width 150 --use-tabs --tab-width 4 --no-semi .', 'Fichiers formatés avec Prettier.', 'Erreur lors du formatage avec Prettier.')
		await runCommand('git add .', 'Fichiers ajoutés.', "Erreur lors de l'ajout des fichiers.")
		await runCommand(`git commit -m "${commitMessage.trim()}"`, 'Commit effectué.', 'Erreur lors du commit.')
	} catch (error) {
		process.exit(1)
	}
}

run()
