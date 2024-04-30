import { CancellationToken, CodeAction, CodeActionContext, CodeActionKind, CodeActionProvider, Command, commands, ExtensionContext, languages, ProviderResult, Range, Selection, TextDocument } from 'vscode';

const DIAGNOSTIC_CODE = "NO_SKRIPT_FUNCTION";

export class addFunctionAction implements CodeActionProvider {

	provideCodeActions(document: TextDocument, range: Range | Selection, context: CodeActionContext, token: CancellationToken): ProviderResult<(CodeAction | Command)[]> {

		const relevantDiagnostics = context.diagnostics.filter( d => d.code == DIAGNOSTIC_CODE);

		if (relevantDiagnostics.length == 0) return [];

		const fixAction = new CodeAction('Add function to dictionary', CodeActionKind.QuickFix);
        fixAction.command = {
            command: 'SkriptAutocompletions.addFunction',
            title: 'Add function to dictionary'
        };
        return [fixAction];
	}
	resolveCodeAction?(codeAction: CodeAction, token: CancellationToken): ProviderResult<CodeAction> {
		return codeAction;
	}
}	

export function addFunction(context: ExtensionContext){
		// Register the code action provider
		context.subscriptions.push(
			languages.registerCodeActionsProvider('skript', new addFunctionAction())
		);
	
		// Register the command handler for fixing the issue
		context.subscriptions.push(
			commands.registerCommand('SkriptAutocompletions.addFunction', () => {
				console.log("it ran")
				// Implement the logic to fix the issue
				// For example, you might perform an automated code transformation
			})
		);
}